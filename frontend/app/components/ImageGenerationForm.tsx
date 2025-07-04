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
}

export function ImageGenerationForm({
    formik,
    isSubmitting,
    isCompareMode,
    onCompareModeChange,
    showAdvanced,
    onShowAdvancedChange,
    error,
}: ImageGenerationFormProps) {
    const { values, handleChange, handleSubmit, setFieldValue, isValid } = formik;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-end">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isCompareMode} onChange={(e) => onCompareModeChange(e.target.checked)} className="sr-only peer" />
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
                <button type="button" onClick={onShowAdvancedChange} className="flex items-center space-x-2 text-purple-400 hover:text-purple-300">
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

            {error && (
                <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-500 rounded-md">
                    <p className="font-bold">Lỗi!</p>
                    <p>{error}</p>
                </div>
            )}
        </form>
    );
}