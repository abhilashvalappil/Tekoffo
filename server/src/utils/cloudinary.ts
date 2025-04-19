import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

 

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: async (req, file) => {
//       return {
//         folder: 'user_profiles', // Cloudinary folder
//         allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed file formats
//         transformation: [{ width: 500, height: 500, crop: 'limit' }], // Image transformation
//       };
//     },
//   });

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      return {
        folder: 'user_profiles',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      };
    },
  });

  export const upload = multer({ storage });