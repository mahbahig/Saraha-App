export const errorHandling = (err, req, res, next) => {
    res.status(err.cause || 500).json({ success: false, message: err.message || 'Internal Server Error' });
};
export const notFound = (req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
};