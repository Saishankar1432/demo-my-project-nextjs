import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image file buffer
 * @param {string} folder - Cloudinary folder name (default: 'products')
 * @returns {Promise<string>} - Cloudinary secure URL
 */
export async function uploadToCloudinary(buffer, folder = 'products') {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' }, // Limit max dimensions
                    { quality: 'auto' }, // Auto quality optimization
                    { fetch_format: 'auto' }, // Auto format (WebP when supported)
                ],
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );

        uploadStream.end(buffer);
    });
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Deletion result
 */
export async function deleteFromCloudinary(publicId) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
}

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
export function getPublicIdFromUrl(url) {
    if (!url) return null;

    // Extract public ID from Cloudinary URL
    // Example: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/products/image.jpg
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');

    if (uploadIndex === -1) return null;

    // Get everything after 'upload/v1234567890/' (version number)
    const pathAfterUpload = parts.slice(uploadIndex + 2).join('/');

    // Remove file extension
    return pathAfterUpload.replace(/\.[^/.]+$/, '');
}

export default cloudinary;
