# 🛠️ Hệ thống Quản lý Mượn trả Thiết bị 

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![UmiJS](https://img.shields.io/badge/UmiJS-4.x-red.svg)](https://umijs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Một giải pháp full-stack toàn diện được thiết kế cho các câu lạc bộ đại học nhằm tối ưu hóa việc quản lý kho thiết bị, theo dõi quy trình mượn trả thời gian thực, tự động tính toán tiền phạt và thúc đẩy tương tác trong cộng đồng.

---

## 🌟 Tính năng chính

### 📦 Quản lý Kho & Bảo trì
- **Theo dõi thông minh:** Giám sát trạng thái thiết bị theo thời gian thực (Sẵn sàng, Hết hàng, Đang bảo trì).
- **Bảo vệ dữ liệu:** Sử dụng Pessimistic Locking để đảm bảo tính toàn vẹn dữ liệu khi có nhiều yêu cầu mượn cùng lúc.
- **Bảo trì tự động:** Kích hoạt quy trình bảo trì chỉ với một lần nhấp, tự động gửi thông báo email cho quản trị viên.

### 🔄 Quy trình Mượn trả
- **Quy trình chuẩn hóa:** Quản lý toàn bộ vòng đời: Yêu cầu → Phê duyệt/Từ chối → Trả thiết bị.
- **Kiểm soát điều kiện:** Ngăn chặn mượn đồ đối với người dùng đang có khoản phạt chưa thanh toán hoặc có thiết bị quá hạn.
- **Quản lý linh hoạt:** Quản trị viên có thể tạo yêu cầu mượn thay cho người dùng khác.

### 💰 Tiền phạt & Cấu hình hệ thống
- **Tự động tính phạt:** Tính toán phí quá hạn dựa trên mức phí hàng ngày được thiết lập trong hệ thống.
- **Cấu hình toàn cục:** Dễ dàng điều chỉnh số ngày mượn tối đa, mức phí phạt và chính sách mượn thông qua bảng điều khiển admin.

### 💬 Cộng đồng & Tương tác
- **Diễn đàn thảo luận:** Nền tảng tích hợp để chia sẻ kiến thức và đề xuất thiết bị mới.
- **Thông báo hệ thống:** Hệ thống phát tin chính thức cho các thông báo từ ban quản trị.
- **Nhật ký hệ thống (Audit Logs):** Lưu trữ lịch sử mọi hành động quan trọng của quản trị viên để đảm bảo tính minh bạch.

---

## 🏗️ Công nghệ sử dụng

| Lớp | Công nghệ |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.4.2, Spring Security (JWT), Spring Data JPA, Hibernate |
| **Frontend** | React 18, Umi Max, TypeScript, Ant Design Pro, Tailwind CSS, Framer Motion |
| **Cơ sở dữ liệu** | MySQL 8.0+ |
| **Công cụ & DevOps** | Maven, npm/pnpm, Lombok, Swagger/OpenAPI 3 |

---

## 📂 Cấu trúc dự án

```text
.
├── backend/                # Ứng dụng Spring Boot
│   ├── src/main/java       # Mã nguồn (Controllers, Services, Repos, Entities)
│   ├── src/main/resources  # Cấu hình & SQL Schema
│   └── pom.xml             # Quản lý thư viện Maven
├── frontend/               # Ứng dụng React + UmiJS
│   ├── src/pages           # Các trang giao diện
│   ├── src/services        # Lớp gọi API
│   ├── src/models          # Quản lý state toàn cục
│   └── .umirc.ts           # Cấu hình UmiJS
└── README.md               # Tài liệu hướng dẫn dự án
```

---

## 🚀 Hướng dẫn cài đặt

### 📋 Yêu cầu hệ thống
- **JDK 17+**
- **Node.js 18+** & **npm**
- **MySQL 8+**

### 1. Khởi tạo Cơ sở dữ liệu
Tạo database có tên `clb_management_db` và thực thi file schema:
```bash
mysql -u your_user -p clb_management_db < backend/src/main/resources/schema.sql
```
*Lưu ý: File này sẽ tạo sẵn tài khoản admin (`admin` / `123456`) và dữ liệu mẫu.*

### 2. Cấu hình Backend
1. Chỉnh sửa file `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/clb_management_db
   spring.datasource.username=tên_đăng_nhập_mysql
   spring.datasource.password=mật_khẩu_mysql
   ```
2. Chạy ứng dụng:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   - API: `http://localhost:8080/api/v1`
   - Swagger: `http://localhost:8080/swagger-ui.html`

### 3. Cấu hình Frontend
1. Cài đặt các thư viện:
   ```bash
   cd frontend
   npm install
   ```
2. Chạy server phát triển:
   ```bash
   npm run dev
   ```
   - Ứng dụng: `http://localhost:8000`

---

## 🔐 Phân quyền người dùng

| Vai trò | Quyền hạn |
| :--- | :--- |
| **Quản trị viên (Admin)** | Toàn quyền hệ thống, phê duyệt/từ chối yêu cầu, quản lý kho, cấu hình hệ thống, xem nhật ký. |
| **Giảng viên (Faculty)** | Xem thiết bị, tạo yêu cầu mượn, tham gia diễn đàn. |
| **Sinh viên (Student)** | Xem thiết bị, tạo yêu cầu mượn, tham gia diễn đàn, xem các khoản phạt cá nhân. |

---

## 🛡️ Bảo mật & Hiệu năng
- **Xác thực Stateless:** Sử dụng JWT token để quản lý phiên làm việc bảo mật và dễ mở rộng.
- **Cấu hình CORS:** Giới hạn nguồn gốc truy cập để ngăn chặn các yêu cầu trái phép.
- **Code Splitting:** Chia nhỏ mã nguồn ở frontend giúp tốc độ tải trang ban đầu cực nhanh.
- **Xử lý lỗi:** Hệ thống xử lý lỗi tập trung ở Backend và Error Boundaries ở Frontend.

