export const globalErrorHandling = (err, req, res, next) => {
    res.status(err.cause || 500).json({ success: false, message: err.message || 'Internal Server Error' });
};