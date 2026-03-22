import multer from "multer";


const propertyStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/properties"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images are allowed"), false);
};

export const uploadPropertyImages = multer({ storage: propertyStorage, fileFilter });
