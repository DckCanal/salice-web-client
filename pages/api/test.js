export default async function handler(req, res) {
  res.status(200).json({ message: "OK" });
  console.log("Here??");
  res.status(404).json({ message: "Sorry, not found" });
}
