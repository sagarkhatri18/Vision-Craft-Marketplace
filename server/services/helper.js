const jwt = require("jsonwebtoken");
const jwtSecret =
  "a973059456cb79b63c432ea105a53de09bc8aa303ece9607820edb5654b98d60313831";

// generate new jwt token
const tokenSign = (user) => {
  const payload = {
    id: user._id,
    // firstName: user.firstName,
    // lastName: user.lastName,
    // email: user.email,
    role: user.role,
    // verified: user.verified,
    // profileCompletion: user.profileCompletion,
    // city: user.city,
    // contactNumber: user.contactNumber,
    // postalCode: user.postalCode,
    // province: user.province,
    // streetName: user.streetName,
    // suiteNumber: user.suiteNumber,
  };

  return jwt.sign(payload, jwtSecret, { expiresIn: "1800s" });
};

//verify the bearer token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, verifiedJwt) => {
    if (err) return res.status(401).json({ message: "Not authorized" });

    next();
  });
};

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Function to generate a random alphanumeric string of a given length
const generateRandomString = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Function to generate a random order ID
const generateOrderID = () => {
  const timestamp = Date.now(); // Get current timestamp
  const randomString = generateRandomString(5); // Generate a random string of length 5
  return `${timestamp}-${randomString}`;
};

// Function to generate a random booking number
const generateOrderNumber = generateOrderID();

const categoryImageUploadPath = "images/category_uploaded_files";
const categoryImageUploadPathThumbnail = `${categoryImageUploadPath}/thumbnails`;
const productImageUploadPath = "images/product_uploaded_files";
const productImageUploadPathThumbnail = `${productImageUploadPath}/thumbnails`;

module.exports = {
  tokenSign,
  authenticateToken,
  slugify,
  generateOrderNumber,
  categoryImageUploadPath,
  categoryImageUploadPathThumbnail,
  productImageUploadPath,
  productImageUploadPathThumbnail,
};
