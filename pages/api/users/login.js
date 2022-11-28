import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/userModel";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { setCookie } from "nookies";
import sendBadRequest from "../../../lib/badRequestError";

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
    sameSite: "lax",
    path: "/",
  };

  // in production, send cookie only on https, not http
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  user.password = undefined;

  //res.setHeader("Set-Cookie", serialize("jwt", String(token), cookieOptions));
  setCookie({ res }, "jwt", String(token), cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export default async function handler(req, res) {
  const { method } = req;
  if (method !== "POST") {
    sendBadRequest(res);
    console.error(`${method} can't be managed`);
    return;
  } else {
    const conn = await dbConnect();

    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password." });
      return;
    }
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user || !(await user.correctPassword(password, user.password))) {
        res
          .status(401)
          .json({ message: "Unauthorized: incorrect email or password." });
        return;
      }
      createSendToken(user, 200, res);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Internal server error... try again later." });
    }
  }
}
