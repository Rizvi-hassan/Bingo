import cloudinary from './cloudinary.js';
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import multer from 'multer'

const profileStorage = new CloudinaryStorage({
    cloudinary, 
    params: {
        folder: 'profile-pics',
        allowedFormats: ['jpg', 'png', 'jpeg'],
        secure: true
    }
})

const profileUpload = multer({
    storage: profileStorage,
    limits: {fileSize: 1024 * 1024 * 10}  // limit filesize to 10MB
})

export {profileUpload}
