const mongoose = require("mongoose");

export const connectDB = async (callback: any) => {
  try {
    const dbConnectionString = process.env.DB_CONNECTION_STRING;
    if (dbConnectionString) {
      const client = await mongoose.connect(dbConnectionString);
      if (client) {
        console.log("Database connected successfully");
        callback();
      } else {
        console.log("Database url is not provided");
      }
    }
  } catch (error) {
    console.log(error);
  }
};
