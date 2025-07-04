import { ImageCard } from './ImageCard';
import { SparklesIcon } from './Icon';
import type { ResultsDisplayProps } from '~/types';

export function ResultsDisplay({ isSubmitting, actionData, onImageSelect }: ResultsDisplayProps) {
    if (isSubmitting) {
        return (
            <div className="w-full aspect-square bg-gray-700 rounded-md flex flex-col justify-center items-center animate-pulse">
                <SparklesIcon className="w-16 h-16 text-gray-500 animate-spin" />
                <p className="mt-4 text-gray-400">Model đang khởi động, vui lòng chờ...</p>
            </div>
        );
    }

    if (actionData?.results && actionData.results.length > 0) {
        return (
            <div className="w-full">
                 <p className="text-center text-sm text-gray-500 mb-4">Click vào ảnh để xem kích thước đầy đủ.</p>
                <div className={`grid ${actionData.results.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                    {actionData.results.map((result, index) => (
                        <ImageCard key={index} result={result} onImageClick={onImageSelect} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full aspect-square bg-gray-800 border-2 border-dashed border-gray-600 rounded-md flex flex-col justify-center items-center text-center text-gray-500">
            <SparklesIcon className="w-16 h-16" />
            <p className="mt-4">Hình ảnh của bạn sẽ xuất hiện ở đây</p>
        </div>
    );
}