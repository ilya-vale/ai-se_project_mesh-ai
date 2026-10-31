import type { Request, Response, NextFunction } from 'express';

function errorHandler(
err: Error,
req: Request,
res: Response,
next: NextFunction,
): void {
    console.error(err);

    res.status(500).json({
        success: false,
        data: null,
        error: { message: `An error has occurred on the server` } 
    })
    next();
};

function notFoundHandler(req: Request, res: Response): void {   
    res.status(404).json({  
        success: false,
        data: null,
        error: { message: `Route ${req.method} on ${req.path} not found`},
});
};

export { errorHandler, notFoundHandler}