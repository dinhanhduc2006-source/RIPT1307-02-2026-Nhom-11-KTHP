-- =============================================
-- HỆ THỐNG QUẢN LÝ MƯỢN TRẢ THIẾT BỊ - ĐẶC TẢ V5.0
-- =============================================

DROP DATABASE IF EXISTS clb_management_db;
CREATE DATABASE clb_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clb_management_db;

SET FOREIGN_KEY_CHECKS = 0; -- Tạm thời tắt kiểm tra khóa ngoại để khởi tạo mượt mà

-- 1. USERS (Tài khoản người dùng)
CREATE TABLE users (
                       id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                       username VARCHAR(50) NOT NULL COMMENT 'Tên đăng nhập, duy nhất'[cite: 21],
                       email VARCHAR(150) NOT NULL COMMENT 'Địa chỉ email, duy nhất'[cite: 21],
                       password VARCHAR(255) NOT NULL COMMENT 'Mật khẩu băm bcrypt'[cite: 21],
                       role ENUM('Sinh viên', 'Giảng viên', 'Quản trị viên') NOT NULL DEFAULT 'Sinh viên' COMMENT 'Vai trò người dùng'[cite: 21],
                       status ENUM('Active', 'Locked') NOT NULL DEFAULT 'Active' COMMENT 'Trạng thái tài khoản'[cite: 21],
                       created_at DATE NOT NULL COMMENT 'Ngày tạo tài khoản'[cite: 21],
                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                       PRIMARY KEY (id),
                       UNIQUE KEY uq_users_username (username),
                       UNIQUE KEY uq_users_email (email),
                       INDEX idx_users_status (status),
                       INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tài khoản người dùng hệ thống'[cite: 21];

-- 2. REFRESH_TOKENS (Hỗ trợ luồng Auth JWT HttpOnly Cookie bảo vệ route)
CREATE TABLE refresh_tokens (
                                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                user_id INT UNSIGNED NOT NULL,
                                token VARCHAR(255) NOT NULL,
                                expiry_date DATETIME NOT NULL,
                                is_revoked TINYINT(1) NOT NULL DEFAULT 0,
                                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                PRIMARY KEY (id),
                                UNIQUE KEY uq_ref_token (token),
                                CONSTRAINT fk_ref_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Quản lý vòng đời JWT Refresh Token'[cite: 111];

-- 3. EQUIPMENT (Kho thiết bị)
CREATE TABLE equipment (
                           id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                           name VARCHAR(150) NOT NULL COMMENT 'Tên thiết bị, duy nhất trong kho'[cite: 23],
                           category VARCHAR(100) NOT NULL COMMENT 'Danh mục (Trình chiếu, Âm thanh, Tin học...)'[cite: 23],
                           available INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Số lượng sẵn có (luôn <= total)'[cite: 23],
                           total INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Tổng số lượng trong kho'[cite: 23],
                           status ENUM('Sẵn sàng', 'Hết hàng', 'Bảo trì') NOT NULL DEFAULT 'Sẵn sàng' COMMENT 'Trạng thái thiết bị'[cite: 23],
                           created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                           PRIMARY KEY (id),
                           UNIQUE KEY uq_eq_name (name),
                           INDEX idx_eq_category (category),
                           INDEX idx_eq_status (status),
                           CONSTRAINT chk_eq_qty CHECK (available <= total) -- Khống chế số lượng sẵn có luôn <= tổng số [cite: 23, 45]
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Kho quản lý thiết bị câu lạc bộ'[cite: 23];

-- 4. LOAN_REQUESTS (Yêu cầu mượn thiết bị)
CREATE TABLE loan_requests (
                               id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                               requester_id INT UNSIGNED NOT NULL COMMENT 'Người mượn'[cite: 25],
                               equipment_id INT UNSIGNED NOT NULL COMMENT 'Thiết bị mượn'[cite: 25],
                               borrow_date DATE NOT NULL COMMENT 'Ngày bắt đầu mượn'[cite: 25],
                               return_date DATE NOT NULL COMMENT 'Ngày dự kiến trả'[cite: 25],
                               status ENUM('Pending', 'Approved', 'Rejected', 'Returned') NOT NULL DEFAULT 'Pending' COMMENT 'Trạng thái đơn'[cite: 25],
                               reject_reason VARCHAR(255) NULL COMMENT 'Lý do từ chối'[cite: 25],
                               returned_at DATETIME NULL COMMENT 'Thời điểm trả thực tế'[cite: 25],
                               created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                               PRIMARY KEY (id),
                               INDEX idx_lr_status (status),
                               INDEX idx_lr_dates (borrow_date, return_date),
                               CONSTRAINT fk_lr_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE RESTRICT,
                               CONSTRAINT fk_lr_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE RESTRICT,
                               CONSTRAINT chk_lr_dates CHECK (return_date >= borrow_date) -- Validate ngày trả phải sau hoặc bằng ngày mượn [cite: 25, 47, 99]
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Phiếu yêu cầu mượn trả thiết bị'[cite: 25];

-- 5. POSTS (Bài đăng diễn đàn thảo luận)
CREATE TABLE posts (
                       id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                       title VARCHAR(255) NOT NULL COMMENT 'Tiêu đề bài viết'[cite: 27],
                       content TEXT NOT NULL COMMENT 'Nội dung bài viết'[cite: 27],
                       category VARCHAR(100) NOT NULL COMMENT 'Danh mục diễn đàn'[cite: 27],
                       tags TEXT NULL COMMENT 'Lưu danh sách tag (chuỗi văn bản ngăn cách nhau)'[cite: 27],
                       author_id INT UNSIGNED NOT NULL COMMENT 'Người đăng bài'[cite: 27],
                       created_at DATE NOT NULL COMMENT 'Ngày đăng'[cite: 27],
                       comments INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Số bình luận'[cite: 27],
                       positive INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Số lượt thích'[cite: 27],
                       negative INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Số lượt không thích'[cite: 27],
                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                       PRIMARY KEY (id),
                       INDEX idx_posts_author (author_id),
                       INDEX idx_posts_created (created_at),
                       CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bài đăng trên diễn đàn câu lạc bộ'[cite: 27];

-- 6. ANNOUNCEMENTS (Thông báo hệ thống)
CREATE TABLE announcements (
                               id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                               title VARCHAR(255) NOT NULL COMMENT 'Tiêu đề thông báo'[cite: 29],
                               content TEXT NOT NULL COMMENT 'Nội dung thông báo'[cite: 29],
                               status ENUM('Active', 'Draft', 'Archived') NOT NULL DEFAULT 'Active' COMMENT 'Trạng thái thông báo'[cite: 29],
                               author_id INT UNSIGNED NOT NULL COMMENT 'Admin tạo thông báo'[cite: 29],
                               created_at DATE NOT NULL COMMENT 'Ngày tạo'[cite: 29],
                               updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                               PRIMARY KEY (id),
                               INDEX idx_ann_status (status),
                               CONSTRAINT fk_ann_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Thông báo chính thức từ ban quản trị'[cite: 29];

-- 7. MAINTENANCE_TICKETS (Phiếu bảo trì thiết bị)
CREATE TABLE maintenance_tickets (
                                     id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                     equipment_id INT UNSIGNED NOT NULL COMMENT 'Thiết bị cần bảo trì'[cite: 31],
                                     issue TEXT NOT NULL COMMENT 'Mô tả lỗi'[cite: 31],
                                     cost INT UNSIGNED NULL COMMENT 'Chi phí sửa chữa (VNĐ)'[cite: 31],
                                     status ENUM('Chờ duyệt', 'Đang sửa', 'Đã xong') NOT NULL DEFAULT 'Chờ duyệt' COMMENT 'Tiến độ'[cite: 31],
                                     date DATE NOT NULL COMMENT 'Ngày lập phiếu'[cite: 31],
                                     reporter_id INT UNSIGNED NOT NULL COMMENT 'Người báo hỏng'[cite: 31],
                                     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                     PRIMARY KEY (id),
                                     INDEX idx_maint_status (status),
                                     CONSTRAINT fk_maint_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
                                     CONSTRAINT fk_maint_reporter FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Theo dõi tiến độ bảo trì sửa chữa thiết bị'[cite: 31];

-- 8. PENALTIES (Vi phạm & Tiền phạt)
CREATE TABLE penalties (
                           id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                           user_id INT UNSIGNED NOT NULL COMMENT 'Người vi phạm'[cite: 32],
                           loan_request_id INT UNSIGNED NULL COMMENT 'Đơn mượn liên quan'[cite: 33],
                           reason TEXT NOT NULL COMMENT 'Lý do phạt'[cite: 33],
                           amount INT UNSIGNED NOT NULL COMMENT 'Số tiền phạt (VNĐ)'[cite: 33],
                           status ENUM('Chưa nộp', 'Đã nộp') NOT NULL DEFAULT 'Chưa nộp' COMMENT 'Trạng thái thu'[cite: 33],
                           date DATE NOT NULL COMMENT 'Ngày lập biên bản'[cite: 33],
                           created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                           PRIMARY KEY (id),
                           INDEX idx_pen_user (user_id),
                           INDEX idx_pen_status (status),
                           CONSTRAINT fk_pen_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
                           CONSTRAINT fk_pen_loan FOREIGN KEY (loan_request_id) REFERENCES loan_requests(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Quản lý biên bản xử phạt quá hạn hệ thống'[cite: 33];

-- 9. AUDIT_LOGS (Nhật ký hệ thống)
CREATE TABLE audit_logs (
                            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm thực hiện'[cite: 35],
                            user_id INT UNSIGNED NOT NULL COMMENT 'Người thực hiện hành động'[cite: 35],
                            action VARCHAR(100) NOT NULL COMMENT 'Tên hành động nghiệp vụ'[cite: 35],
                            detail TEXT NOT NULL COMMENT 'Nội dung chi tiết ghi log dạng văn bản'[cite: 35],

                            PRIMARY KEY (id),
                            INDEX idx_al_user (user_id),
                            INDEX idx_al_created (created_at),
                            CONSTRAINT fk_al_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Lưu vết hoạt động tác vụ ghi của hệ thống'[cite: 35];

-- 10. SYSTEM_CONFIG (Cấu hình hệ thống - Chỉ lưu 1 dòng duy nhất)
CREATE TABLE system_config (
                               id TINYINT UNSIGNED NOT NULL DEFAULT 1,
                               max_borrow_days INT UNSIGNED NOT NULL DEFAULT 7 COMMENT 'Số ngày mượn tối đa'[cite: 37],
                               fine_per_day INT UNSIGNED NOT NULL DEFAULT 20000 COMMENT 'Tiền phạt quá hạn/ngày'[cite: 37],
                               allow_borrow_when_debt TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Cho mượn khi đang nợ (0: False, 1: True)'[cite: 37],
                               admin_email VARCHAR(150) NULL COMMENT 'Email nhận cảnh báo hệ thống'[cite: 37],
                               updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                               PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bảng cấu hình tham số động cho toàn hệ thống'[cite: 37];

-- =============================================
-- DỮ LIỆU KHỞI TẠO BAN ĐẦU (SEED DATA MẪU CỦA THẦY) [cite: 126]
-- =============================================

-- Chèn tài khoản mẫu (Mật khẩu '123456' đã được băm mẫu bằng Bcrypt cost=10) [cite: 105, 127]
INSERT INTO users (id, username, email, password, role, status, created_at) VALUES
    (1, 'admin', 'admin@clb.edu.vn', '$2a$10$Eux/p917mR7sYQvY26.Oye7w7oH4lqJgq6C4LhP9xT3bQk0H1zW6G', 'Quản trị viên', 'Active', '2026-05-26') [cite: 127],
(2, 'sv01', 'sinhvien01@clb.edu.vn', '$2a$10$Eux/p917mR7sYQvY26.Oye7w7oH4lqJgq6C4LhP9xT3bQk0H1zW6G', 'Sinh viên', 'Active', '2026-05-26') [cite: 128],
(3, 'gv01', 'giangvien01@clb.edu.vn', '$2a$10$Eux/p917mR7sYQvY26.Oye7w7oH4lqJgq6C4LhP9xT3bQk0H1zW6G', 'Giảng viên', 'Locked', '2026-05-26') [cite: 129];

-- Chèn thiết bị mẫu [cite: 130]
INSERT INTO equipment (id, name, category, available, total, status) VALUES
    (1, 'Máy chiếu Sony X10', 'Trình chiếu', 5, 5, 'Sẵn sàng') [cite: 130],
(2, 'Micro không dây Shure', 'Âm thanh', 10, 10, 'Sẵn sàng') [cite: 130],
(3, 'Laptop dự phòng Dell', 'Tin học', 0, 2, 'Bảo trì') [cite: 130];

-- Chèn cấu hình hệ thống mặc định [cite: 37]
INSERT INTO system_config (id, max_borrow_days, fine_per_day, allow_borrow_when_debt, admin_email) VALUES
    (1, 7, 20000, 0, 'admin_clb_thietbi@gmail.com') [cite: 37];

SET FOREIGN_KEY_CHECKS = 1; -- Bật lại kiểm tra khóa ngoại sau khi hoàn tất thiết lập