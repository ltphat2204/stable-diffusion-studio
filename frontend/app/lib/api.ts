// Định nghĩa các kiểu dữ liệu tương ứng với Pydantic Schemas của bạn
export interface GenerateRequest {
    model_id: string;
    prompt: string;
    negative_prompt?: string;
    height: number;
    width: number;
    num_steps: number;
    guidance_scale: number;
}

export interface GenerateResponse {
    image_base64: string;
    metadata: GenerateRequest;
}

export interface ModelSearchResponse {
    models: string[];
}

// Hàm tìm kiếm model, nhận baseUrl làm tham số
export async function searchModels(query: string, baseUrl: string, limit: number = 10): Promise<string[]> {
    if (!query) return [];
    const response = await fetch(`${baseUrl}/api/v1/models/search?query=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
        throw new Error("Không thể tìm kiếm model. Vui lòng thử lại.");
    }
    const data: ModelSearchResponse = await response.json();
    return data.models;
}

// Hàm tạo ảnh, nhận baseUrl làm tham số
export async function generateImage(request: GenerateRequest, baseUrl: string): Promise<GenerateResponse> {
    const response = await fetch(`${baseUrl}/api/v1/image/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Lỗi không xác định từ server.");
    }

    return response.json();
}