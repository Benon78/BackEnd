import { uploadToCloudinary } from "../Helpers/cloudinaryHelpers.js";
import ImageModel from "../models/image.js";
import cloudinary from "../Config/cloudinaryConfig.js";
// upload controller
export const uploadImageToDb = async (req,res) =>{
    try {
        
        // check if file is miss in re object
            if(!req.file){
             return   res.status(400).json({
                    success: false,
                    message: 'File required. Please upload an image'
                })
            }

        // upload to cloudinary
        const {url,publicId} = await uploadToCloudinary(req.file.path);

        // upload to Db with uploaded user ID
        const uploadedImage = await ImageModel.create({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully!',
            image: uploadedImage
        })


    } catch (error) {
        console.log("Error upload to Db -->",error);
        res.status(500).json({
            success: false,
            message: "Some thing went wrong! Please try again"
        })
    }
}

// fetch all images
export const fetchImagesController = async (req,res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await ImageModel.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder

        
        const images = await ImageModel.find().sort(sortObj).skip(skip).limit(limit);

        if(images.length > 0){
            res.status(200).json({
                success: true,
                message: 'Images loads successfully!',
                currentPage: page,
                totalPages,
                totalImages,
                data: images
            })
        }else{
            res.status(404).json({
                success: false,
                message: 'Images are not found. Please try again'
            })
        }
        
    } catch (error) {
        console.log("Error upload to Db -->",error);
        res.status(500).json({
            success: false,
            message: "Some thing went wrong! Please try again"
        })
    }
}

// delete image by id controller
export const deleteImageByIdController = async (req,res) =>{
    try {
        const { id } = req.params;
        const { userId } = req.userInfo;

        const image = await ImageModel.findById(id);

        if(!image){
           return res.status(404).json({
                success: false,
                message: 'Image with current ID not found! Please try again with another ID'
            })
        }

// check if image uploaded by current admin
        if(image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this image'
            })
        }
// delete from cloudinary first
        await cloudinary.uploader.destroy(image.publicId);

        // delete from DB
        const deletedImage = await ImageModel.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Image with current ID deleted Successfully!',
            image: deletedImage
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Some thing went wrong! Please try again.'
        })
    }
}