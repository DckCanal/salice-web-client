const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("./lib/catchAsync");
const AppError = require("./lib/appError");
const sendEmail = require("./lib/email");
const mongoose = require("mongoose");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //can't be modified or accessed by the browser
  };

  // in production, send cookie only on https, not http
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { email, fullName, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    email,
    fullName,
    password,
    passwordConfirm,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Unauthorized: incorrect email or password", 401));
  }
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  const auth = req.headers.authorization;
  let token;
  if (auth && auth.startsWith("Bearer")) {
    token = auth.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new AppError("You are not logged in.", 401));
  else {
    try {
      const decodedPayload = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedPayload.id);
      if (!currentUser)
        return next(new AppError("The user does no longer exist", 401));
      else if (currentUser.changedPasswordAfter(decodedPayload.iat))
        return next(
          new AppError(
            "User recently changed password. Please log in again.",
            401
          )
        );
      else {
        req.user = currentUser;
        next();
      }
    } catch (err) {
      let message;
      if (err.name === "JsonWebTokenError")
        message = "Invalid token. Please log in again!";
      if (err.name === "TokenExpiredError")
        message = "Your token has expired. Please log in again!";
      return next(new AppError(message, 401));
    }
  }
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.restrictOwner = (mongooseModel) => {
  return async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next();
    let dbObject = await mongooseModel.findById(req.params.id);
    if (!dbObject || String(dbObject.utente) === String(req.user._id)) {
      return next();
    }
    next(
      new AppError("You do not have permission to perform this action", 403)
    );
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new AppError("There is no user with provided email address", 404)
    );

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Enter your new password here: ${resetURL} (link valid for 10 minutes).\n
  If you didn't forget your password, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Change your password",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later.",
        500
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) return next(new AppError("Invalid or expired token", 400));

  // 2) If token has not expired and there is a user, set the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user -> done in user model 'pre' middleware.

  // 4) Log the user in, sending JWT to the client
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // NOTE: if there is a validation error on currentPassword or newPassword, in next requests there will be an invalid jwt token error...
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  // 1) Get user from collection
  const user = await User.findById(req.user._id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(currentPassword, user.password)))
    return next(new AppError("Wrong current password.", 401));

  // 3) if so, update password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
