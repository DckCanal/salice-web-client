import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/userModel";
import jwt from "jsonwebtoken";
import { protectAndGetUser } from "../../../lib/protectRoute";

/*
    Returns user data.
*/
export default async function handler(req, res) {
  try {
    const user = await protectAndGetUser(req);
    res.status(200).json({ user });
  } catch (err) {
    res.status(err.statusCode).json({ message: err.message });
  }
}
