// app/routes/_index.tsx
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit, Form } from "@remix-run/react";
import { useState } from "react";
import { Formik, useFormik } from 'formik';
import { Tooltip } from 'react-tooltip';
import { generateImage } from "~/lib/api";
import type { GenerateResponse, ImageGenerationFormValues } from "~/types";
import { ImageGenerationForm } from "~/components/ImageGenerationForm";
import { ResultsDisplay } from "~/components/ResultsDisplay";
import { ImageModal } from "~/components/ImageModal";
import { DashboardLayout } from "../components/DashboardLayout";

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
    
    const isCompareMode = !!formData.get("modelId2") && formData.get("modelId2") !== "";
    const num_images = Math.max(1, Math.min(Number(formData.get("num_images")) || 1, 12));

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
        for (let i = 0; i < num_images; i++) {
            const result1 = await generateImage({ ...basePayload, model_id: modelId1 }, backendUrl);
            results.push(result1);
        }

        if (isCompareMode) {
            const modelId2 = formData.get("modelId2") as string;
            for (let i = 0; i < num_images; i++) {
                const result2 = await generateImage({ ...basePayload, model_id: modelId2 }, backendUrl);
                results.push(result2);
            }
        }
        return json({ results, error: "" }, { status: 200 });
    } catch (error: unknown) {
        let errorMessage = "Đã có lỗi không xác định xảy ra.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return json({ error: errorMessage }, { status: 500 });
    }
}

export default function Index() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const [isCompareMode, setIsCompareMode] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GenerateResponse | null>(null);
    const submit = useSubmit();
    const [language, setLanguage] = useState<'vi' | 'en'>('vi');

    const formik = useFormik<ImageGenerationFormValues>({
        initialValues: {
            modelId: "",
            modelId2: "",
            prompt: "",
            negative_prompt: "",
            height: 512,
            width: 512,
            num_steps: 25,
            guidance_scale: 7.5,
            num_images: 1,
        },
        validate: (values) => {
            const errors: Partial<ImageGenerationFormValues> = {};
            if (!values.modelId) errors.modelId = 'Bắt buộc';
            if (!values.prompt) errors.prompt = 'Bắt buộc';
            if (isCompareMode && !values.modelId2) errors.modelId2 = 'Bắt buộc';
            if (values.num_images < 1 || values.num_images > 12) errors.num_images = '1-12';
            return errors;
        },
        onSubmit: (values) => {
            const valuesToSubmit = { ...values };
            if (!isCompareMode) {
                valuesToSubmit.modelId2 = "";
            }
            const stringifiedValues = Object.fromEntries(
                Object.entries(valuesToSubmit).map(([key, value]) => [key, String(value)])
            );
            submit(stringifiedValues, { method: "post" });
        },
    });

    return (
        <DashboardLayout
            sidebar={
                <>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4 text-left w-full">Stable Diffusion Studio</h1>
                    {/* Logo removed as requested */}
                    <ImageGenerationForm 
                        formik={formik}
                        isSubmitting={isSubmitting}
                        isCompareMode={isCompareMode}
                        onCompareModeChange={setIsCompareMode}
                        showAdvanced={showAdvanced}
                        onShowAdvancedChange={() => setShowAdvanced(prev => !prev)}
                        error={actionData?.error}
                        language={language}
                    />
                </>
            }
            main={
                <>
                    {/* Top bar with language selector */}
                    <div className="h-16 w-full flex items-center border-b border-gray-700 mb-6 px-4 justify-end">
                        <div className="flex gap-2 items-center mt-4 mb-2">
                            <button
                                className={`px-3 py-1 rounded-md font-medium ${language === 'en' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                                onClick={() => setLanguage('en')}
                                type="button"
                            >
                                English
                            </button>
                            <button
                                className={`px-3 py-1 rounded-md font-medium ${language === 'vi' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                                onClick={() => setLanguage('vi')}
                                type="button"
                            >
                                Tiếng Việt
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <Tooltip id="advanced-tooltip" style={{ maxWidth: '250px', zIndex: 999 }}/>
                        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} language={language} />
                        <ResultsDisplay 
                            isSubmitting={isSubmitting} 
                            actionData={actionData} 
                            onImageSelect={setSelectedImage}
                            language={language}
                        />
                    </div>
                </>
            }
        />
    );
}