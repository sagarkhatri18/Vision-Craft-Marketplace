const { User } = require("../model/user.model");

// list all the users
exports.index = async (req, res) => {
  try {
    const users = await User.find({}).sort({
      created_at: "descending",
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went Wrong",
    });
  }
};

// fetch the particular user by id
exports.find = async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Sorry no any user found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Data found",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went Wrong",
    });
  }
};

// delete user from id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    await User.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "User has been successfully deleted",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the selected user",
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
