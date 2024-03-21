const mongoose = require("mongoose");

const canadaCitiesSchema = new mongoose.Schema(
  {
    city: {
      type: String,
    },
    provinceId: {
      type: String,
    },
    provinceName: {
      type: String,
    },
    timezone: {
      type: String,
    },
    postal: {
      type: String,
    },
  },
  {
    collection: "canada_cities",
  }
);

const canadaCities = mongoose.model("canadaCities", canadaCitiesSchema);

module.exports = { canadaCities };