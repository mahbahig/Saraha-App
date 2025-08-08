export const validation = (schema) => {
    return (req, res, next) => {
        let validationErrors = [];
        for (const key of Object.keys(schema)) {
            const error = schema[key].validate(req[key], { abortEarly: false });
            if (error.error) {
                validationErrors.push(error.error?.details);
            }
        }
        if (validationErrors.length) {
            return res.status(400).json(validationErrors);
        }
        return next();
    };
};