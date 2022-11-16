const User = require("../models/userModel");
const AppError = require("./lib/appError");
const catchAsync = require("./lib/catchAsync");
const filterObj = require("./lib/filterObj");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Throw an error if the user try to update the password
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  // 2) Update user document, filtering only non-sensitive data
  const filteredBody = filterObj(req.body, "fullName", "email");
  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await new User(req.body).save();
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const response = await User.updateOne({ _id: req.params.id }, req.body);
  const modifiedUser = await User.findById(req.params.id);
  res.status(200).json({
    status: "success",
    response,
    data: {
      modifiedUser,
    },
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  res.status(204).json({
    status: "success",
    data: "PLACEHOLDER",
  });
});
