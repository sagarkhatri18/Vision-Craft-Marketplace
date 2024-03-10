const { ProductImage } = require("../model/productImage.model");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const {
  productImageUploadPath,
  productImageUploadPathThumbnail,
} = require("../services/helper");

const fileUploadPath = `public/${productImageUploadPath}`;
const thumbnailUploadPath = `public/${productImageUploadPathThumbnail}`;

// Create the directory if it does not exist
if (!fs.existsSync(fileUploadPath)) {
  fs.mkdirSync(fileUploadPath, {
    recursive: true,
  });
}

if (!fs.existsSync(thumbnailUploadPath)) {
  fs.mkdirSync(thumbnailUploadPath, {
    recursive: true,
  });
}

// multer disk storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, fileUploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const fileSize = "5";
const maxSize = parseInt(fileSize) * 1024 * 1024;

// set upload options of multer
const upload = multer({
  storage: storage,
  // to filter the incoming file requests
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLocaleLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      return cb("Only limited file extensions are allowed", false);
    }
  },
  limits: {
    fileSize: maxSize,
  },
}).single("image");

// upload product image one by one
exports.uploadImage = async (req, res, next) => {
  // works on uploading the file
  await upload(req, res, (err) => {
    if (err) {
      return res.status(400).send({
        success: false,
        message: `Something went wrong!`,
      });
    } else {
      if (req.file === undefined) {
        // check if the file exits
        return res.status(400).send({
          success: false,
          message: `Please select the file first`,
        });
      } else {
        sharp(`${fileUploadPath}/${req.file.filename}`)
          .resize(100, 100)
          .toFile(
            `${thumbnailUploadPath}/${req.file.filename}`,
            (err, resizeImage) => {
              if (err) {
                console.log(err);
              } else {
                console.log(resizeImage);
              }
            }
          );

        // upload image to the database
        const formData = {
          image: req.file.filename,
          mimeType: req.file.mimetype,
          fileSize: req.file.size,
          filePath: productImageUploadPath,
          addedBy: req.body.addedBy,
          productId: req.body.productId,
        };
        ProductImage.create(formData)
          .then((product) => {
            return res.status(200).json({
              success: true,
              message: "Product Image has been successfully uploaded",
              data: product,
            });
          })
          .catch((err) => {
            return res.status(500).send({
              success: false,
              message: "Failed to upload the image",
            });
          });
      }
    }
  });
};

// fetch all images of product
exports.loadProductImages = async (req, res, next) => {
  try {
    const images = await ProductImage.find({
      productId: req.params.productId,
    })
      .populate("productId")
      .sort({
        createdAt: "descending",
      });
    return res.status(200).json(images);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to load the images",
    });
  }
};
