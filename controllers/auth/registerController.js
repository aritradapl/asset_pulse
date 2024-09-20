// Validator
const { Validator } = require("node-input-validator");

// Bcrypt
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10); // generate a salt

// Helpers
const { response } = require("../../config/response");

// JWT Middleware - Auth
const { generateAuthToken } = require('../../config/auth');

// Mailer
const { transporter, emailTemplatePath } = require('../../config/mailer');
const ejs = require('ejs');

// Slug 
const slug = require('slug');

// crypto - Generate a random token
const crypto = require('crypto');
const uniqueToken = crypto.randomBytes(5).toString('hex');

// Models
const { User } = require("../../models/User");

const register = async (req, res) => {
    try {
        // Validate the input
        const validator = new Validator(req.body, {
            name: "required|minLength:3|maxLength:255",
            email: "required|email",
            mobile: "sometimes",
            role: "required",
            password: "required|minLength:8",
            cpassword: "required|same:password"
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, req.body, validator.errors, 422);
        }

        const { 
            name, 
            email, 
            mobile,
            password,
            role
        } = req.body;
        const errors = {};

        // Check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            errors['email'] = {
                'rule' : 'unique',
                'message' : 'Email already exists'
            }
        }
        
        // If there are any errors, return them
        if (Object.keys(errors).length > 0) {
            return response(res, req.body, errors, 422);
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create new user
        const user = new User();
        user.uniqueId = slug(name) + '-' + uniqueToken;
        user.name = name;
        user.email = email;
        if (mobile) {
            user.mobile = mobile;
        }
        user.password = hashedPassword;
        user.isOnline = true;
        user.role = 'user';

        // Generate authToken and assign it before saving
        user.authToken = generateAuthToken({ ...user.toJSON() });
        await user.save();

        //  mail to user 
        const subject = 'Registered Successfully';
        const content = 
            `<div>
                <p>Hii ${user?.name},</p>
                <p>Your account has been created successfully.</p>
            </div>`;
        const emailContent = await ejs.renderFile(emailTemplatePath, {
            title: subject,
            content: content
        });
        const mailOptions = {
            to: user?.email,
            subject: subject,
            html: emailContent
        };
        await transporter.sendMail(mailOptions);

        return response(res, user, "User registered successfully", 200);
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};

module.exports = { 
    register 
};
