# School System

A school management database for managing students, courses, and grades.

![Tests](https://github.com/ElliesWorld/SchoolSystem/actions/workflows/test.yml/badge.svg?branch=main)

## Technologies Used

**Frontend**: React, TypeScript, Vite
**Backend**: Node.js, Express, TypeScript
**Database**: PostgreSQL, Prisma ORM
**Authentication**: Firebase
**API Documentation**: Swagger

---

## Prerequisites

- **Node.js** 
- **PostgreSQL** 
- **Firebase** 

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ElliesWorld/SchoolSystem.git
cd SchoolSystem
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Run Prisma migrations and seed the database:
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```

---

## Running the Application

### Start the Backend
```bash
cd Backend
npm run dev
```

Backend runs on: **http://localhost:4000**

### Start the Frontend
```bash
cd Frontend
npm run dev
```

Frontend runs on: **http://localhost:5173**

### Access API Documentation

Swagger UI: **http://localhost:4000/api-docs**

---

## How to Use

### Login as a Student

1. Go to http://localhost:5173/loginpage
2. Enter student email and password
3. Click "Login"

**What Students Can Do:**
- View grades filtered by year (Year 1, 2, 3, or All)
- Filter grades by subject
- See grade details: Year, Subject, Course, Grade, Date

### Login as an Admin

1. Go to http://localhost:5173/loginpage
2. Click "Admin" option
3. Enter admin email and password
4. Click "Login"

**What Admins Can Do:**
- View all students
- Filter by year
- Import students from CSV file
- View student details
- Assign or update grades for students
- Filter grades by year and course

---


## Testing

Run backend tests:
```bash
cd Backend
npm test
npm run test:coverage
```

---
