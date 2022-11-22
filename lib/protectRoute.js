import jwt from "jsonwebtoken";
import AppError from "./appError";
import User from "../models/userModel";
import dbConnect from "../lib/dbConnect";

/*
    Check if the jwt token provided within a request belongs to a valid user.
    If so, return the User object, elsewhere throws the right AppError
*/
export async function protectAndGetUser(req) {
  await dbConnect();
  const auth = req.headers["authorization"];
  let token;
  if (auth && auth.startsWith("Bearer")) {
    token = auth.split(" ")[1];
  } else if (req.cookies["jwt"]) {
    token = req.cookies["jwt"];
  }

  if (!token) throw new AppError("You are not logged in.", 401);
  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decodedPayload.id);
    if (!currentUser) throw new AppError("The user does no longer exist.", 401);
    if (currentUser.changedPasswordAfter(decodedPayload.iat))
      throw new AppError(
        "User recently changed password. Please log in again.",
        401
      );
    return currentUser;
  } catch (err) {
    if (err.name === "JsonWebTokenError")
      throw new AppError("Invalid token. Please log in again.", 401);
    if (err.name === "TokenExpiredError")
      throw new AppError("Your token as expired. Please log in again.", 401);
  }
}
/*
    Check if the given user belongs to the given roles, such as 'admin', ...
*/
export async function restrictToRoles(user, ...roles) {
  await dbConnect();
  if (!roles.includes(user.role))
    throw new AppError(
      "You do not have permission to perform this action.",
      403
    );
  return user;
}
/*
    Check if the given user is the owner of the given mongooseObject (Invoice or Patient),
    through the 'utente' field.
*/
export async function restrictToOwner(mongooseObject, user) {
  await dbConnect();
  if (String(mongooseObject.utente) !== String(user._id))
    throw new AppError(
      "You do not have permission to perform this action.",
      403
    );
  return user;
}
