export default function dbConnectionError(req, res) {
  res.status(500).json({
    message: "DB connection error... try again later.",
  });
}
