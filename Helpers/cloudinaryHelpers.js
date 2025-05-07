import cloudinary from "../Config/cloudinaryConfig.js";

// upload to cloudinary

export const uploadToCloudinary = async (filePath) => {
    try {
        const resultImage = await cloudinary.uploader.upload(filePath);
        return {
            url : resultImage.secure_url,
            publicId : resultImage.public_id
        }
    } catch (error) {
        console.error("uploading to cloudinary -->", error);
        throw new Error("Error while uploading to cloudinary");
    }
}

