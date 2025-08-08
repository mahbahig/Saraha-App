export const globalErrorHandling = (err, req, res, next) => {
    res.status(err.cause || 500).json({ message: err.message || 'Internal Server Error' });
};