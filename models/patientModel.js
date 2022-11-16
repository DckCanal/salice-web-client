const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "Un paziente deve avere un nome"],
  },
  cognome: {
    type: String,
    required: [true, "Un paziente deve avere un cognome"],
  },
  codiceFiscale: String,
  partitaIva: String,
  indirizzoResidenza: {
    paese: String,
    provincia: String,
    cap: String,
    via: String,
    civico: String,
  },
  telefono: String,
  email: String,
  dataNascita: Date,
  luogoNascita: {
    paese: String,
    provincia: String,
    CAP: String,
  },
  prezzo: Number,
  ultimaModifica: Date, // creare un campo virtuale o un query middleware?
  utente: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Un paziente deve avere un utente proprietario"],
    ref: "User",
  },
  attivo: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);
