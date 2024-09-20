// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

// Common Response
const { response } = require('../../../config/response');

// Mailer
const { transporter, emailTemplatePath, mailOption } = require('../../../config/mailer');
const ejs = require('ejs');

// Model
const { Op } = require('sequelize');
const { User } = require('../../../models/User');

const resetPassword = async (req, res) => {
  try {
    const validator = new Validator(req.body, {
      token: 'required',
      password: 'required|same:confirmPassword',
      confirmPassword: 'required|same:password'
    });
    const matched = await validator.check();
    if (!matched) {
      return response(res, validator.errors, 'validation', 422);
    }

    let errors = {};
    const {
      token,
      password,
    } = req.body;

    const user = await User.findOne({
      where: {
        [Op.and]: [
          { passwordToken: { [Op.eq]: token } },
          { passwordTokenExpired: { [Op.ne]: null } }
        ]
      }
    });
    if (!user) {
      return response(res, req.body, 'Invalid token.', 401);
    }

    if (user?.resetExpiries?.getTime() < new Date(Date.now() - 1 * 60 * 60 * 1000).getTime()) {
      errors['token'] = {
        message: 'The token is expired.',
        rule: 'required'
      };
    }

    if (Object.keys(errors).length) {
      return response(res, errors, 'validation', 422);
    }

    user.password = bcrypt.hashSync(password, salt); // generate a hash
    user.passwordToken = null;
    user.passwordTokenExpired = null;
    await user.save();

    // Mail
    const subject = 'Password reset successfully.';
    const content = `<div>
      <p>Your password has been reset successfully.</p>
      <p>Password: ${password}</p>
    </div>`;
    const emailContent = await ejs.renderFile(emailTemplatePath, {
      user: user?.name,
      title: subject,
      content: content
    });
    const mailOptions = {
      ...mailOption,
      to: user?.email,
      subject: subject,
      html: emailContent
    };
    await transporter.sendMail(mailOptions);

    return response(res, user, 'User reset password successfull.', 200);
  } catch (error) {
    return response(res, req.body, error.message, 500);
  }
}

module.exports = {
  resetPassword
};