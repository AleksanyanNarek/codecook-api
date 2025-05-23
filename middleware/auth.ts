// import jwt, { JwtPayload } from "jsonwebtoken";

// import ErrorHandler from "../utils/ErrorHandler";
// import { CatchAsyncError } from "./catchAsyncErrors";
// import { redis } from "../utils/redis";

// // authenticated user
// export const isAuthenticated = CatchAsyncError(
//     async (req, res, next) => {
//         const access_token = req.cookies.access_token;
        
//         if (!access_token) {
//             return next(new ErrorHandler("Please login to access this resource", 400));
//         }
        
//         const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);

//         if (!decoded) {
//             return next(new ErrorHandler("access token is not valid", 400));
//         }
        

//         if (!user) {
//             return next(new ErrorHandler("Please login to access this resource", 400));
//         }

//         req.user = JSON.parse(user);

//         next();
//     }
// );

// // validate user role
// export const authorizeRoles = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user?.role || '')) {
//             return next(new ErrorHandler(`Role: "${req.user?.role}" is not allowed to access this resource`, 403));
//         }
//         next();
//     }
// }