import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.MY_CLOUD_NAME, 
        api_key: process.env.MY_CLOUD_API_KEY, 
        api_secret:process.env.MY_CLOUD_SECRET_KEY 
    });
const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            fileToUploads,
            { resource_type: "auto" }, 
            (error, result) => {
                if (error) {
                    reject(error);  
                } else {
                    resolve({ url: result.secure_url,
                              asset_id:result.asset_id,
                              public_id:result.public_id
                     }); 
                }
            }
        );
    });
};
const cloudinaryDeleteImg = async (fileToUploads) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(
            fileToUploads,
            { resource_type: "auto" }, 
            (error, result) => {
                if (error) {
                    reject(error);  
                } else {
                    resolve({ url: result.secure_url,
                              asset_id:result.asset_id,
                              public_id:result.public_id
                     }); 
                }
            }
        );
    });
};

export  {cloudinaryUploadImg,cloudinaryDeleteImg};