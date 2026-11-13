# EduManage — Student Administration System

EduManage is a full-stack, enterprise-grade Student Management Web Application developed as a BCA Semester Mini Project. The application visualizes and manages the full academic lifecycle across collegiate departments, active course curricula, student rosters, lecture attendance, examination board tabulation, and institutional policies.

---

## 📸 Reference Screens Implemented (11 Pages)

1. **Administrative Login** (`/login`): Split-screen architecture featuring institutional gateway credentials, SSO federations, FERPA/SOC-2 certifications, and role selectors.
2. **Executive Dashboard** (`/`): Real-time KPI statistics, longitudinal enrollment Area charts, course quota doughnut charts, recent admissions register, and operational shortcuts.
3. **Students Directory** (`/students`): Comprehensive cohort register with live search, multiple cascading filters, batch status mutations, bulk deletions, and CSV export.
4. **Student Profile** (`/students/:id`): 360° individual student dossier featuring attendance compliance meter, transcript table, Dean's honor roll standing, and activity audit timeline.
5. **Add New Student** (`/add-student`): Multi-section registration form with auto-assigned roll code generation, avatar photo preview, guardian contacts, and health verification.
6. **Academic Departments** (`/departments`): Academic divisions grid with faculty chair metrics, department head credentials, and operating budget resource allocation.
7. **Courses Management** (`/courses`): Curricular architecture view displaying undergraduate/postgraduate credit requirements, enrollment capacity utilization bars, and HOD assignments.
8. **Attendance Management** (`/attendance`): Lecture roll call register with real-time present/absent/late toggles, minimum 75% institutional compliance warnings, and audit hashing.
9. **Results & Grading** (`/results`): Official examination board tabulation register with live marks entry, automated weighted GPA calculation, Dean's digital signature, and Grade Curve Tool.
10. **System Settings** (`/settings`): Institutional profile customizer, grading scales, attendance lock penalties, administrator profile management, and cluster node status.
11. **Help & Support Center** (`/help-support`): Searchable Standard Operating Procedures (SOPs), knowledge base library, direct IT assistance contacts, and interactive ticket dispatch.

---

## 🛠 Technology Stack

### Frontend

- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS v4 (Custom Institutional Purple Theme)
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Charts**: Recharts (Area charts, Doughnut charts, Distribution SVG curves)
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios with JWT request interceptors

### Backend

- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs password hashing
- **Validation**: Express Validator
- **Security**: CORS, environment variables, centralized error handling

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js (v18 or higher)
- MongoDB running locally at `mongodb://localhost:27017/edumanage` (or MongoDB Atlas URI)

### 1. Database Setup & Seeding

From the `server` directory:

```bash
cd server
npm install
npm run seed
```

> **Default Admin Account:**
>
> - Email: `admin@kathmandu.edu`
> - Password: `adminpassword123`

### 2. Start Backend Server

```bash
cd server
npm start
# Server listens on http://localhost:5000
```

### 3. Start Frontend Client

```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

Open `http://localhost:3000` in your browser and sign in with the admin credentials!

---

## 📡 RESTful API Endpoints

### Authentication

- `POST /api/auth/login` — Sign in and receive JWT token
- `POST /api/auth/register` — Register administrator or faculty
- `GET /api/auth/me` — Retrieve current authenticated session

### Students

- `GET /api/students` — Paginated, searchable, and filterable student directory
- `GET /api/students/:id` — Retrieve student details by ID
- `POST /api/students` — Register new student
- `PUT /api/students/:id` — Update student record
- `DELETE /api/students/:id` — Delete student record

### Academic Departments

- `GET /api/departments` — List all academic divisions
- `POST /api/departments` — Create new department
- `PUT /api/departments/:id` — Update department details
- `DELETE /api/departments/:id` — Delete department

### Courses & Curricula

- `GET /api/courses` — List all active degree programs
- `POST /api/courses` — Create new course
- `PUT /api/courses/:id` — Update course details
- `DELETE /api/courses/:id` — Delete course

### Attendance

- `GET /api/attendance` — Query roll call registers by course, subject, and date
- `POST /api/attendance` — Batch save student attendance
- `GET /api/attendance/student/:studentId` — Query cumulative compliance rate

### Results & Examination Grading

- `GET /api/results` — Query tabulation ledger by course and subject
- `POST /api/results` — Save or update student marks
- `POST /api/results/publish` — Sign and publish official semester results

### Dashboard & Metrics

- `GET /api/dashboard/stats` — Live KPI counters (Students, Courses, Departments)
- `GET /api/dashboard/recent-admissions` — 5 latest student admissions
- `GET /api/dashboard/enrollment-overview` — Longitudinal enrollment trajectory
- `GET /api/dashboard/course-distribution` — Program enrollment proportions

### Support & Settings

- `GET /api/support/tickets` — Query support queue
- `POST /api/support/tickets` — Submit new ticket
- `GET /api/settings` — Get institutional settings
- `PUT /api/settings` — Update institutional configuration
