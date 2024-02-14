const mongoose = require("mongoose");

const localDB = `mongodb+srv://sagarkhatri18:Password123@lambtoncollege.mpr6oea.mongodb.net/vision-craft-marketplace`;
const connectDB = async () => {
  await mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB Connected");
};
module.exports = connectDB;
