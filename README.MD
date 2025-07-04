# Stable Diffusion Studio

**Stable Diffusion Studio** là một giao diện web hiện đại, dễ sử dụng, giúp bạn khám phá và thử nghiệm các mô hình **Stable Diffusion** ngay trên máy tính cá nhân.  
Ứng dụng hỗ trợ tìm kiếm mô hình trực tiếp từ Hugging Face, điều chỉnh các tham số, và tạo ra các tác phẩm nghệ thuật AI một cách nhanh chóng và thuận tiện.

---

## 📸 Demo

### Giao diện
![Screen](/docs/screen.png)

### Tạo ảnh
![Demo](/docs/demo.png)

### So sánh mô hình
![Compare](/docs/compare.png)

### Xem ảnh chi tiết
![Modal](/docs/modal.png)

## 🚀 Tính năng nổi bật

-   **🎨 Chế độ So sánh Model:** Tính năng cốt lõi cho phép bạn tạo ảnh từ **hai model khác nhau** với cùng một prompt và cấu hình, giúp so sánh trực quan hiệu quả của từng model.
-   **🖼️ Xem ảnh chi tiết (Modal Viewer):** Click vào bất kỳ ảnh nào để xem ở kích thước lớn hơn trong một modal tiện lợi.
-   **🔍 Tìm kiếm Model động:** Tìm kiếm và lựa chọn các model text-to-image trực tiếp từ Hugging Face Hub.
-   **⚙️ Tùy chỉnh Nâng cao:** Toàn quyền kiểm soát các tham số quan trọng như Steps, Guidance Scale, và Negative Prompt, với tooltip giải thích chi tiết.
-   **📥 Tải ảnh dễ dàng:** Tải xuống hình ảnh đã tạo chỉ với một cú nhấp chuột.
-   **✨ Giao diện Hiện đại & Thông minh:**
    -   Giao diện dark-mode, responsive, thân thiện người dùng.
    -   Các ô nhập prompt tự động co giãn theo nội dung.
    -   Giao diện tự động thay đổi khi bật/tắt chế độ so sánh.
-   **🚀 Tối ưu Hiệu năng:**
    -   Backend tự động tận dụng GPU (NVIDIA/CUDA) nếu có để tăng tốc độ tạo ảnh.
    -   Frontend gọi API tuần tự ở chế độ so sánh để tránh quá tải VRAM.
    -   Model đã tải được cache lại để không phải chờ đợi ở những lần tạo ảnh sau.
---

## 🛠️ Công nghệ sử dụng

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch" />
  <img src="https://img.shields.io/badge/Remix-000000?style=for-the-badge&logo=remix&logoColor=white" alt="Remix" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

### 🔧 Backend

- **Framework**: FastAPI  
- **AI/ML**: PyTorch, Hugging Face Diffusers, Transformers, Accelerate  
- **Web Server**: Uvicorn  

### 🎨 Frontend

- **Framework**: Remix  
- **UI**: React + TailwindCSS  
- **Quản lý Form**: Formik  
- **Ngôn ngữ**: TypeScript  

---

## ⚙️ Hướng dẫn cài đặt & sử dụng

### Yêu cầu hệ thống

- Python 3.10 trở lên  
- Node.js 18+ và npm  
- **Khuyến nghị**: GPU NVIDIA (tối thiểu 6GB VRAM) và đã cài CUDA drivers phù hợp.

---

### 1. Clone dự án

```bash
git clone https://github.com/your-username/stable-diffusion-studio.git
cd stable-diffusion-studio
```

---

### 2. Cài đặt Backend

#### a. Tạo và kích hoạt môi trường ảo

```bash
cd backend
python -m venv venv
```

**Windows**:

```powershell
.\venv\Scripts\activate
```

**macOS/Linux**:

```bash
source venv/bin/activate
```

#### b. Cài đặt PyTorch (bắt buộc thủ công)

**Không cài đặt torch từ `requirements.txt`.**  
Hãy truy cập [https://pytorch.org/get-started/locally/](https://pytorch.org/get-started/locally/) để lấy lệnh cài đặt phù hợp với hệ thống của bạn.

Ví dụ cho Windows + CUDA 12.1:

```bash
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

#### c. Cài đặt các thư viện còn lại

```bash
pip install -r requirements.txt
```

---

### 3. Cài đặt Frontend

```bash
cd ../frontend
npm install
```

---

### 4. Cấu hình môi trường

#### a. Tạo file `.env` từ mẫu

**Windows**:

```bash
copy .env.example .env
```

**macOS/Linux**:

```bash
cp .env.example .env
```

#### b. Cập nhật URL backend trong file `.env`  
Ví dụ: `http://127.0.0.1:8000`

---

### 5. Chạy ứng dụng

#### Terminal 1 - Chạy Backend

```bash
cd backend
# (Đảm bảo môi trường ảo đã được kích hoạt)
uvicorn main:app --reload
```

> Backend sẽ chạy tại: [http://127.0.0.1:8000](http://127.0.0.1:8000)

#### Terminal 2 - Chạy Frontend

```bash
cd frontend
npm run dev
```

---

### 6. Truy cập ứng dụng

Mở trình duyệt và truy cập:  
🔗 [http://localhost:3000](http://localhost:3000) (hoặc port khác nếu 3000 đang được sử dụng)

Bây giờ bạn đã sẵn sàng để bắt đầu sáng tạo với AI!

---