# Backend WT - Media & Content Management API

Backend RESTful API xây dựng với **Node.js/Express** + **MongoDB** + **Cloudinary** + **JWT**.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18 |
| Framework | Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (Access + Refresh Token) |
| Media Storage | Cloudinary |
| Email | Nodemailer + Gmail |
| Deploy | Railway |
| Frontend | Next.js + Vercel |

## Cấu trúc thư mục

```
src/
├── config/          # DB, Cloudinary, Email
├── controllers/     # Business logic
├── middlewares/     # Auth, error handler
├── models/          # User, Media, Content, Vendor, Comment, Reaction, Notification, Category
├── routes/
│   ├── api/v1/      # auth, media, content, comments, reactions, notifications, categories
│   ├── api/v2/      # bulk upload, analytics, advanced search
│   ├── user/        # profile management
│   ├── plat/        # admin dashboard
│   └── vendor/      # vendor management
└── utils/           # JWT helpers
frontend/
└── lib/api.js       # Next.js API client
```

## Quick Start (Local)

```bash
git clone https://gitlab.com/admin2977/backend-wt
cd backend-wt
git checkout duo-edit-20260528-165423
npm install
cp .env.example .env
# Điền thông tin vào .env
npm run dev
```

## Deploy lên Railway

1. Truy cập [https://railway.app](https://railway.app) → Đăng nhập bằng GitHub/GitLab
2. Nhấn **New Project** → **Deploy from GitLab repo**
3. Chọn repo `backend-wt`
4. Thêm các biến môi trường (xem `.env.example`)
5. Railway tự động deploy!

## API Endpoints

### Auth `/api/auth`
| Method | Endpoint | Mô tả |
|--------|----------|---------|
| POST | `/api/auth/register` | Đăng ký + gửi email xác thực |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/me` | Thông tin user |
| GET | `/api/auth/verify-email/:token` | Xác thực email |
| POST | `/api/auth/forgot-password` | Quên mật khẩu |
| POST | `/api/auth/reset-password/:token` | Đặt lại mật khẩu |

### Media `/api/media`
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/media` | Public |
| GET | `/api/media/:id` | Public |
| POST | `/api/media` | editor/vendor/admin |
| DELETE | `/api/media/:id` | Owner/admin |

### Content `/api/content`
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/content` | Public |
| GET | `/api/content/:slug` | Public |
| POST | `/api/content` | editor/vendor/admin |
| PUT | `/api/content/:id` | Owner/admin |
| DELETE | `/api/content/:id` | Owner/admin |

### API v2
| Method | Endpoint | Mô tả |
|--------|----------|---------|
| POST | `/api/v2/media/bulk` | Upload nhiều file |
| GET | `/api/v2/media/analytics` | Thống kê |
| GET | `/api/v2/content/search` | Tìm kiếm nâng cao |
| PATCH | `/api/v2/content/bulk-publish` | Publish nhiều bài |

### Comments `/api/comments`
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/comments/:targetType/:targetId` | Public |
| POST | `/api/comments` | Authenticated |
| PUT | `/api/comments/:id` | Owner |
| DELETE | `/api/comments/:id` | Owner/admin |
| POST | `/api/comments/:id/like` | Authenticated |

### Reactions `/api/reactions`
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/reactions/:targetType/:targetId` | Public |
| POST | `/api/reactions` | Authenticated |

### Notifications `/api/notifications`
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/notifications` | Authenticated |
| PATCH | `/api/notifications/read` | Authenticated |
| DELETE | `/api/notifications/:id` | Authenticated |

### Categories `/api/categories`
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/categories` | Public |
| GET | `/api/categories/:slug` | Public |
| POST | `/api/categories` | admin |
| PUT | `/api/categories/:id` | admin |
| DELETE | `/api/categories/:id` | admin |

### User `/user`
| Method | Endpoint | Mô tả |
|--------|----------|---------|
| GET | `/user/profile` | Xem profile |
| PUT | `/user/profile` | Cập nhật profile |
| PUT | `/user/avatar` | Đổi avatar |
| PUT | `/user/password` | Đổi mật khẩu |
| GET | `/user/my-media` | Media của tôi |
| GET | `/user/my-content` | Bài viết của tôi |

### Platform Admin `/plat` *(admin only)*
| Method | Endpoint | Mô tả |
|--------|----------|---------|
| GET | `/plat/dashboard` | Thống kê tổng quan |
| GET | `/plat/users` | Danh sách users |
| PUT | `/plat/users/:id/role` | Đổi role |
| PUT | `/plat/users/:id/toggle` | Kích hoạt/vô hiệu hóa |

### Vendor `/vendor`
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/vendor` | Public |
| GET | `/vendor/:id` | Public |
| POST | `/vendor` | Authenticated |
| PUT | `/vendor/:id/status` | admin |

## Roles

| Role | Quyền |
|------|--------|
| `user` | Xem public content, comment, react |
| `editor` | Upload media, tạo/sửa content |
| `vendor` | Upload media, tạo content, quản lý vendor |
| `admin` | Toàn quyền |
