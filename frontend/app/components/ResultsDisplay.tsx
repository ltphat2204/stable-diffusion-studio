import { ImageCard } from './ImageCard';
import { SparklesIcon } from './Icon';
import type { ResultsDisplayProps } from '~/types';
import { t, Language } from '../lib/i18n';
import { useMemo } from 'react';

interface ResultsDisplayProps {
    isSubmitting: boolean;
    actionData: { results: any[] } | null;
    onImageSelect: (result: any) => void;
    language?: Language;
}

export function ResultsDisplay({ isSubmitting, actionData, onImageSelect, language = 'vi' }: ResultsDisplayProps) {
    // Determine how many skeletons to show
    const numImages = useMemo(() => {
        if (actionData?.results && actionData.results.length > 0) return actionData.results.length;
        if (actionData?.num_images) return actionData.num_images;
        // Try to get from form if available (fallback)
        if (typeof window !== 'undefined') {
            const form = document.querySelector('form');
            if (form) {
                const input = form.querySelector('input[name="num_images"]') as HTMLInputElement;
                if (input) return Number(input.value) || 1;
            }
        }
        return 1;
    }, [actionData]);

    // Skeleton card
    const SkeletonCard = () => (
        <div className="w-40 h-40 bg-gray-800 rounded-md animate-pulse flex items-center justify-center">
            <SparklesIcon className="w-10 h-10 text-gray-600 animate-spin" />
        </div>
    );

    if (isSubmitting) {
        // Try to detect compare mode from form
        let compare = false;
        let numCompare = 1;
        if (typeof window !== 'undefined') {
            const form = document.querySelector('form');
            if (form) {
                const input = form.querySelector('input[name="modelId2"]') as HTMLInputElement;
                if (input && input.value) compare = true;
                const numInput = form.querySelector('input[name="num_images"]') as HTMLInputElement;
                if (numInput) numCompare = Number(numInput.value) || 1;
            }
        }
        if (compare) {
            return (
                <div className="w-full h-full flex flex-col min-h-0">
                    <div className="grid grid-cols-2 gap-4 h-full min-h-0">
                        {[0, 1].map((lane) => (
                            <div key={lane} className="flex flex-col h-full">
                                <div className="mb-2 text-center font-semibold text-purple-400 text-sm truncate">
                                    {lane === 0 ? 'Model 1' : 'Model 2'}
                                </div>
                                <div className="flex-1 flex flex-col gap-4 items-center overflow-y-auto">
                                    {Array.from({ length: numCompare }).map((_, idx) => (
                                        <SkeletonCard key={idx} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        // Single mode skeletons
        return (
            <div className="w-full h-full flex flex-col min-h-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 h-full min-h-0">
                    {Array.from({ length: numImages }).map((_, idx) => (
                        <SkeletonCard key={idx} />
                    ))}
                </div>
            </div>
        );
    }

    if (actionData?.results && actionData.results.length > 0) {
        // Detect comparison mode: even number of results, and >1 model
        const isCompare = actionData.results.length > 1 && actionData.results.length % 2 === 0;
        if (isCompare) {
            const half = actionData.results.length / 2;
            const model1Images = actionData.results.slice(0, half);
            const model2Images = actionData.results.slice(half);
            return (
                <div className="w-full h-full flex flex-col min-h-0">
                    <p className="text-center text-sm text-gray-500 mb-4">{t('clickImage', language)}</p>
                    <div className="grid grid-cols-2 gap-4 h-full min-h-0">
                        {[model1Images, model2Images].map((images, laneIdx) => (
                            <div key={laneIdx} className="flex flex-col h-full">
                                <div className="mb-2 text-center font-semibold text-purple-400 text-sm truncate">
                                    {images[0]?.metadata.model_id}
                                </div>
                                <div className="grid grid-cols-3 gap-x-2 gap-y-1 flex-1">
                                    {images.map((result, idx) => (
                                        <ImageCard key={idx} result={result} onImageClick={onImageSelect} label={result.metadata.model_id} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        // Single mode: 6-column grid
        return (
            <div className="w-full h-full flex flex-col min-h-0">
                <p className="text-center text-sm text-gray-500 mb-4">{t('clickImage', language)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 h-full min-h-0">
                    {actionData.results.map((result, idx) => (
                        <ImageCard key={idx} result={result} onImageClick={onImageSelect} label={result.metadata.model_id} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full aspect-square bg-gray-800 border-2 border-dashed border-gray-600 rounded-md flex flex-col justify-center items-center text-center text-gray-500 h-full">
            <SparklesIcon className="w-16 h-16" />
            <p className="mt-4">{t('imagePlaceholder', language)}</p>
        </div>
    );
}