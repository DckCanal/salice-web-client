const mongoose = require("mongoose");
const AppError = require("./appError");

// TODO: should this function become a middleware?
const validateId = (id, obj, next) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError(`${obj} id ${id} is not a valid id.`, 400));
  }
};

module.exports = validateId;
