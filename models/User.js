const mongoose = require('mongoose');

// Define the schema with timestamps option
const userSchema = new mongoose.Schema({
  uniqueId: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  emailToken: {
    type: String
  },
  emailTokenExpired: {
    type: Date
  },
  mobile: {
    type: String
  },
  otp: {
    type: String
  },
  otpExpired: {
    type: Date
  },
  password: {
    type: String,
    required: true
  },
  passwordToken: {
    type: String
  },
  passwordTokenExpired: {
    type: Date
  },
  authToken: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true, // This will automatically add createdAt and updatedAt fields
  paranoid: true
});

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = {
  User
};
