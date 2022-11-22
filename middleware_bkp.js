import { NextResponse } from "next/server";
import dbConnect from "./lib/dbConnect";
// import jwt from "jsonwebtoken";

export default async function protectMiddleware(req) {
  // find authorization header
  // console.log(req.cookies.get("jwt")?.value);
  // const jwt = req.cookies.get("jwt")?.value;
  // if (!jwt) {
  //   NextResponse.rewrite("... 401 not logged in");
  // }
  // if not present, res.status(401).json(error...)

  // else go on

  try {
    const conn = await dbConnect();
  } catch (err) {
    NextResponse.rewrite("api/dbConnectionError");
  }
}

// export const config = {
//   matcher: "api/*",
// };
