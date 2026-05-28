const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: `backend-wt/${req.uploadFolder || 'general'}`,
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'pdf', 'webp'],
    resource_type: 'auto',
    transformation: file.mimetype.startsWith('image/')
      ? [{ width: 1920, crop: 'limit', quality: 'auto' }]
      : [],
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

module.exports = { cloudinary, upload };
