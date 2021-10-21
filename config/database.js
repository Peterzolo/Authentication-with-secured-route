const mongoose = require("mongoose");
//require('dotenv').config()

const connectToMongoDb = async () => {
  try {
    const mongoString = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Mongo Db successfully connected ${mongoString.connection.host}`
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectToMongoDb;
