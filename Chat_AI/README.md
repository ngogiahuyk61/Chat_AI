# Chat AI - Node.js, Express, PostgreSQL, Docker

## Mô tả
Dự án Chatbot AI sử dụng Node.js (Express), PostgreSQL (Sequelize), quản lý biến môi trường với dotenv, tích hợp OpenAI API hoặc AI nội bộ. Hệ thống chạy toàn bộ bằng Docker Compose.

## Cấu trúc thư mục

```
Chat_AI/
├── src/
│   ├── models/         # Sequelize models
│   ├── controllers/    # Xử lý request/response
│   ├── routes/         # Định nghĩa route API
│   ├── services/       # Logic nghiệp vụ
│   ├── middlewares/    # Middleware Express
│   └── agent/          # Xử lý NLP, tích hợp AI
├── config/             # Cấu hình chung (DB, dotenv)
├── public/             # Frontend tĩnh (index.html, main.js, style.css)
├── Dockerfile          # Build backend Node.js
├── docker-compose.yml  # Chạy Node.js + PostgreSQL
├── .env.example        # Mẫu biến môi trường
├── .eslintrc.js        # Cấu hình ESLint
├── .prettierrc         # Cấu hình Prettier
├── package.json        # Thông tin package Node.js
└── README.md           # Hướng dẫn
```

## Hướng dẫn build & run bằng Docker

1. **Clone repo & tạo file .env:**
   ```bash
   cp .env.example .env
   # Sửa các biến môi trường trong .env nếu cần
   ```

2. **Build & chạy toàn bộ hệ thống:**
   ```bash
   docker-compose up --build
   ```

3. **Migrate database (nếu cần):**
   ```bash
   docker-compose exec backend npx sequelize db:migrate
   ```

4. **Truy cập:**
   - API backend: http://localhost:3000/api
   - Frontend: http://localhost:3000/

## Sử dụng API Chatbot
- Gửi POST `/api/chat` với JSON `{ "message": "Xin chào" }`
- Nhận kết quả trả về từ AI

## Sử dụng RAG (Retrieval-Augmented Generation)

- **Upload file PDF/DOC để hệ thống trích xuất, nhúng, lưu vector:**
  - Endpoint: `POST /api/rag/upload` (form-data, key: file)
  - Hỗ trợ: PDF, DOCX
  - Ví dụ curl:
    ```bash
    curl -F "file=@/path/to/your/file.pdf" http://localhost:3000/api/rag/upload
    ```
- **Cơ chế trả lời:**
  - Nếu có OpenAI API key: AI sẽ trả lời dựa trên ngữ cảnh tìm được từ file đã upload (RAG + GPT-4)
  - Nếu không có key: hệ thống trả về context liên quan nhất từ dữ liệu nội bộ

## Test API
- Có thể test bằng Postman, Swagger hoặc curl như ví dụ trên.
- Gửi prompt tới `/api/chat` để nhận phản hồi AI.
- Upload file tới `/api/rag/upload` để bổ sung tri thức nội bộ.

## Lưu ý
- Đảm bảo Docker, Docker Compose đã cài đặt trên máy.
- Để đổi cấu hình DB, AI key... sửa file `.env`. 

## Hướng dẫn Docker

### 1. Build image
```bash
docker-compose build
```

### 2. Chạy toàn bộ hệ thống (backend + PostgreSQL + pgAdmin)
```bash
docker-compose up -d
```

### 3. Xem log debug
```bash
docker-compose logs -f
```

### 4. Truy cập
- Backend API: http://localhost:3000
- Frontend: http://localhost:3000 (nếu serve chung)
- pgAdmin: http://localhost:5050 (login bằng PGADMIN_EMAIL, PGADMIN_PASSWORD)

### 5. Migrate/seed database
```bash
docker-compose exec backend npx sequelize-cli db:migrate
docker-compose exec backend npx sequelize-cli db:seed:all
```

---

## Deploy trên Render/Railway

- **Render:**
  - Tạo dịch vụ Web Service, chọn repo này, chọn Dockerfile.
  - Thêm biến môi trường giống file `.env.example`.
  - Tạo thêm dịch vụ PostgreSQL (hoặc dùng managed DB của Render).
  - Kết nối DB, cập nhật biến môi trường DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.

- **Railway:**
  - Import repo, chọn deploy Dockerfile.
  - Tạo PostgreSQL plugin, copy thông tin kết nối vào biến môi trường.
  - Deploy, kiểm tra log, migrate DB như hướng dẫn trên.

**Lưu ý:**
- Luôn dùng volume cho PostgreSQL để không mất dữ liệu khi restart container.
- Đổi port nếu deploy production. 

**Cách khắc phục nhanh nhất:**

1. **Tạo file `.env` thủ công** trong thư mục chứa `docker-compose.yml` (thường là `Chat_AI/Chat_AI/`):

Nội dung mẫu:
```
PORT=3000
NODE_ENV=development
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=chat_ai
OPENAI_API_KEY=
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin123
```

2. **Lưu lại file `.env`**, sau đó chạy lại:
   ```bash
   docker-compose build
   docker-compose up -d
   ```

---

**Nếu vẫn bị lỗi cổng 5432:**
- Tắt PostgreSQL host (`brew services stop postgresql`) hoặc đổi port trong `docker-compose.yml` (ví dụ: `5433:5432`).

---

**Tóm lại:**  
- Tạo file `.env` đúng nội dung trên.
- Đảm bảo không có PostgreSQL host chiếm cổng 5432.
- Chạy lại Docker Compose.

Bạn muốn mình hướng dẫn đổi port tự động, hay chỉ cần tạo file `.env` mẫu để bạn copy? 