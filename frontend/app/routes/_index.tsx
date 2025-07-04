import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useLoaderData, useSubmit } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import debounce from 'lodash/debounce';
import { Formik } from 'formik';
import { Tooltip } from 'react-tooltip';
import TextareaAutosize from 'react-textarea-autosize';
import { generateImage, searchModels } from "~/lib/api";
import type { GenerateResponse } from "~/lib/api";
import { SparklesIcon, ChevronDownIcon, QuestionMarkCircleIcon, ArrowDownTrayIcon, XMarkIcon } from "~/components/Icon";

export const meta: MetaFunction = () => {
    return [
        { title: "Stable Diffusion Studio" },
        { name: "description", content: "So sánh các model Stable Diffusion và prompt" },
    ];
};

export async function loader() {
    const backendUrl = process.env.REMIX_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
        throw new Response("Lỗi cấu hình: Biến REMIX_PUBLIC_BACKEND_URL chưa được đặt trong file .env", { status: 500 });
    }
    return json({ backendUrl });
}

export async function action({ request }: ActionFunctionArgs) {
    const backendUrl = process.env.REMIX_PUBLIC_BACKEND_URL!;
    const formData = await request.formData();
    
    const isCompareMode = !!formData.get("modelId2");

    const basePayload = {
        prompt: formData.get("prompt") as string,
        negative_prompt: (formData.get("negative_prompt") as string) || "",
        height: Number(formData.get("height") || 512),
        width: Number(formData.get("width") || 512),
        num_steps: Number(formData.get("num_steps") || 25),
        guidance_scale: Number(formData.get("guidance_scale") || 7.5),
    };

    const modelId1 = formData.get("modelId") as string;
    if (!basePayload.prompt || !modelId1) {
        return json({ error: "Model ID và Prompt là bắt buộc." }, { status: 400 });
    }

    try {
        const results = [];
        const result1 = await generateImage({ ...basePayload, model_id: modelId1 }, backendUrl);
        results.push(result1);

        if (isCompareMode) {
            const modelId2 = formData.get("modelId2") as string;
            if(modelId2) {
                const result2 = await generateImage({ ...basePayload, model_id: modelId2 }, backendUrl);
                results.push(result2);
            }
        }
        return json({ results });
    } catch (error: unknown) {
        let errorMessage = "Đã có lỗi không xác định xảy ra.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return json({ error: errorMessage }, { status: 500 });
    }
}

interface ModelSearchInputProps {
    fieldName: string;
    label: string;
    placeholder: string;
    values: { [key: string]: string | number };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    setFieldValue: (field: string, value: string, shouldValidate?: boolean) => void;
    isSubmitting: boolean;
}

function ModelSearchInput({ fieldName, label, placeholder, values, handleChange, setFieldValue, isSubmitting }: ModelSearchInputProps) {
    const { backendUrl } = useLoaderData<typeof loader>();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearchRef = useRef(
        debounce(async (query: string) => {
            if (query.trim().length < 3) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }
            setIsSearching(true);
            try {
                const results = await searchModels(query, backendUrl);
                setSearchResults(results);
            } catch (error) { 
                console.error(error);
            } finally {
                setIsSearching(false);
            }
        }, 300)
    );

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            debouncedSearchRef.current(searchQuery);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    return (
        <div>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <div className="relative">
                <input
                    id={fieldName}
                    name={fieldName}
                    type="text"
                    value={values[fieldName]}
                    onChange={(e) => {
                        handleChange(e);
                        setSearchQuery(e.target.value);
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder={placeholder}
                    disabled={isSubmitting}
                    required
                    autoComplete="off"
                />
                {isSearching && <div className="absolute right-3 top-2.5 text-gray-400 text-xs">Đang tìm...</div>}
                {searchResults.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((m) => (
                            <li key={m}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFieldValue(fieldName, m);
                                        setSearchResults([]);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-purple-600 cursor-pointer focus:outline-none focus:bg-purple-600"
                                >{m}</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default function Index() {
    const actionData = useActionData<typeof action>() as { results?: GenerateResponse[], error?: string };
    const navigation = useNavigation();
    const submit = useSubmit();
    const isSubmitting = navigation.state === "submitting";

    const [isCompareMode, setIsCompareMode] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GenerateResponse | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedImage(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
    const handleModalClose = () => setSelectedImage(null);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-8">
            <Tooltip id="advanced-tooltip" style={{ maxWidth: '250px', zIndex: 999 }}/>
            
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={handleModalClose}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleModalClose() }}
                    role="button"
                    tabIndex={0}
                    aria-label="Đóng modal xem ảnh"
                >
                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                    <div 
                        className="relative bg-gray-900 rounded-lg shadow-xl p-4 md:p-6 max-w-4xl max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
                        }}
                        role="dialog"
                        aria-modal="true"
                    >
                        <button
                            onClick={handleModalClose}
                            className="absolute -top-3 -right-3 z-10 p-1.5 text-white bg-gray-800 hover:bg-red-500 rounded-full"
                            aria-label="Đóng"
                        >
                           <XMarkIcon className="w-5 h-5"/>
                        </button>
                        <img 
                            src={`data:image/png;base64,${selectedImage.image_base64}`} 
                            alt={selectedImage.metadata.prompt}
                            className="w-full h-auto object-contain max-h-[70vh] rounded-md"
                        />
                         <div className="mt-4 text-center">
                            <p className="text-gray-300 font-semibold">{selectedImage.metadata.model_id}</p>
                            <p className="text-xs text-gray-500 mt-1 max-w-lg mx-auto">{selectedImage.metadata.prompt}</p>
                        </div>
                    </div>
                </div>
            )}

            <header className="w-full max-w-5xl mb-8 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    Stable Diffusion Studio
                </h1>
                <p className="text-gray-400 mt-2">Thử nghiệm và so sánh các model Stable Diffusion.</p>
            </header>

            <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <Formik
                        initialValues={{
                            modelId: "",
                            modelId2: "",
                            prompt: "",
                            negative_prompt: "",
                            height: 512,
                            width: 512,
                            num_steps: 25,
                            guidance_scale: 7.5,
                        }}
                        validate={(values) => {
                            const errors: { modelId?: string; modelId2?: string; prompt?: string } = {};
                            if (!values.modelId) errors.modelId = 'Bắt buộc';
                            if (!values.prompt) errors.prompt = 'Bắt buộc';
                            if (isCompareMode && !values.modelId2) errors.modelId2 = 'Bắt buộc';
                            return errors;
                        }}
                        onSubmit={(values) => {
                            const valuesToSubmit = { ...values };
                            if (!isCompareMode) {
                                valuesToSubmit.modelId2 = "";
                            }
                            const stringifiedValues = Object.fromEntries(
                                Object.entries(valuesToSubmit).map(([key, value]) => [key, String(value)])
                            );
                            submit(stringifiedValues, { method: "post" });
                        }}
                    >
                        {({ values, handleChange, handleSubmit, setFieldValue, isValid }) => (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex justify-end">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={isCompareMode} onChange={() => setIsCompareMode(prev => !prev)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-300">Chế độ so sánh</span>
                                    </label>
                                </div>
                                
                                <div className={`grid gap-4 ${isCompareMode ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                    <ModelSearchInput fieldName="modelId" label={isCompareMode ? 'Model 1' : 'Model ID'} placeholder="Tìm model..." values={values} handleChange={handleChange} setFieldValue={setFieldValue} isSubmitting={isSubmitting} />
                                    {isCompareMode && (
                                        <ModelSearchInput fieldName="modelId2" label="Model 2" placeholder="Tìm model so sánh..." values={values} handleChange={handleChange} setFieldValue={setFieldValue} isSubmitting={isSubmitting} />
                                    )}
                                </div>
                                
                                <div>
                                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">
                                        {isCompareMode ? 'Prompt (chung cho cả 2 model)' : 'Prompt'}
                                    </label>
                                    <TextareaAutosize
                                        id="prompt" name="prompt" minRows={3} value={values.prompt} onChange={handleChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Ví dụ: a cat wearing a wizard hat, epic, cinematic, detailed, photorealistic"
                                        required disabled={isSubmitting}
                                    />
                                </div>

                                <div className="text-sm">
                                    <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center space-x-2 text-purple-400 hover:text-purple-300">
                                        <span>Tùy chọn nâng cao</span>
                                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>

                                {showAdvanced && (
                                     <div className="space-y-4 p-4 bg-gray-900/50 rounded-md">
                                        <div>
                                            <label htmlFor="negative_prompt" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 mb-1">
                                                <span>Negative Prompt</span>
                                                <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" data-tooltip-id="advanced-tooltip" data-tooltip-content="Các từ khóa để TRÁNH trong ảnh. Dùng để loại bỏ các yếu tố không mong muốn như tay xấu, chữ viết, chất lượng thấp."/>
                                            </label>
                                            <TextareaAutosize
                                                id="negative_prompt" name="negative_prompt" minRows={2} value={values.negative_prompt} onChange={handleChange}
                                                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                placeholder="blurry, low quality, worst quality, ugly, deformed" disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="num_steps" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 mb-1">
                                                    <span>Steps ({values.num_steps})</span>
                                                    <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" data-tooltip-id="advanced-tooltip" data-tooltip-content="Số bước khuếch tán. Càng cao càng chi tiết nhưng tốn thời gian hơn. (Gợi ý: 20-40)"/>
                                                </label>
                                                <input id="num_steps" name="num_steps" type="range" min="10" max="100" value={values.num_steps} onChange={handleChange} className="w-full" disabled={isSubmitting} />
                                            </div>
                                            <div>
                                                <label htmlFor="guidance_scale" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 mb-1">
                                                    <span>Guidance ({values.guidance_scale})</span>
                                                    <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" data-tooltip-id="advanced-tooltip" data-tooltip-content="Mức độ tuân thủ prompt. Càng cao ảnh càng giống prompt nhưng có thể kém sáng tạo. (Gợi ý: 7-12)"/>
                                                </label>
                                                <input id="guidance_scale" name="guidance_scale" type="range" min="1" max="20" step="0.5" value={values.guidance_scale} onChange={handleChange} className="w-full" disabled={isSubmitting} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <button type="submit" disabled={isSubmitting || !isValid} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <SparklesIcon className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`} />
                                    {isSubmitting ? "Đang tạo..." : (isCompareMode ? "Tạo & So sánh" : "Tạo ảnh")}
                                </button>

                                {actionData?.error && (
                                    <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-500 rounded-md">
                                        <p className="font-bold">Lỗi!</p>
                                        <p>{actionData.error}</p>
                                    </div>
                                )}
                            </form>
                        )}
                    </Formik>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">
                    {isSubmitting && (
                        <div className="w-full aspect-square bg-gray-700 rounded-md flex flex-col justify-center items-center animate-pulse">
                             <SparklesIcon className="w-16 h-16 text-gray-500 animate-spin" />
                            <p className="mt-4 text-gray-400">Model đang khởi động, vui lòng chờ...</p>
                        </div>
                    )}
                    {!isSubmitting && actionData?.results && (
                        <div className="w-full">
                             <p className="text-center text-sm text-gray-500 mb-4">Click vào ảnh để xem kích thước đầy đủ.</p>
                            <div className={`grid ${actionData.results.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                                {actionData.results.map((result, index) => (
                                    <div key={index} className="w-full">
                                        <button type="button" className="block w-full text-left rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500" onClick={() => setSelectedImage(result)}>
                                            <img
                                                src={`data:image/png;base64,${result.image_base64}`}
                                                alt={`Generated by ${result.metadata.model_id}`}
                                                className="w-full h-auto object-contain rounded-md shadow-md transition-transform hover:scale-105"
                                            />
                                        </button>
                                        <div className="mt-2 p-2 bg-gray-900/50 rounded-md">
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs text-gray-400 font-mono truncate mr-2">
                                                    {result.metadata.model_id}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        const safePrompt = result.metadata.prompt.slice(0, 50).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
                                                        const filename = `${safePrompt}_${Date.now()}.png`;
                                                        const link = document.createElement('a');
                                                        link.href = `data:image/png;base64,${result.image_base64}`;
                                                        link.download = filename;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }}
                                                    className="p-1.5 bg-gray-700 hover:bg-purple-600 rounded-md transition-colors"
                                                    title="Tải ảnh xuống"
                                                >
                                                    <ArrowDownTrayIcon className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {!isSubmitting && !actionData?.results && (
                        <div className="w-full aspect-square bg-gray-800 border-2 border-dashed border-gray-600 rounded-md flex flex-col justify-center items-center text-center text-gray-500">
                             <SparklesIcon className="w-16 h-16" />
                            <p className="mt-4">Hình ảnh của bạn sẽ xuất hiện ở đây</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}