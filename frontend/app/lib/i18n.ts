export type Language = "en" | "vi";

const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    appTitle: "Stable Diffusion Studio",
    // ResultsDisplay
    noResults: "No results yet. Generate an image to see results here.",
    error: "Error",
    modelStarting: "Model is starting, please wait...",
    clickImage: "Click an image to view full size.",
    imagePlaceholder: "Your image will appear here",
    // ImageModal
    close: "Close",
    download: "Download",
    // ... add more keys as needed
  },
  vi: {
    // General
    appTitle: "Stable Diffusion Studio",
    // ResultsDisplay
    noResults: "Chưa có kết quả. Hãy tạo ảnh để xem kết quả tại đây.",
    error: "Lỗi",
    modelStarting: "Model đang khởi động, vui lòng chờ...",
    clickImage: "Click vào ảnh để xem kích thước đầy đủ.",
    imagePlaceholder: "Hình ảnh của bạn sẽ xuất hiện ở đây",
    // ImageModal
    close: "Đóng",
    download: "Tải xuống",
    // ... add more keys as needed
  },
};

export function t(key: string, lang: Language): string {
  return translations[lang][key] || key;
}
