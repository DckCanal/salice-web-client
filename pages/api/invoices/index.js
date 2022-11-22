import User from "../../../models/userModel";
import Invoice from "../../../models/invoiceModel";
import Patient from "../../../models/patientModel";
import dbConnect from "../../../lib/dbConnect";
import { protectAndGetUser } from "../../../lib/protectRoute";
import sendBadRequest from "../../../lib/badRequestError";

export default async function handler(req, res) {
  const { method } = req;
  if (method !== "GET") {
    sendBadRequest(res);
    console.error(`${method} can't be managed`);
    return;
  }
  try {
    const user = await protectAndGetUser(req);
    const invoices = await Invoice.find({ utente: user._id });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(err.statusCode).json({ message: err.message });
  }
}
