const mongoose = require('mongoose');
require('dotenv').config;

const connectDb = async () => {
  // const uri = process.env.MONGO_URI
  // const dbName = process.env.DB_NAME
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongo Connected');
  } catch (error) {
    console.error(`ERROR : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDb;

//Alternate more better code
// mongoose
//   .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
//   .then(() => {
//     console.log('MongoDB Connected');
//   })
//   .catch((error) => console.error(error.message));

// //Connection events
// mongoose.connection.on('connected', () => {
//   console.log('Mongoose connected to db');
// });

// mongoose.connection.on('err', (err) => {
//   console.log(err.message);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('MongoDB disconnected');
// });

// //The mongoose connection doesn't get disconnected on its own even if your app has stopped. Its needs to be disconneted properly
// //You can listen to the SIGINT event on the process, it gets fired whenevr ctrl+c is preesed on the terminal

// process.on('SIGINT', async () => {
//   await mongoose.connection.close();
//   process.exit(0);
// });
