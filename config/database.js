const mongoose = require('mongoose');

const dbURI = process.env.DB_CONNECTION_URL;

if (!dbURI) {
  console.error('MongoDB connection string (DB_CONNECTION_URL) is not defined in the environment variables.');
  process.exit(1);
}

// Function to connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      // useNewUrlParser: true, // Use new MongoDB connection string parser
      // useUnifiedTopology: true, // Use the new server discovery and monitoring engine
    });
    console.log('MongoDB connected successfully...');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err.message || err);
    process.exit(1); // Exit process with failure
  }
};

// Export the connectDB function
module.exports = connectDB;
