import { setCookie } from "nookies";

export default function handler(req, res) {
  // Check if user is logged in?
  const { method } = req;
  if (method !== "POST") {
    sendBadRequest(res);
    console.error(`${method} can't be managed`);
    return;
  } else {
    setCookie({ res }, "jwt", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
    });
    res.status(200).json({
      status: "success",
    });
  }
}
