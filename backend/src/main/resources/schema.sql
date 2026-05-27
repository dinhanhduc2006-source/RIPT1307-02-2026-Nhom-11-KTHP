-- =============================================
-- EQUIPMENT LENDING MANAGEMENT SYSTEM - SCHEMA V5.0
-- =============================================

DROP DATABASE IF EXISTS clb_management_db;
CREATE DATABASE clb_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clb_management_db;

SET FOREIGN_KEY_CHECKS = 0; -- Temporarily disable foreign key checks for smooth initialization

-- 1. USERS (User Accounts)
CREATE TABLE users (
                       id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                       username VARCHAR(50) NOT NULL COMMENT 'Unique login username',
                       email VARCHAR(150) NOT NULL COMMENT 'Unique email address',
                       password VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
                       role ENUM('Student', 'Faculty', 'Admin') NOT NULL DEFAULT 'Student' COMMENT 'User access role',
                       status ENUM('Active', 'Locked') NOT NULL DEFAULT 'Active' COMMENT 'Account status',
                       created_at DATE NOT NULL COMMENT 'Account creation date',
                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                       PRIMARY KEY (id),
                       UNIQUE KEY uq_users_username (username),
                       UNIQUE KEY uq_users_email (email),
                       INDEX idx_users_status (status),
                       INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='System user accounts';

-- 2. REFRESH_TOKENS (JWT Authentication Lifecycle)
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
COMMENT='Manages JWT refresh tokens and revocation';

-- 3. EQUIPMENT (Inventory Management)
CREATE TABLE equipment (
                           id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                           name VARCHAR(150) NOT NULL COMMENT 'Unique equipment name in inventory',
                           category VARCHAR(100) NOT NULL COMMENT 'Category (Projection, Audio, IT, Video...)',
                           available INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Currently available quantity (must be <= total)',
                           total INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Total quantity owned by inventory',
                           status ENUM('Available', 'Out of Stock', 'Maintenance') NOT NULL DEFAULT 'Available' COMMENT 'Equipment status',
                           created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                           PRIMARY KEY (id),
                           UNIQUE KEY uq_eq_name (name),
                           INDEX idx_eq_category (category),
                           INDEX idx_eq_status (status),
                           CONSTRAINT chk_eq_qty CHECK (available <= total)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Club equipment inventory data';

-- 4. LOAN_REQUESTS (Lending & Return Transactions)
CREATE TABLE loan_requests (
                               id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                               requester_id INT UNSIGNED NOT NULL COMMENT 'FK to users table (borrower)',
                               equipment_id INT UNSIGNED NOT NULL COMMENT 'FK to equipment table (item borrowed)',
                               borrow_date DATE NOT NULL COMMENT 'Expected start date of loan',
                               return_date DATE NOT NULL COMMENT 'Expected return date',
                               status ENUM('Pending', 'Approved', 'Rejected', 'Returned') NOT NULL DEFAULT 'Pending' COMMENT 'Request status',
                               reject_reason VARCHAR(255) NULL COMMENT 'Reason provided if status is Rejected',
                               returned_at DATETIME NULL COMMENT 'Actual timestamp when equipment was returned',
                               created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                               PRIMARY KEY (id),
                               INDEX idx_lr_status (status),
                               INDEX idx_lr_dates (borrow_date, return_date),
                               CONSTRAINT fk_lr_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE RESTRICT,
                               CONSTRAINT fk_lr_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE RESTRICT,
                               CONSTRAINT chk_lr_dates CHECK (return_date >= borrow_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Equipment loan requests tracking';

-- 5. POSTS (Forum Discussions)
CREATE TABLE posts (
                       id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                       title VARCHAR(255) NOT NULL COMMENT 'Forum post title',
                       content TEXT NOT NULL COMMENT 'Full body text of the post',
                       category VARCHAR(100) NOT NULL COMMENT 'Forum category (Learning, Event, Feedback...)',
                       tags TEXT NULL COMMENT 'Comma-separated string of keywords/labels',
                       author_id INT UNSIGNED NOT NULL COMMENT 'FK to users table (author)',
                       created_at DATE NOT NULL COMMENT 'Publishing date',
                       comments INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Total comments count',
                       positive INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Total likes count',
                       negative INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Total dislikes count',
                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                       PRIMARY KEY (id),
                       INDEX idx_posts_author (author_id),
                       INDEX idx_posts_created (created_at),
                       CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Community forum discussion posts';

-- 6. ANNOUNCEMENTS (System Official Notices)
CREATE TABLE announcements (
                               id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                               title VARCHAR(255) NOT NULL COMMENT 'Notice headline',
                               content TEXT NOT NULL COMMENT 'Detailed content of the announcement',
                               status ENUM('Active', 'Draft', 'Archived') NOT NULL DEFAULT 'Active' COMMENT 'Publishing status',
                               author_id INT UNSIGNED NOT NULL COMMENT 'FK to users table (admin creator)',
                               created_at DATE NOT NULL COMMENT 'Creation date',
                               updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                               PRIMARY KEY (id),
                               INDEX idx_ann_status (status),
                               CONSTRAINT fk_ann_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Official system-wide announcements from administration';

-- 7. MAINTENANCE_TICKETS (Equipment Repairs Log)
CREATE TABLE maintenance_tickets (
                                     id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                     equipment_id INT UNSIGNED NOT NULL COMMENT 'FK to equipment table',
                                     issue TEXT NOT NULL COMMENT 'Description of damage or issue',
                                     cost INT UNSIGNED NULL COMMENT 'Estimated or actual repair cost (VND)',
                                     status ENUM('Awaiting Approval', 'Under Repair', 'Completed') NOT NULL DEFAULT 'Awaiting Approval' COMMENT 'Progress state',
                                     date DATE NOT NULL COMMENT 'Ticket creation date',
                                     reporter_id INT UNSIGNED NOT NULL COMMENT 'FK to users table (person reporting the issue)',
                                     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                     PRIMARY KEY (id),
                                     INDEX idx_maint_status (status),
                                     CONSTRAINT fk_maint_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
                                     CONSTRAINT fk_maint_reporter FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tracks maintenance and repair activities for equipment';

-- 8. PENALTIES (Fines & Violations)
CREATE TABLE penalties (
                           id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                           user_id INT UNSIGNED NOT NULL COMMENT 'FK to users table (violator)',
                           loan_request_id INT UNSIGNED NULL COMMENT 'FK to loan_requests table (related loan)',
                           reason TEXT NOT NULL COMMENT 'Detailed reason for penalty generation',
                           amount INT UNSIGNED NOT NULL COMMENT 'Fine amount in VND',
                           status ENUM('Unpaid', 'Paid') NOT NULL DEFAULT 'Unpaid' COMMENT 'Payment collection state',
                           date DATE NOT NULL COMMENT 'Penalty record creation date',
                           created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                           PRIMARY KEY (id),
                           INDEX idx_pen_user (user_id),
                           INDEX idx_pen_status (status),
                           CONSTRAINT fk_pen_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
                           CONSTRAINT fk_pen_loan FOREIGN KEY (loan_request_id) REFERENCES loan_requests(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Fines and lending rule violations management';

-- 9. AUDIT_LOGS (System Operations Tracking)
CREATE TABLE audit_logs (
                            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp of operation execution',
                            user_id INT UNSIGNED NOT NULL COMMENT 'FK to users table (actor)',
                            action VARCHAR(100) NOT NULL COMMENT 'Name of business action executed',
                            detail TEXT NOT NULL COMMENT 'Full textual description of operation details',

                            PRIMARY KEY (id),
                            INDEX idx_al_user (user_id),
                            INDEX idx_al_created (created_at),
                            CONSTRAINT fk_al_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Immutable ledger of state-changing system operations';

-- 10. SYSTEM_CONFIG (Global Parameters - Constraints to single row)
CREATE TABLE system_config (
                               id TINYINT UNSIGNED NOT NULL DEFAULT 1,
                               max_borrow_days INT UNSIGNED NOT NULL DEFAULT 7 COMMENT 'Maximum allowed duration for standard loan',
                               fine_per_day INT UNSIGNED NOT NULL DEFAULT 20000 COMMENT 'Daily overdue fee charge amount',
                               allow_borrow_when_debt TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Flag allowing users with unpaid fines to borrow (0: False, 1: True)',
                               admin_email VARCHAR(150) NULL COMMENT 'Recipient email for automated system alerts',
                               updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                               PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Global dynamic operational parameters for system business rules';

-- =============================================
-- SYSTEM INITIALIZATION SEED DATA (ENGLISH ENUMS MATCHED)
-- =============================================

-- Default credentials (Password '123456' hashed via BCrypt cost=10)
INSERT INTO users (id, username, email, password, role, status, created_at) VALUES
                                                                                (1, 'admin', 'admin@clb.edu.vn', '$2a$10$Eux/p917mR7sYQvY26.Oye7w7oH4lqJgq6C4LhP9xT3bQk0H1zW6G', 'Admin', 'Active', '2026-05-26'),
                                                                                (2, 'sv01', 'sinhvien01@clb.edu.vn', '$2a$10$Eux/p917mR7sYQvY26.Oye7w7oH4lqJgq6C4LhP9xT3bQk0H1zW6G', 'Student', 'Active', '2026-05-26'),
                                                                                (3, 'gv01', 'giangvien01@clb.edu.vn', '$2a$10$Eux/p917mR7sYQvY26.Oye7w7oH4lqJgq6C4LhP9xT3bQk0H1zW6G', 'Faculty', 'Locked', '2026-05-26');

-- Initial equipment list
INSERT INTO equipment (id, name, category, available, total, status) VALUES
                                                                         (1, 'Sony X10 Projector', 'Projection', 5, 5, 'Available'),
                                                                         (2, 'Shure Wireless Microphone', 'Audio', 10, 10, 'Available'),
                                                                         (3, 'Dell Backup Laptop', 'IT', 0, 2, 'Maintenance');

-- System rule properties default settings
INSERT INTO system_config (id, max_borrow_days, fine_per_day, allow_borrow_when_debt, admin_email) VALUES
    (1, 7, 20000, 0, 'admin_clb_thietbi@gmail.com');

SET FOREIGN_KEY_CHECKS = 1; -- Re-enable foreign key constraints checks