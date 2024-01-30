import mongoose from "mongoose";
const invoiceSchema = new mongoose.Schema(
  {
    valore: Number,
    dataEmissione: {
      type: Date,
      default: Date.now(),
      required: [true, "La data di emissione è obbligatoria"],
    },
    dataIncasso: {
      type: Date,
    },
    incassata: {
      type: Boolean,
      default: true,
    },
    pagamentoTracciabile: {
      type: Boolean,
      default: false,
    },
    comunicazioneTS: {
      type: Boolean,
      default: false,
    },
    testo: {
      type: String,
      default: "Trattamento massoterapico",
      required: [true, "Occorre inserire un testo per la fattura"],
    },
    numeroOrdine: {
      type: Number,
      required: true,
    },
    d: {
      type: Boolean,
      default: false,
    },
    numeroOrdinePerAnno: {
      type: String,
      select: false,
    },
    paziente: {
      type: mongoose.Schema.ObjectId,
      ref: "Patient",
    },
    utente: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Una fattura deve avere un utente proprietario"],
      ref: "User",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
invoiceSchema.virtual("anno").get(function () {
  return this.dataEmissione.getFullYear();
});
invoiceSchema.pre("save", function (next) {
  this.numeroOrdinePerAnno = `${this.dataEmissione.getFullYear()}-${String(
    this.numeroOrdine
  ).padStart(10, "0")}`;
  next();
});

module.exports =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
