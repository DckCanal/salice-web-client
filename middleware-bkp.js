import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export default function protectMiddleware(req) {
  // find authorization header
  console.log(req.cookies.get("jwt")?.value);
  const jwt = req.cookies.get("jwt")?.value;
  if (!jwt) {
    NextResponse.rewrite("... 401 not logged in");
  }
  // if not present, res.status(401).json(error...)

  // else go on
}

export const config = {
  //matcher: '/about/:path*',
};
