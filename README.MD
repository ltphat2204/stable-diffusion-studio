# Stable Diffusion Studio

**Stable Diffusion Studio** là một giao diện web hiện đại, dễ sử dụng, giúp bạn khám phá và thử nghiệm các mô hình **Stable Diffusion** ngay trên máy tính cá nhân.  
Ứng dụng hỗ trợ tìm kiếm mô hình trực tiếp từ Hugging Face, điều chỉnh các tham số, và tạo ra các tác phẩm nghệ thuật AI một cách nhanh chóng và thuận tiện.

---

## 🚀 Tính năng nổi bật

- **🔍 Tìm kiếm mô hình**: Tra cứu và lựa chọn các mô hình text-to-image trực tiếp từ Hugging Face Hub.  
- **📝 Tạo ảnh linh hoạt**: Nhập prompt và negative prompt để kiểm soát nội dung hình ảnh đầu ra.  
- **⚙️ Tùy chọn nâng cao**: Tinh chỉnh các thông số như `Steps`, `Guidance Scale`, kèm theo tooltip giải thích trực quan.  
- **📥 Tải xuống nhanh chóng**: Hình ảnh được tạo có thể tải về dễ dàng, tên file tự động sinh từ nội dung prompt.  
- **🖥️ Giao diện hiện đại**: Thiết kế tối màu, responsive, thân thiện với người dùng, sử dụng Remix và TailwindCSS.  
- **🚀 Tối ưu hiệu năng**: Tự động phát hiện và sử dụng GPU (NVIDIA/CUDA) để tăng tốc xử lý nếu khả dụng.  
- **📋 Quản lý form hiệu quả**: Tích hợp Formik để xử lý trạng thái form một cách mượt mà.  
- **📦 Bộ nhớ đệm mô hình**: Backend tự động lưu trữ các mô hình đã tải, giúp giảm thời gian chờ ở các lần sử dụng sau.

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

#### Terminal 1 – Chạy Backend

```bash
cd backend
# (Đảm bảo môi trường ảo đã được kích hoạt)
uvicorn main:app --reload
```

> Backend sẽ chạy tại: [http://127.0.0.1:8000](http://127.0.0.1:8000)

#### Terminal 2 – Chạy Frontend

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