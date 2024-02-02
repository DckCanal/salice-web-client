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
    sendBadRequest(res);
    console.error(`${method} can't be managed`);
    return;
  }
  try {
    const user = await protectAndGetUser(req);
    const { patientId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(patientId))
      throw new AppError(`Id ${patientId} is not a valid id.`, 400);
    const patient = await Patient.findById(patientId);
    if (!patient || String(patient.utente) !== String(user._id))
      throw new AppError(`Patient with id ${patientId} not found.`, 404);

    if (method === "GET") {
      res.status(200).json({
        status: "success",
        data: {
          patient,
        },
      });
    } else if (method === "PATCH") {
      const filteredBody = filterObj(
        req.body,
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
        "attivo"
      );
      // Filling structured fields
      if (filteredBody.indirizzoResidenza !== undefined) {
        Object.keys(patient.indirizzoResidenza).forEach((key) => {
          if (filteredBody.indirizzoResidenza[key] == undefined)
            filteredBody.indirizzoResidenza[key] =
              patient.indirizzoResidenza[key];
        });
      }
      if (filteredBody.luogoNascita !== undefined) {
        Object.keys(patient.luogoNascita).forEach((key) => {
          if (filteredBody.luogoNascita[key] == undefined)
            filteredBody.luogoNascita[key] = patient.luogoNascita[key];
        });
      }
      let queryData;
      if (
        filteredBody.dataNascita === undefined ||
        new Date(filteredBody.dataNascita).toString() === "Invalid Date" ||
        isNaN(new Date(filteredBody.dataNascita))
      ) {
        queryData = {
          $set: filteredBody,
          $unset: { dataNascita: true },
        };
      } else queryData = filteredBody;
      const updatedPatient = await Patient.findByIdAndUpdate(
        patientId,
        queryData,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedPatient) {
        throw new AppError(
          `There was a problem while updating patient. Try again later`,
          500
        );
      }
      res.status(200).json({
        status: "success",
        data: {
          updatedPatient,
        },
      });
    } else if (method === "DELETE") {
      const unactivedPatient = await Patient.findByIdAndUpdate(patientId, {
        attivo: false,
      });
      if (!unactivedPatient)
        throw new AppError(`Patient not found. ID: ${patientId}`, 404);

      res.status(204).end();
    }
  } catch (err) {
    sendError(err, res);
  }
}
