export const globalErrhandler = (err ,req ,res ,next )=>{
    //stack
    //message
    const stack = err?.stack;
    const statuscode = err?.statuscode ? err?.statuscode : 500;
    const message = err?.message;

    res.status(statuscode).json({
        stack,
        message,
    })
};

//404 handler
export const notFound = (res, req, next)=>{
    const err = new Error(`Route ${req.originalUrl} not found`);
    next(err);
}