import * as dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { v2 as cloudinary} from 'cloudinary';

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

app.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
    // connectDB();
});