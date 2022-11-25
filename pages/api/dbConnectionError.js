export default function dbConnectionError(_req, res) {
  res.status(500).json({
    message: "DB connection error... try again later.",
  });
}
