const { Category } = require("../model/category.model");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const filePath = "images/category_uploaded_files/"
const fileUploadPath = `public/${filePath}`;

// Create the log directory if it does not exist
if (!fs.existsSync(fileUploadPath)) {
  fs.mkdirSync(fileUploadPath, {
    recursive: true,
  });
}

// list all the categories
exports.index = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({
      createdAt: "descending",
    });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went Wrong",
    });
  }
};

// add new category
exports.add = async (req, res, next) => {
  const reqParam = req.body;
  await Category.create({
    name: reqParam.name,
    slug: reqParam.slug,
    isActive: reqParam.isActive,
  })
    .then((data) => {
      return res.status(200).send({
        message: "Category has been successfully added",
        success: true,
      });
    })
    .catch((error) => {
      return res
        .status(400)
        .send({ message: "Failed to add the category", success: false });
    });
};

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

// upload image
exports.uploadImage = async (req, res, next) => {
  // works on uploading the file
  upload(req, res, (err) => {
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
        const updateData = {
          image: req.file.filename,
          filePath: filePath,
        };
        // update the category file
        Category.findOneAndUpdate({ _id: req.body.categoryId }, updateData)
          .exec()
          .then((category) => {
            return res.status(200).json({
              success: true,
              message: "Category Image has been successfully uploaded",
              data: category,
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

// update category
exports.update = async (req, res) => {
  const _id = req.params.id;
  const reqParam = req.body;

  const updateData = {
    name: reqParam.name,
    slug: reqParam.slug,
    isActive: reqParam.isActive,
  };

  try {
    await Category.findOneAndUpdate({ _id: _id }, updateData)
      .exec()
      .then((category) => {
        return res.status(200).json({
          success: true,
          message: "Category has been successfully updated",
          data: category,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          success: false,
          message: "Failed to update the selected category",
        });
      });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went Wrong",
    });
  }
};

// delete category from id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    await Category.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Category has been successfully deleted",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the selected category",
    });
  }
};

// find category from id
exports.find = async (req, res) => {
  const _id = req.params.id;

  try {
    const category = await Category.findOne({ _id });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Sorry no any category found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Data found",
        data: category,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went Wrong",
    });
  }
};
