import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useLoaderData, useSubmit } from "@remix-run/react";
import { useState, useEffect, useCallback } from "react";
import debounce from 'lodash/debounce';
import { Formik } from 'formik';
import { Tooltip } from 'react-tooltip';
import TextareaAutosize from 'react-textarea-autosize';
import { generateImage, searchModels } from "~/lib/api";
import type { GenerateResponse } from "~/lib/api";
import { SparklesIcon, ChevronDownIcon, QuestionMarkCircleIcon, ArrowDownTrayIcon } from "~/components/Icon";

export const meta: MetaFunction = () => {
    return [
        { title: "Stable Diffusion Studio" },
        { name: "description", content: "Thử nghiệm các model Stable Diffusion và prompt" },
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
    
    const payload = {
        model_id: formData.get("modelId") as string,
        prompt: formData.get("prompt") as string,
        negative_prompt: (formData.get("negative_prompt") as string) || "",
        height: Number(formData.get("height") || 512),
        width: Number(formData.get("width") || 512),
        num_steps: Number(formData.get("num_steps") || 25),
        guidance_scale: Number(formData.get("guidance_scale") || 7.5),
    };

    if (!payload.prompt || !payload.model_id) {
        return json({ error: "Model ID và Prompt là bắt buộc." }, { status: 400 });
    }

    try {
        const result = await generateImage(payload, backendUrl);
        return json(result);
    } catch (error: unknown) {
        let errorMessage = "Đã có lỗi không xác định xảy ra.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return json({ error: errorMessage }, { status: 500 });
    }
}

export default function Index() {
    const { backendUrl } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>() as GenerateResponse & { error?: string };
    const navigation = useNavigation();
    const submit = useSubmit();
    const isSubmitting = navigation.state === "submitting";

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearch = useCallback(
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
        }, 300),
        [backendUrl]
    );

    const handleDownload = (base64: string, filename: string) => {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${base64}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const createFilename = (prompt: string) => {
        const safePrompt = prompt.slice(0, 50).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        return `${safePrompt}_${Date.now()}.png`;
    };

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            debouncedSearch(searchQuery);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, debouncedSearch]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-8">
            <Tooltip id="advanced-tooltip" style={{ maxWidth: '250px', zIndex: 999 }}/>
            <header className="w-full max-w-5xl mb-8 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    Stable Diffusion Studio
                </h1>
                <p className="text-gray-400 mt-2">Thử nghiệm các model và prompt một cách dễ dàng.</p>
            </header>

            <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <Formik
                        initialValues={{
                            modelId: "",
                            prompt: "",
                            negative_prompt: "",
                            height: 512,
                            width: 512,
                            num_steps: 25,
                            guidance_scale: 7.5,
                        }}
                        validate={(values) => {
                            const errors: { modelId?: string; prompt?: string } = {};
                            if (!values.modelId) {
                                errors.modelId = 'Bắt buộc';
                            }
                            if (!values.prompt) {
                                errors.prompt = 'Bắt buộc';
                            }
                            return errors;
                        }}
                        onSubmit={(values) => {
                            const stringifiedValues = Object.fromEntries(
                                Object.entries(values).map(([key, value]) => [key, String(value)])
                            );
                            submit(stringifiedValues, { method: "post" });
                        }}
                    >
                        {({ values, handleChange, handleSubmit, setFieldValue, isValid }) => (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative">
                                    <label htmlFor="modelId" className="block text-sm font-medium text-gray-300 mb-1">Model ID</label>
                                    <input
                                        id="modelId"
                                        name="modelId"
                                        type="text"
                                        value={values.modelId}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setSearchQuery(e.target.value);
                                        }}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Tìm và chọn một model, ví dụ: 'openjourney'"
                                        disabled={isSubmitting}
                                        required
                                        autoComplete="off"
                                    />
                                    {isSearching && <div className="absolute right-3 top-9 text-gray-400 text-xs">Đang tìm...</div>}
                                    {searchResults.length > 0 && (
                                        <ul className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                            {searchResults.map((m) => (
                                                <li key={m}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFieldValue('modelId', m);
                                                            setSearchResults([]);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-purple-600 cursor-pointer focus:outline-none focus:bg-purple-600"
                                                    >{m}</button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                
                                <div>
                                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">Prompt</label>
                                    <TextareaAutosize
                                        id="prompt"
                                        name="prompt"
                                        minRows={4}
                                        value={values.prompt}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Ví dụ: a cat wearing a wizard hat, epic, cinematic, detailed, photorealistic"
                                        required
                                        disabled={isSubmitting}
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
                                                <QuestionMarkCircleIcon 
                                                    className="w-4 h-4 text-gray-500" 
                                                    data-tooltip-id="advanced-tooltip"
                                                    data-tooltip-content="Các từ khóa để TRÁNH trong ảnh. Dùng để loại bỏ các yếu tố không mong muốn như tay xấu, chữ viết, chất lượng thấp."
                                                />
                                            </label>
                                            <TextareaAutosize
                                                id="negative_prompt"
                                                name="negative_prompt"
                                                minRows={2}
                                                value={values.negative_prompt}
                                                onChange={handleChange}
                                                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                placeholder="blurry, low quality, worst quality, ugly, deformed"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="num_steps" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 mb-1">
                                                    <span>Steps ({values.num_steps})</span>
                                                    <QuestionMarkCircleIcon 
                                                        className="w-4 h-4 text-gray-500" 
                                                        data-tooltip-id="advanced-tooltip"
                                                        data-tooltip-content="Số bước khuếch tán. Càng cao càng chi tiết nhưng tốn thời gian hơn. (Gợi ý: 20-40)"
                                                    />
                                                </label>
                                                <input
                                                    id="num_steps"
                                                    name="num_steps"
                                                    type="range"
                                                    min="10" max="100"
                                                    value={values.num_steps}
                                                    onChange={handleChange}
                                                    className="w-full"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="guidance_scale" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 mb-1">
                                                    <span>Guidance ({values.guidance_scale})</span>
                                                    <QuestionMarkCircleIcon 
                                                        className="w-4 h-4 text-gray-500" 
                                                        data-tooltip-id="advanced-tooltip"
                                                        data-tooltip-content="Mức độ tuân thủ prompt. Càng cao ảnh càng giống prompt nhưng có thể kém sáng tạo. (Gợi ý: 7-12)"
                                                    />
                                                </label>
                                                <input
                                                    id="guidance_scale"
                                                    name="guidance_scale"
                                                    type="range"
                                                    min="1" max="20" step="0.5"
                                                    value={values.guidance_scale}
                                                    onChange={handleChange}
                                                    className="w-full"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !isValid}
                                    className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <SparklesIcon className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`} />
                                    {isSubmitting ? "Đang tạo ảnh..." : "Tạo ảnh"}
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
                    {!isSubmitting && actionData?.image_base64 && (
                        <div className="w-full">
                            <img
                                src={`data:image/png;base64,${actionData.image_base64}`}
                                alt="Generated by Stable Diffusion"
                                className="w-full h-auto object-contain rounded-md shadow-md"
                            />
                            <div className="mt-4 flex justify-between items-center">
                                <div className="p-3 bg-gray-900/50 rounded-md text-xs text-gray-400 overflow-hidden flex-1 mr-4">
                                    <p className="font-bold text-gray-300">Metadata:</p>
                                    <p className="truncate"><strong>Model:</strong> {actionData.metadata.model_id}</p>
                                    <p className="truncate"><strong>Prompt:</strong> {actionData.metadata.prompt}</p>
                                </div>
                                <button
                                    onClick={() => handleDownload(actionData.image_base64, createFilename(actionData.metadata.prompt))}
                                    className="p-3 bg-gray-700 hover:bg-purple-600 rounded-md transition-colors"
                                    title="Tải ảnh xuống"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    )}
                    {!isSubmitting && !actionData?.image_base64 && (
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