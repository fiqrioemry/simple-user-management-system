const multer = require("multer");

// use memory storage
const storage = multer.memoryStorage();

// file filter only for images
function imageFileFilter(req, file, cb) {
  const allowedExtensions = /jpeg|jpg|png|webp/;

  const isExtValid = allowedExtensions.test(file.originalname.toLowerCase());
  const isMimeValid = allowedExtensions.test(file.mimetype);

  if (isExtValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files (jpeg, jpg, png, webp) are allowed!"),
      false
    );
  }
}

const upload = (size) => {
  return multer({
    storage,
    limits: { fileSize: size || 300 * 1024 }, // default to 300 KB
    fileFilter: imageFileFilter,
  });
};

module.exports = { upload };
