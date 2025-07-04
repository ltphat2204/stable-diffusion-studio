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
            const result2 = await generateImage({ ...basePayload, model_id: modelId2 }, backendUrl);
            results.push(result2);
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
        },
        validate: (values) => {
            const errors: Partial<ImageGenerationFormValues> = {};
            if (!values.modelId) errors.modelId = 'Bắt buộc';
            if (!values.prompt) errors.prompt = 'Bắt buộc';
            if (isCompareMode && !values.modelId2) errors.modelId2 = 'Bắt buộc';
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
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-8">
            <Tooltip id="advanced-tooltip" style={{ maxWidth: '250px', zIndex: 999 }}/>
            <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />

            <header className="w-full max-w-5xl mb-8 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    Stable Diffusion Studio
                </h1>
                <p className="text-gray-400 mt-2">Thử nghiệm và so sánh các model Stable Diffusion.</p>
            </header>

            <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <ImageGenerationForm 
                        formik={formik}
                        isSubmitting={isSubmitting}
                        isCompareMode={isCompareMode}
                        onCompareModeChange={setIsCompareMode}
                        showAdvanced={showAdvanced}
                        onShowAdvancedChange={() => setShowAdvanced(prev => !prev)}
                        error={actionData?.error}
                    />
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">
                    <ResultsDisplay 
                        isSubmitting={isSubmitting} 
                        actionData={actionData} 
                        onImageSelect={setSelectedImage}
                    />
                </div>
            </main>
        </div>
    );
}