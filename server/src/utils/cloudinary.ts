import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });


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

  const proposalStorage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
      folder: 'proposals',
       resource_type: 'raw',
         type: 'upload',
      allowed_formats: ['pdf'],
    }),
  });
  export const uploadProposal = multer({ storage: proposalStorage });
  

  const chatMediaStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const fileType = file.mimetype.split('/')[0]; // image, video, application, etc.

    const folder = 'chat_media';
    const allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'pdf', 'docx'];

    return {
      folder,
      allowed_formats: allowedFormats,
      resource_type: fileType === 'video' ? 'video' : 'auto', // important!
    };
  },
});

export const uploadChatMedia = multer({ storage: chatMediaStorage });
