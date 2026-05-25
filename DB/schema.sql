-- =============================================
-- HỆ THỐNG QUẢN LÝ MƯỢN THIẾT BỊ - CSDL
-- =============================================

-- 1. DANH MỤC THIẾT BỊ
CREATE TABLE equipment_categories (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL COMMENT 'Tên danh mục (Âm thanh, Ánh sáng, Máy tính...)',
    description VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_cat_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Danh mục thiết bị (chuẩn hóa)';

-- 2. USERS
CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student','admin') NOT NULL DEFAULT 'student',
    student_id VARCHAR(20) NULL,
    phone VARCHAR(15) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    
    email_verified TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Xác thực email',
    last_login_at DATETIME NULL,
    last_login_ip VARCHAR(45) NULL,
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    UNIQUE KEY uq_users_student_id (student_id),
    
    INDEX idx_users_role (role),
    INDEX idx_users_is_active (is_active),
    INDEX idx_users_email_verified (email_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tài khoản người dùng';

-- 3. EQUIPMENTS
CREATE TABLE equipments (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id INT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NULL UNIQUE COMMENT 'Mã thiết bị (tùy chọn)',
    description TEXT NULL,
    total_quantity SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    available_quantity SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    status ENUM('available','maintenance','retired','damaged') NOT NULL DEFAULT 'available',
    image_url VARCHAR(300) NULL,
    location VARCHAR(100) NULL COMMENT 'Vị trí lưu trữ',
    
    created_by INT UNSIGNED NULL,
    deleted_at DATETIME NULL COMMENT 'Soft delete',
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_eq_category (category_id),
    INDEX idx_eq_status (status),
    INDEX idx_eq_available (available_quantity),
    INDEX idx_eq_deleted (deleted_at),
    
    CONSTRAINT fk_eq_category FOREIGN KEY (category_id) REFERENCES equipment_categories(id) ON DELETE RESTRICT,
    CONSTRAINT fk_eq_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT chk_eq_qty CHECK (available_quantity <= total_quantity AND available_quantity >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Thiết bị trong kho';

-- 4. BORROW_REQUESTS
CREATE TABLE borrow_requests (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    status ENUM('pending','approved','rejected','borrowed','returned','overdue') NOT NULL DEFAULT 'pending',
    priority ENUM('normal','urgent') NOT NULL DEFAULT 'normal',
    
    borrow_date DATE NOT NULL,
    return_date DATE NOT NULL,
    actual_borrow_date DATETIME NULL COMMENT 'Thời gian thực nhận thiết bị',
    actual_return_date DATE NULL,
    
    note TEXT NULL,
    admin_note TEXT NULL,
    approved_by INT UNSIGNED NULL,
    approved_at DATETIME NULL,
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_br_user_id (user_id),
    INDEX idx_br_status (status),
    INDEX idx_br_return_date (return_date),
    INDEX idx_br_approved_by (approved_by),
    INDEX idx_br_status_borrow (status, borrow_date),
    INDEX idx_br_status_return (status, return_date),
    INDEX idx_br_priority_status (priority, status),
    
    CONSTRAINT fk_br_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_br_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT chk_br_dates CHECK (return_date >= borrow_date),
    CONSTRAINT chk_br_max_duration CHECK (DATEDIFF(return_date, borrow_date) <= 30)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Phiếu yêu cầu mượn thiết bị';

-- 5. BORROW_REQUEST_ITEMS
CREATE TABLE borrow_request_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    request_id INT UNSIGNED NOT NULL,
    equipment_id INT UNSIGNED NOT NULL,
    quantity SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    item_status ENUM('pending','borrowed','returned','damaged','lost') NOT NULL DEFAULT 'pending',
    condition_note VARCHAR(255) NULL COMMENT 'Tình trạng khi trả',
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_bri_req_eq (request_id, equipment_id),
    INDEX idx_bri_equipment (equipment_id),
    INDEX idx_bri_item_status (item_status),
    
    CONSTRAINT fk_bri_request FOREIGN KEY (request_id) REFERENCES borrow_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_bri_equipment FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE RESTRICT,
    CONSTRAINT chk_bri_quantity CHECK (quantity >= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Chi tiết thiết bị mượn trong phiếu';

-- 6. NOTIFICATIONS
CREATE TABLE notifications (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    request_id INT UNSIGNED NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('request_approved','request_rejected','return_reminder',
              'overdue_warning','return_confirmed','system') NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    is_email_sent TINYINT(1) NOT NULL DEFAULT 0,
    email_sent_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_notif_user_read (user_id, is_read),
    INDEX idx_notif_type (type),
    INDEX idx_notif_request (request_id),
    
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notif_request FOREIGN KEY (request_id) REFERENCES borrow_requests(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Thông báo hệ thống';

-- 7. AUDIT_LOGS
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NULL,
    action VARCHAR(80) NOT NULL,
    table_name VARCHAR(60) NOT NULL,
    record_id INT UNSIGNED NULL,           -- Thay BIGINT → INT UNSIGNED cho thống nhất
    old_value JSON NULL,
    new_value JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(300) NULL,
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_al_user (user_id),
    INDEX idx_al_action (action),
    INDEX idx_al_table (table_name),
    INDEX idx_al_created (created_at),
    
    CONSTRAINT fk_al_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Nhật ký hoạt động hệ thống';
