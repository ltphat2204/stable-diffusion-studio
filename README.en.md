
# Stable Diffusion Studio

Tìm kiếm phiên bản tiếng Việt? [Click vào đây](/README.md)

**Stable Diffusion Studio** is a modern, user-friendly web interface that lets you explore and experiment with **Stable Diffusion** models right on your personal computer.  
The app allows you to search models directly from Hugging Face, tweak parameters, and generate AI artworks quickly and conveniently.

---

## 📸 Demo

### Interface
![Screen](/docs/screen.png)

### Image Generation
![Demo](/docs/demo.png)

### Model Comparison
![Compare](/docs/compare.png)

### View Images in Detail
![Modal](/docs/modal.png)

## 🚀 Highlight Features

-   **🎨 Model Comparison Mode:** A core feature that lets you generate images from **two different models** using the same prompt and settings, enabling intuitive visual comparison.
-   **🖼️ Modal Viewer:** Click any image to view it in a larger size inside a handy modal.
-   **🔍 Dynamic Model Search:** Search and select text-to-image models directly from the Hugging Face Hub.
-   **⚙️ Advanced Customization:** Full control over key parameters like Steps, Guidance Scale, and Negative Prompt, with detailed tooltips.
-   **📥 Easy Image Download:** Download your generated images with a single click.
-   **✨ Modern & Smart UI:**
    -   Dark-mode, responsive, and user-friendly interface.
    -   Prompt input boxes auto-resize to fit content.
    -   The interface automatically adjusts when toggling comparison mode.
-   **🚀 Performance Optimized:**
    -   Backend automatically utilizes GPU (NVIDIA/CUDA) if available to accelerate image generation.
    -   Frontend calls APIs sequentially in comparison mode to avoid VRAM overload.
    -   Loaded models are cached to eliminate waiting times in future generations.

---

## 🛠️ Tech Stack

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

- **Framework:** FastAPI  
- **AI/ML:** PyTorch, Hugging Face Diffusers, Transformers, Accelerate  
- **Web Server:** Uvicorn  

### 🎨 Frontend

- **Framework:** Remix  
- **UI:** React + TailwindCSS  
- **Form Management:** Formik  
- **Language:** TypeScript  

---

## ⚙️ Installation & Usage Guide

### System Requirements

- Python 3.10 or higher  
- Node.js 18+ and npm  
- **Recommended:** NVIDIA GPU (at least 6GB VRAM) with proper CUDA drivers installed.

---

### 1. Clone the project

```bash
git clone https://github.com/your-username/stable-diffusion-studio.git
cd stable-diffusion-studio
```

---

### 2. Install Backend

#### a. Create and activate virtual environment

```bash
cd backend
python -m venv venv
```

**Windows:**

```powershell
.env\Scriptsctivate
```

**macOS/Linux:**

```bash
source venv/bin/activate
```

#### b. Manually install PyTorch (mandatory)

**Do NOT install torch from `requirements.txt`.**  
Visit [https://pytorch.org/get-started/locally/](https://pytorch.org/get-started/locally/) to get the appropriate install command for your system.

Example for Windows + CUDA 12.1:

```bash
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

#### c. Install other dependencies

```bash
pip install -r requirements.txt
```

---

### 3. Install Frontend

```bash
cd ../frontend
npm install
```

---

### 4. Configure environment

#### a. Create `.env` file from example

**Windows:**

```bash
copy .env.example .env
```

**macOS/Linux:**

```bash
cp .env.example .env
```

#### b. Update backend URL in `.env`  
For example: `http://127.0.0.1:8000`

---

### 5. Run the application

#### Terminal 1 - Start Backend

```bash
cd backend
# (Make sure virtual environment is activated)
uvicorn main:app --reload
```

> Backend will be running at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

#### Terminal 2 - Start Frontend

```bash
cd frontend
npm run dev
```

---

### 6. Access the app

Open your browser and visit:  
🔗 [http://localhost:3000](http://localhost:3000) (or another port if 3000 is occupied)

Now you're ready to start creating with AI!

---
