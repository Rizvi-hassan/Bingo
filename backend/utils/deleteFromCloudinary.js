import cloudinary from "./cloudinary.js";


const extractPublicId = (url) => {
    if (!url) return null;
    // Remove the base URL and file extension
    const parts = url.split('/');
    const name = parts[parts.length - 1];
    const dir = parts[parts.length - 2];
    return dir + '/' + name.split('.')[0];
};

const deleteFromCloudinary = async (url) => {
    const publicId = extractPublicId(url);
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }, (error, result) => {
        if (error) {
            console.error('Error deleting media:', error);
        } else {
            console.log('Media deleted successfully:', result);
        }
    })
}

export default deleteFromCloudinary;