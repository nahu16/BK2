// config/multer.config.js
import multer from "multer";
import { join } from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(process.cwd(), "src/public/image/product"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
