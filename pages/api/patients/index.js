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
      const { sort, active } = req.query;
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 5000;
      const skip = (page - 1) * limit;
      const sortParams =
        sort !== undefined
          ? sort.split(",")
          : /*["-cognome -nome"]*/ ["-ultimaModifica"];
      const allowedSort = [
        "ultimaModifica",
        "cognome",
        "nome",
        "dataNascita",
        "prezzo",
      ];
      allowedSort.forEach((s) => {
        allowedSort.push(`-${s}`);
      });
      const filteredSortParams = sortParams.filter((p) =>
        allowedSort.includes(p)
      );

      let filter = {
        utente: user._id,
      };
      const allowedActiveState = ["true", "false", "both"];
      const activeState = allowedActiveState.includes(active) ? active : "true";
      if (activeState === "true") filter["attivo"] = { $ne: false };
      else if (activeState === "false") filter["attivo"] = { $eq: false };

      const patients = await Patient.find(filter)
        .sort(filteredSortParams.join(" "))
        .skip(skip)
        .limit(limit);
      if (patients == undefined)
        throw new AppError(
          `There was an error retrieving patients... Please try again later.`,
          500
        );
      res.status(200).json({
        status: "success",
        results: patients.length,
        data: { patients },
      });
    } else if (method === "POST") {
      const filteredBody = filterObj(
        { ...req.body, utente: user._id },
        "nome",
        "cognome",
        "codiceFiscale",
        "partitaIva",
        "indirizzoResidenza",
        "telefono",
        "email",
        "dataNascita",
        "luogoNascita",
        "prezzo",
        "ultimaModifica",
        "utente"
      );
      const patient = await new Patient(filteredBody).save();
      if (!patient)
        throw new AppError(
          `There was an error creating new patient... Try again later.`,
          500
        );
      res.status(201).json({
        status: "success",
        data: {
          patient,
        },
      });
    }
  } catch (err) {
    sendError(err, res);
  }
}
