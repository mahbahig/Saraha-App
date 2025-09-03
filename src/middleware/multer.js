import multer from "multer";
import fs from "node:fs";

export const allowedExtensions = {
    image: ["image/png", "image/jpeg"],
    video: ["video/mp4"]
}

export const localMulter = ({ customPath = "generals", customExtensions = [] }) => {
    const fullPath = `uploads/${customPath}`;
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, fullPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
            cb(null, `${uniqueSuffix}_${file.originalname}`);
        }
    });

    function fileFilter(req, file, cb) {
        if (!customExtensions.includes(file.mimetype)) {
            cb(new Error("Invalid file type"));
        } else {
            cb(null, true);
        }
    }

    const upload = multer({ storage, fileFilter });
    return upload;
}

export const hostMulter = ({ customExtensions = [] }) => {
    const storage = multer.diskStorage({ });

    function fileFilter(req, file, cb) {
        if (!customExtensions.includes(file.mimetype)) {
            cb(new Error("Invalid file type"));
        } else {
            cb(null, true);
        }
    }

    const upload = multer({ storage, fileFilter });
    return upload;
}