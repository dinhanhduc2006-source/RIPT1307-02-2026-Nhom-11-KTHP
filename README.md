# Equipment Lending Management System

A comprehensive, full-stack application designed for university clubs to manage their equipment inventory, track loans, handle penalties, and facilitate community discussions.

## Project Architecture

This project follows a modern, decoupled architecture:
*   **Backend:** Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JPA (Hibernate), and MySQL.
*   **Frontend:** React 18, Umi Max framework, TypeScript, and Ant Design Pro components.
*   **API Design:** RESTful principles with structured DTOs and global exception handling.

## Key Features

1.  **Inventory Management:** Track equipment categories, available quantities, and maintenance statuses with robust concurrency protection (Pessimistic Locking).
2.  **Lending Workflow:** Request, approve, reject, and return equipment with automated overdue fine calculation.
3.  **Authentication & Security:** Stateless JWT authentication, role-based access control (Student, Faculty, Admin), and protection against ID spoofing.
4.  **Community Forum:** Built-in discussion board for users to request new equipment or share knowledge.
5.  **Audit & Notifications:** Comprehensive logging of all administrative actions and a system for broadcasting announcements.

## Prerequisites

*   **Java:** JDK 21+
*   **Node.js:** v18+ (with `npm`)
*   **Database:** MySQL 8+
*   **Maven:** 3.8+ (or use the included wrapper)

## Quick Start Guide

### 1. Database Setup
1. Create a MySQL database and run the initial schema.
   ```sql
   SOURCE backend/src/main/resources/schema.sql;
   ```
2. The schema automatically seeds an admin account:
   * **Username:** admin
   * **Password:** 123456

### 2. Running the Backend
1. Navigate to the `backend` directory: `cd backend`
2. Update `src/main/resources/application.properties` with your MySQL credentials.
3. Start the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
4. The API will be available at `http://localhost:8080/api/v1`.
5. Swagger documentation is available at `http://localhost:8080/swagger-ui.html`.

### 3. Running the Frontend
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The application will be available at `http://localhost:8000`.

## Production Readiness Checklist

During the certification sprints, the following areas were hardened for production:
*   [x] **Security:** JWT extraction directly from SecurityContext, restricted CORS, and sanitized DTOs.
*   [x] **Integrity:** Database-level locking for inventory counts and strict borrow-date validations.
*   [x] **Resilience:** Global UI Error Boundaries and unified HTTP error handling.
*   [x] **Performance:** Granular chunk code-splitting for the frontend bundle.
*   [x] **Observability:** SLF4J logging for critical API endpoints and comprehensive Audit Logs in the database.
