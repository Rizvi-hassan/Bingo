import {v2 as cloudinary} from 'cloudinary'

import { config } from 'dotenv'
config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

export const extractPublicId = (url) => {
    if (!url) return null;
    // Remove the base URL and file extension
    const parts = url.split('/');
    const name = parts[parts.length - 1];
    const dir = parts[parts.length - 2];
    return dir + '/' + name.split('.')[0];
};


export default cloudinary