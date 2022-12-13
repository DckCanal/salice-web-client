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
  if (method !== "GET" && method !== "POST") {
    sendBadRequest(req, res);
    console.error(`${method} can't be managed`);
    return;
  }
  try {
    const user = await protectAndGetUser(req);
    if (method === "GET") {
      let filter = {
        utente: user._id,
      };
      const { year, patient: patientId, cashed, sort } = req.query;
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 5000;
      const skip = (page - 1) * limit;

      if (patientId) {
        if (!mongoose.Types.ObjectId.isValid(patientId))
          throw new AppError(`Patient id ${patientId} is not a valid id.`, 400);
        const patient = await Patient.findById(patientId);
        if (!patient || String(patient.utente) !== String(user._id))
          throw new AppError(`Patient with id ${patientId} not found.`, 404);
      }

      if (cashed == "true") {
        filter.dataIncasso = { $ne: null };
      } else if (cashed == "false") {
        filter.dataIncasso = { $eq: null };
      } else if (cashed)
        throw new AppError(
          "Cashed parameter must be either true or false.",
          400
        );

      if (year) {
        if (isNaN(year))
          throw new AppError(
            `Year parameter ${year} must be a valid year.`,
            400
          );
        filter.dataEmissione = {
          $gte: `${year}-01-01`,
          $lte: `${year}-12-31`,
        };
      }

      const sortParams =
        sort !== undefined ? sort.split(",") : ["-numeroOrdine"];
      const allowedSort = [
        "valore",
        "dataEmissione",
        "dataIncasso",
        "numeroOrdine",
      ];
      allowedSort.forEach((s) => {
        allowedSort.push(`-${s}`);
      });
      let filteredSortParams = sortParams.filter((p) =>
        allowedSort.includes(p)
      );
      filteredSortParams = filteredSortParams.map((p) => {
        if (p === "numeroOrdine") return "numeroOrdinePerAnno";
        if (p === "-numeroOrdine") return "-numeroOrdinePerAnno";
        return p;
      });

      const invoices = await Invoice.find(filter)
        .sort(filteredSortParams.join(" "))
        .skip(skip)
        .limit(limit);
      if (invoices == undefined)
        throw new AppError(
          `There was an error retrieving invoices... Please try again later.`,
          500
        );
      res.status(200).json({
        status: "success",
        results: invoices.length,
        data: { invoices },
      });
    } else if (method === "POST") {
      const filteredBody = filterObj(
        { ...req.body, utente: user._id },
        "utente",
        "paziente",
        "valore",
        "testo",
        "dataEmissione",
        "dataIncasso",
        "numeroOrdine",
        "d"
      );

      if (!mongoose.Types.ObjectId.isValid(filteredBody.paziente))
        throw new AppError(
          `Patient id ${filteredBody.paziente} is not a valid id.`,
          400
        );

      const patient = await Patient.findById(filteredBody.paziente);
      if (!patient || String(patient.utente._id) !== String(user._id))
        throw new AppError(
          `Patient with id ${filteredBody.paziente} not found.`,
          404
        );

      if (!filteredBody.valore) {
        filteredBody.valore = patient.prezzo;
      }

      // Finding or checking numeroOrdine
      if (filteredBody.d != true) {
        const year = filteredBody.dataEmissione
          ? new Date(filteredBody.dataEmissione).getFullYear()
          : new Date(Date.now()).getFullYear();
        const filter = {
          dataEmissione: {
            $gte: `${year}-01-01`,
            $lte: `${year}-12-31`,
          },
          utente: user._id,
        };
        const invoices = await Invoice.find(filter);
        if (!filteredBody.numeroOrdine) {
          // Setting max numeroOrdine
          const maxNumeroOrdine = invoices
            .map((i) => i.numeroOrdine)
            .reduce((maxNO, curNO) => (curNO > maxNO ? curNO : maxNO), 0);
          filteredBody.numeroOrdine = maxNumeroOrdine + 1;
        } else {
          // Check if given numeroOrdine already exists
          if (
            invoices.find(
              (inv) => inv.numeroOrdine == filteredBody.numeroOrdine
            )
          )
            throw new AppError(
              `Duplicated order number ${filteredBody.numeroOrdine}`,
              400
            );
        }
      } else {
        filteredBody.numeroOrdine = -1;
      }

      const invoice = await new Invoice(filteredBody).save();
      if (!invoice)
        throw new AppError(
          `There was an error creating new invoice... Try again later.`,
          500
        );

      if (filteredBody.d != true) {
        await Patient.findByIdAndUpdate(filteredBody.paziente, {
          ultimaModifica: new Date(filteredBody.dataEmissione),
        });
      }

      res.status(201).json({
        status: "success",
        data: {
          invoice,
        },
      });
    }
  } catch (err) {
    sendError(err, res);
  }
}
