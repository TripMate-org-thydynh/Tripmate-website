# TripMate Web App (Landing & Admin Dashboard)

Giao diện web chính thức và bảng điều khiển quản trị (Admin Control Center) cho hệ thống **TripMate** - ứng dụng du lịch nhóm dành cho thế hệ Gen Z.

Được xây dựng với phong cách thiết kế Gen Z trẻ trung, năng động (Sử dụng màu chủ đạo Coral `#E0533C`, màu nền Cream `#FCFAF6`, bo góc lớn `rounded-3xl` và font chữ bo tròn `Quicksand`).

---

## 🛠️ Công Nghệ Sử Dụng

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Bảo mật:** JWT Session được lưu trữ an toàn trong `httpOnly` Cookie phía server.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Chuẩn bị biến môi trường
Tạo file `.env.local` trong thư mục `TripMate_web/` (nếu cần tuỳ chỉnh):

```env
# Địa chỉ cổng API backend NestJS
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/api/v1
```

### 2. Cài đặt các gói phụ thuộc
Chạy lệnh sau tại thư mục `TripMate_web/` để cài đặt các package:

```bash
npm install
```

### 3. Chạy môi trường phát triển (Development)
Khởi chạy frontend dev server:

```bash
npm run dev
```

Mở trình duyệt truy cập:
- Trang chủ Marketing: [http://localhost:3000](http://localhost:3000) (hoặc port khác như `3001` nếu bị trùng)
- Trang xem thử tính năng: `http://localhost:3001/preview`
- Trang Admin: `http://localhost:3001/admin`

---

## 🔑 Tài Khoản Admin Mặc Định (Bootstrap Seeded)

Sau khi chạy seed script ở backend (`npx prisma db seed`), hệ thống sẽ khởi tạo tài khoản quản trị:
- **Username:** `dinhthi03`
- **Mật khẩu khởi tạo:** `Thithithi@0305`

---

## 📂 Cấu Trúc Thư Mục Chính

```text
TripMate_web/
├── src/
│   ├── app/
│   │   ├── actions.ts           # Các Server Actions gọi API NestJS an toàn
│   │   ├── globals.css          # Cấu hình Tailwind v4 và các biến theme
│   │   ├── layout.tsx           # Layout dùng font Quicksand & chống chớp theme
│   │   ├── page.tsx             # Landing Page giới thiệu app
│   │   ├── preview/             # Giao diện xem thử các tính năng demo
│   │   ├── admin/
│   │   │   ├── login/           # Trang đăng nhập Admin
│   │   │   ├── layout.tsx       # Bố cục Sidebar Admin và Guard xác thực
│   │   │   ├── page.tsx         # Dashboard Tổng quan (Metrics & Activities)
│   │   │   ├── users/           # Quản lý tài khoản (Đổi quyền, khoá, xoá mềm)
│   │   │   ├── trips/           # Quản lý chuyến đi (CRUD)
│   │   │   ├── reservations/    # Quản lý vé đặt chỗ (CRUD)
│   │   │   ├── journal/         # Quản lý bài viết nhật ký (CRUD)
│   │   │   └── packing/         # Quản lý danh sách hành lý (CRUD)
│   │   └── configs/             # Cấu hình hệ thống & API Keys (Feature Flags, Momo...)
│   ├── components/
│   │   └── ThemeToggle.tsx      # Nút chuyển đổi Dark/Light mode
│   └── lib/
│       └── api.ts               # API Client trung tâm đính kèm Token từ Cookies
```
