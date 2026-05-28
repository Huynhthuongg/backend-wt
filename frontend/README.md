# Frontend Next.js - Backend WT

## Setup

```bash
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
npm install axios
```

Copy file `lib/api.js` vào project Next.js.

## Cấu hình `.env.local`

```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```

## Sử dụng API trong component

```jsx
import { authAPI, contentAPI, mediaAPI } from '@/lib/api';

// Đăng nhập
const { data } = await authAPI.login({ email, password });
localStorage.setItem('token', data.token);
localStorage.setItem('refreshToken', data.refreshToken);

// Lấy danh sách content
const { data } = await contentAPI.getAll({ page: 1, limit: 10 });

// Upload media
const formData = new FormData();
formData.append('file', file);
formData.append('title', 'My Image');
const { data } = await mediaAPI.upload(formData);
```

## Deploy Frontend lên Vercel

```bash
npm install -g vercel
vercel
# Chọn project, điền NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```
