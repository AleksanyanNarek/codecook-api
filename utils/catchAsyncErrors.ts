import { Request, Response, NextFunction } from 'express';

export const CatchAsyncError = (
    theFunc: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        theFunc(req, res, next).catch((error: any) => {
            console.log(error, 'error in catchAsyncError');
            
            next(error)
        });
    };
};