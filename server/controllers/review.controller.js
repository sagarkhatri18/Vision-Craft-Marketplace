const { Review } = require("../model/review.model");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");



// list all the reviews
exports.index = async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({
      createdAt: "descending",
    });
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went Wrong",
    });
  }
};

// add new review
exports.add = async (req, res, next) => {
  const reqParam = req.body;
  await Review.create({
    name: reqParam.name,
  })
    .then((data) => {
      return res.status(200).send({
        message: "Review has been successfully added",
        success: true,
      });
    })
    .catch((error) => {
      return res
        .status(400)
        .send({ message: "Failed to add the review", success: false });
    });
};




