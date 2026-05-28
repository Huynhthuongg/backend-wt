# Backend WT - Media & Content Management API

Backend RESTful API xây dựng với **Node.js/Express** + **MongoDB** + **Cloudinary** + **JWT**.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (Access + Refresh Token) |
| Media Storage | Cloudinary |
| Security | Helmet, CORS, Rate Limiting |

## Cấu trúc thư mục

```
src/
├── config/          # DB, Cloudinary config
├── controllers/     # Business logic
├── middlewares/     # Auth, error handler
├── models/          # Mongoose schemas
├── routes/
│   ├── api/v1/      # API v1
│   ├── api/v2/      # API v2 (nâng cao)
│   ├── user/        # User profile
│   ├── plat/        # Platform admin
│   └── vendor/      # Vendor management
└── utils/           # JWT helpers
```

## Quick Start

```bash
npm install
cp .env.example .env
# Điền thông tin vào .env
npm run dev
```

## API Endpoints

### Auth `/api/auth`
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/me` | Thông tin user hiện tại |
| POST | `/api/auth/logout` | Đăng xuất |

### Media `/api/media`
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/media` | Danh sách media | Public |
| GET | `/api/media/:id` | Chi tiết media | Public |
| POST | `/api/media` | Upload media (Cloudinary) | editor/vendor/admin |
| DELETE | `/api/media/:id` | Xóa media | Owner/admin |

### Content `/api/content`
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/content` | Danh sách bài viết | Public |
| GET | `/api/content/:slug` | Chi tiết bài viết | Public |
| POST | `/api/content` | Tạo bài viết | editor/vendor/admin |
| PUT | `/api/content/:id` | Cập nhật | Owner/admin |
| DELETE | `/api/content/:id` | Xóa | Owner/admin |

### API v2 `/api/v2`
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/v2/media/bulk` | Upload nhiều file (max 10) | editor/vendor/admin |
| GET | `/api/v2/media/analytics` | Thống kê media | admin |
| GET | `/api/v2/content/search` | Tìm kiếm nâng cao | Public |
| PATCH | `/api/v2/content/bulk-publish` | Publish nhiều bài | editor/admin |

### User `/user`
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/user/profile` | Xem profile |
| PUT | `/user/profile` | Cập nhật profile |
| PUT | `/user/avatar` | Đổi avatar |
| PUT | `/user/password` | Đổi mật khẩu |
| GET | `/user/my-media` | Media của tôi |
| GET | `/user/my-content` | Bài viết của tôi |

### Platform Admin `/plat` *(admin only)*
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/plat/dashboard` | Dashboard thống kê |
| GET | `/plat/users` | Danh sách users |
| PUT | `/plat/users/:id/role` | Đổi role |
| PUT | `/plat/users/:id/toggle` | Kích hoạt/vô hiệu hóa |

### Vendor `/vendor`
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/vendor` | Danh sách vendors | Public |
| GET | `/vendor/:id` | Chi tiết vendor | Public |
| POST | `/vendor` | Đăng ký vendor | Authenticated |
| PUT | `/vendor/:id/status` | Cập nhật trạng thái | admin |

## Roles

| Role | Quyền |
|------|-------|
| `user` | Xem public content |
| `editor` | Upload media, tạo/sửa content |
| `vendor` | Upload media, tạo content, quản lý vendor |
| `admin` | Toàn quyền |

## Environment Variables

Xem file `.env.example` để biết các biến môi trường cần thiết.
