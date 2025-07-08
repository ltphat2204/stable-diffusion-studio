import type { FormikProps } from 'formik';
import TextareaAutosize from 'react-textarea-autosize';
import { ModelSearchInput } from './ModelSearchInput';
import { ChevronDownIcon, QuestionMarkCircleIcon, SparklesIcon } from './Icon';
import type { ImageGenerationFormValues } from '~/types';

interface ImageGenerationFormProps {
    formik: FormikProps<ImageGenerationFormValues>;
    isSubmitting: boolean;
    isCompareMode: boolean;
    onCompareModeChange: (checked: boolean) => void;
    showAdvanced: boolean;
    onShowAdvancedChange: () => void;
    error?: string;
    language?: 'en' | 'vi';
}

export function ImageGenerationForm({
    formik,
    isSubmitting,
    isCompareMode,
    onCompareModeChange,
    showAdvanced,
    onShowAdvancedChange,
    error,
    language = 'vi',
}: ImageGenerationFormProps) {
    const { values, handleChange, handleSubmit, setFieldValue, isValid } = formik;

    const t = {
        en: {
            compareMode: 'Compare mode',
            model1: 'Model 1',
            model2: 'Model 2',
            modelId: 'Model ID',
            prompt: 'Prompt',
            promptBoth: 'Prompt (shared for both models)',
            promptPlaceholder: 'E.g.: a cat wearing a wizard hat, epic, cinematic, detailed, photorealistic',
            advanced: 'Advanced options',
            negativePrompt: 'Negative Prompt',
            negativePromptTooltip: 'Keywords to AVOID in the image. Use to remove unwanted elements like bad hands, text, low quality.',
            negativePromptPlaceholder: 'blurry, low quality, worst quality, ugly, deformed',
            steps: 'Steps',
            stepsTooltip: 'Number of diffusion steps. Higher means more detail but slower. (Suggested: 20-40)',
            guidance: 'Guidance',
            guidanceTooltip: 'Prompt adherence. Higher means more like the prompt but less creative. (Suggested: 7-12)',
            generate: 'Generate',
            generateAndCompare: 'Generate & Compare',
            generating: 'Generating...',
            required: 'Required',
            errorTitle: 'Error!',
            modelPromptRequired: 'Model ID and Prompt are required.',
            numImages: 'Number of images',
        },
        vi: {
            compareMode: 'Chế độ so sánh',
            model1: 'Model 1',
            model2: 'Model 2',
            modelId: 'Model ID',
            prompt: 'Prompt',
            promptBoth: 'Prompt (chung cho cả 2 model)',
            promptPlaceholder: 'Ví dụ: a cat wearing a wizard hat, epic, cinematic, detailed, photorealistic',
            advanced: 'Tùy chọn nâng cao',
            negativePrompt: 'Negative Prompt',
            negativePromptTooltip: 'Các từ khóa để TRÁNH trong ảnh. Dùng để loại bỏ các yếu tố không mong muốn như tay xấu, chữ viết, chất lượng thấp.',
            negativePromptPlaceholder: 'blurry, low quality, worst quality, ugly, deformed',
            steps: 'Steps',
            stepsTooltip: 'Số bước khuếch tán. Càng cao càng chi tiết nhưng tốn thời gian hơn. (Gợi ý: 20-40)',
            guidance: 'Guidance',
            guidanceTooltip: 'Mức độ tuân thủ prompt. Càng cao ảnh càng giống prompt nhưng có thể kém sáng tạo. (Gợi ý: 7-12)',
            generate: 'Tạo ảnh',
            generateAndCompare: 'Tạo & So sánh',
            generating: 'Đang tạo...',
            required: 'Bắt buộc',
            errorTitle: 'Lỗi!',
            modelPromptRequired: 'Model ID và Prompt là bắt buộc.',
            numImages: 'Số lượng ảnh',
        },
    }[language];

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg mx-auto">
            <div className="flex justify-start">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isCompareMode} onChange={(e) => onCompareModeChange(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-300">{t.compareMode}</span>
                </label>
            </div>
            
            <div className={`grid gap-4 ${isCompareMode ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <ModelSearchInput fieldName="modelId" label={isCompareMode ? t.model1 : t.modelId} placeholder={t.modelId} values={values} handleChange={handleChange} setFieldValue={setFieldValue} isSubmitting={isSubmitting} />
                {isCompareMode && (
                    <ModelSearchInput fieldName="modelId2" label={t.model2} placeholder={t.model2} values={values} handleChange={handleChange} setFieldValue={setFieldValue} isSubmitting={isSubmitting} />
                )}
            </div>
            
            <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">
                    {isCompareMode ? t.promptBoth : t.prompt}
                </label>
                <TextareaAutosize
                    id="prompt" name="prompt" minRows={3} value={values.prompt} onChange={handleChange}
                    className="w-full max-w-lg bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder={t.promptPlaceholder}
                    required disabled={isSubmitting}
                />
            </div>
            <div>
                <label htmlFor="num_images" className="block text-sm font-medium text-gray-300 mb-1">
                    {t.numImages}
                </label>
                <input
                    id="num_images"
                    name="num_images"
                    type="number"
                    min={1}
                    max={12}
                    value={values.num_images}
                    onChange={handleChange}
                    className="w-full max-w-lg bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={isSubmitting}
                />
            </div>

            <div className="text-sm">
                <button type="button" onClick={onShowAdvancedChange} className="flex items-center space-x-2 text-purple-400 hover:text-purple-300">
                    <span>{t.advanced}</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {showAdvanced && (
                    <div className="space-y-4 p-4 bg-gray-900/50 rounded-md w-full max-w-lg">
                    <div>
                        <label htmlFor="negative_prompt" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 mb-1">
                            <span>{t.negativePrompt}</span>
                            <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" data-tooltip-id="advanced-tooltip" data-tooltip-content={t.negativePromptTooltip}/>
                        </label>
                        <TextareaAutosize
                            id="negative_prompt" name="negative_prompt" minRows={2} value={values.negative_prompt} onChange={handleChange}
                            className="w-full max-w-lg bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder={t.negativePromptPlaceholder} disabled={isSubmitting}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="num_steps" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 mb-1">
                                <span>{t.steps} ({values.num_steps})</span>
                                <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" data-tooltip-id="advanced-tooltip" data-tooltip-content={t.stepsTooltip}/>
                            </label>
                            <input id="num_steps" name="num_steps" type="range" min="10" max="100" value={values.num_steps} onChange={handleChange} className="w-full" disabled={isSubmitting} />
                        </div>
                        <div>
                            <label htmlFor="guidance_scale" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 mb-1">
                                <span>{t.guidance} ({values.guidance_scale})</span>
                                <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" data-tooltip-id="advanced-tooltip" data-tooltip-content={t.guidanceTooltip}/>
                            </label>
                            <input id="guidance_scale" name="guidance_scale" type="range" min="1" max="20" step="0.5" value={values.guidance_scale} onChange={handleChange} className="w-full" disabled={isSubmitting} />
                        </div>
                    </div>
                </div>
            )}
            
            <button type="submit" disabled={isSubmitting || !isValid} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                <SparklesIcon className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`} />
                {isSubmitting ? t.generating : (isCompareMode ? t.generateAndCompare : t.generate)}
            </button>

            {error && (
                <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-500 rounded-md">
                    <p className="font-bold">{t.errorTitle}</p>
                    <p>{error}</p>
                </div>
            )}
        </form>
    );
}