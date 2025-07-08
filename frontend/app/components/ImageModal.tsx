import { useEffect } from 'react';
import { XMarkIcon } from './Icon';
import type { ImageModalProps } from '~/types';
import { t, Language } from '../lib/i18n';

interface ImageModalProps {
  image: {
    image_base64: string;
    metadata: {
      model_id: string;
      prompt: string;
    };
  };
  onClose: () => void;
  language?: Language;
}

export function ImageModal({ image, onClose, language = 'vi' }: ImageModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!image) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose() }}
            role="button"
            tabIndex={0}
            aria-label={t('close', language)}
        >
            <div 
                className="relative bg-gray-900 rounded-lg shadow-xl p-4 md:p-6 max-w-4xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 z-10 p-1.5 text-white bg-gray-800 hover:bg-red-500 rounded-full"
                    aria-label={t('close', language)}
                >
                   <XMarkIcon className="w-5 h-5"/>
                </button>
                <img 
                    src={`data:image/png;base64,${image.image_base64}`} 
                    alt={image.metadata.prompt}
                    className="w-full h-auto object-contain max-h-[70vh] rounded-md"
                />
                 <div className="mt-4 text-center">
                    <p className="text-gray-300 font-semibold">{image.metadata.model_id}</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-lg mx-auto">{image.metadata.prompt}</p>
                </div>
            </div>
        </div>
    );
}