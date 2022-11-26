import Invoice from "../../../models/invoiceModel";
import Patient from "../../../models/patientModel";
import { protectAndGetUser } from "../../../lib/protectRoute";
import sendBadRequest from "../../../lib/badRequestError";
import mongoose from "mongoose";
import AppError from "../../../lib/appError";
import filterObj from "../../../lib/filterObj";
import sendError from "../../../lib/errorManager";

export default async function handler(req, res) {
  const { method } = req;
  if (!["GET", "PATCH", "DELETE"].includes(method)) {
    sendBadRequest(req, res);
    console.error(`${method} can't be managed`);
    return;
  }
  try {
    const user = await protectAndGetUser(req);
    const { invoiceId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(invoiceId))
      throw new AppError(`Id ${invoiceId} is not a valid id.`, 400);
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice || String(invoice.utente) !== String(user._id))
      throw new AppError(`Invoice with id ${invoiceId} not found.`, 404);

    if (method === "GET") {
      res.status(200).json({
        status: "success",
        data: {
          invoice,
        },
      });
    } else if (method === "PATCH") {
      const filteredBody = filterObj(
        req.body,
        "paziente",
        "valore",
        "testo",
        "dataEmissione",
        "dataIncasso",
        "numeroOrdine"
      );

      // paziente exists and is owned by logged in user?
      if (filteredBody.paziente) {
        if (!mongoose.Types.ObjectId.isValid(filteredBody.paziente))
          throw new AppError(
            `Patient Id ${filteredBody.paziente} is not a valid id.`,
            400
          );
        const patient = await Patient.findById(filteredBody.paziente);
        if (!patient || String(patient.utente) !== String(req.user.id))
          throw new AppError(
            `Patient with Id ${filteredBody.paziente} not found.`,
            404
          );
      }
      // check if numeroOrdine not duplicated in invoice's year
      let year;
      if (filteredBody.dataEmissione)
        year = new Date(filteredBody.dataEmissione).getFullYear();
      else {
        year = new Date(invoice.dataEmissione).getFullYear();
      }
      const duplicatedNumOrdInvoice = await Invoice.findOne({
        _id: {
          $ne: invoiceId,
        },
        numeroOrdine: filteredBody.numeroOrdine,
        utente: user._id,
        dataEmissione: {
          $gte: `${year}-01-01`,
          $lte: `${year}-12-31`,
        },
      });
      if (duplicatedNumOrdInvoice)
        throw new AppError(
          `Duplicated order number: ${filteredBody.numeroOrdine}/${year}`,
          400
        );

      const updatedInvoice = await Invoice.findByIdAndUpdate(
        invoiceId,
        filteredBody,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedInvoice) {
        throw new AppError(
          `There was a problem while updating invoice. Try again later`,
          500
        );
      }
      res.status(200).json({
        status: "success",
        data: {
          updatedInvoice,
        },
      });
    } else if (method === "DELETE") {
      const deletedInvoice = await Invoice.findByIdAndDelete(invoiceId);
      if (!deletedInvoice) {
        throw new AppError(`Invoice not found. ID:${invoiceId}`, 404);
      }
      res.status(204).end();
    }
  } catch (err) {
    sendError(err, res);
  }
}
