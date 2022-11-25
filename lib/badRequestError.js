export default function sendBadRequest(req, res) {
  res.status(400).json({
    message: `Can't manage ${req.method} requests on this API endpoint`,
  });
}
