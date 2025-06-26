# Panuwat Skilllane Assignment

Fullstack Assignment: Task Management System

- **Frontend:** React + MUI + Zustand
- **Backend:** Fastify + Sequelize + PostgreSQL + Google Cloud Storage

## User for test
- email : test@example.com
- password : password

## โครงสร้างโปรเจกต์

```
packages/
  backend/    # Fastify API server (TypeScript)
  frontend/   # React web app (TypeScript)
```

## การติดตั้ง

1. **Clone repo**

   ```sh
   git clone https://github.com/shogun0322/panuwat-skilllane-assignment
   cd panuwat-skilllane-assignment
   ```

2. **ติดตั้ง dependencies**

   ```sh
   npm install
   cd packages/backend && npm install
   cd ../frontend && npm install
   ```

3. **ตั้งค่า Environment Variables**

   - ดูตัวอย่างไฟล์ `.env` ใน `.env.example`

## การรันโปรเจกต์

### Dev Mode (Frontend + Backend พร้อมกัน)

```sh
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:50000

### รันแยกแต่ละส่วน

- Backend:
  ```sh
  cd packages/backend
  npm run dev
  ```
- Frontend:
  ```sh
  cd packages/frontend
  npm start
  ```

## ฟีเจอร์หลัก

### Backend (Fastify API)

- Auth: JWT Login
- Task CRUD: สร้าง/อ่าน/แก้ไข/ลบ Task
- Upload: อัปโหลดรูปภาพไป Google Cloud Storage
- Swagger Docs: `/docs`

### Backend Jest Test
- cd packages/backend
- npm run test

### Frontend (React)

- Login/Logout
- Task List, Search, Filter, Pagination
- Create/Edit/Delete Task
- Upload รูปภาพประกอบ Task
- Responsive UI (MUI)
- แจ้งเตือน (Snackbar), Loading

## API Docs

- Swagger UI: [http://localhost:50000/docs](http://localhost:50000/docs)

---

## หากมีเวลามากกว่านี้ ผมจะพัฒนาและปรับปรุงระบบเพิ่มเติมในส่วนต่าง ๆ ดังนี้

- ระบบสิทธิ์และบทบาทผู้ใช้ (User roles & permissions): เพื่อให้สามารถกำหนดสิทธิ์การเข้าถึงแต่ละฟีเจอร์หรือข้อมูลตามบทบาทของผู้ใช้ เช่น Admin, Member ฯลฯ

- ระบบสำรองและกู้คืนข้อมูล (Backup & restore): เพิ่มความปลอดภัยให้กับข้อมูล โดยสามารถสำรองและกู้คืนข้อมูลในกรณีเกิดปัญหา

- ระบบแจ้งเตือน (Notification system): แจ้งเตือนผู้ใช้เมื่อมีการเปลี่ยนแปลงสถานะของงานหรือมีงานใหม่เข้ามา

- ระบบรายงานและวิเคราะห์ข้อมูล (Reporting & analytics): สามารถดูสถิติ, รายงานภาพรวม หรือวิเคราะห์ประสิทธิภาพการทำงานในระบบ


**ผู้พัฒนา:** Panuwat Suwanritdej
