const jwt = require("jsonwebtoken");
const jwtSecret =
  "a973059456cb79b63c432ea105a53de09bc8aa303ece9607820edb5654b98d60313831";

// generate new jwt token
const tokenSign = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: "1800s" }
  );
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

module.exports = {
  tokenSign,
  authenticateToken,
  slugify,
};
