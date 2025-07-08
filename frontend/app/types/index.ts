import type { GenerateRequest } from "~/lib/api";

export interface GenerateResponse {
  image_base64: string;
  metadata: GenerateRequest;
}

export interface ImageGenerationFormValues {
  modelId: string;
  modelId2: string;
  prompt: string;
  negative_prompt: string;
  height: number;
  width: number;
  num_steps: number;
  guidance_scale: number;
  num_images: number; // number of images to generate
}

export interface ModelSearchInputProps {
  fieldName: "modelId" | "modelId2";
  label: string;
  placeholder: string;
  values: ImageGenerationFormValues;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void;
  isSubmitting: boolean;
}

export interface ImageCardProps {
  result: GenerateResponse;
  onImageClick: (result: GenerateResponse) => void;
}

export interface ResultsDisplayProps {
  isSubmitting: boolean;
  actionData?: { results?: GenerateResponse[]; error?: string };
  onImageSelect: (result: GenerateResponse) => void;
}

export interface ImageModalProps {
  image: GenerateResponse | null;
  onClose: () => void;
}
