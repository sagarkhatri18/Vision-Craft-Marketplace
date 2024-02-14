const User = require("../model/user.model");

exports.index = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);

    res.status(500).send({
      success: false,
      message: "Something went Wrong",
    });
  }
};

exports.addNewUser = (req, res) => {
  const reqParam = req.query;
  User.create({
    first_name: reqParam.first_name,
    last_name: reqParam.last_name,
    email: reqParam.email,
    country: reqParam.country,
  })
    .then((data) => {
      res
        .status(200)
        .send({ message: "User has been successfully added", success: true });
    })
    .catch((error) => {
      res
        .status(400)
        .send({ message: "Failed to add the user", success: false });
    });
};
