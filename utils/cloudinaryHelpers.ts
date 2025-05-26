import cloudinary from 'cloudinary';

export const uploadImage = async (filePath: string): Promise<string> => {
    const myCloud = await cloudinary.v2.uploader.upload(
        filePath,
        { folder: "CodeCook/main" },
    );

    return myCloud.secure_url;
}