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
    return res.status(500).send({
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

// add the new user
exports.add = async (req, res) => {
  const reqParam = req.body;
  await User.create({
    firstName: reqParam.firstName,
    lastName: reqParam.lastName,
    email: reqParam.email,
    password: reqParam.password,
    contact: reqParam.contact,
    address: reqParam.address,
    role: reqParam.role,
    verified: reqParam.verified,
  })
    .then((data) => {
      return res.status(200).json({
        success: true,
        message: "User has been successfully added",
      });
    })
    .catch((error) => {
      return res.status(500).json({
        success: false,
        message: "Failed to add the user",
      });
    });
};

// update user
exports.update = async (req, res) => {
  const _id = req.params.id;
  const reqParam = req.body;

  const updateData = {
    firstName: reqParam.firstName,
    lastName: reqParam.lastName,
    email: reqParam.email,
    contact: reqParam.contact,
    address: reqParam.address,
    role: reqParam.role,
    verified: reqParam.verified,
  };

  try {
    await User.findOneAndUpdate({ _id: _id }, updateData)
      .exec()
      .then((user) => {
        return res.status(200).json({
          success: true,
          message: "User has been successfully updated",
        });
      })
      .catch((err) => {
        return res.status(500).send({
          success: false,
          message: "Failed to update the selected user",
        });
      });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went Wrong",
    });
  }
};
