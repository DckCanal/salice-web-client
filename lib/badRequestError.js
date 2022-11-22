export default function sendBadRequest(res) {
  res.status(400).json({
    message: `Can't manage ${res.method} requests on this API endpoint`,
  });
}
