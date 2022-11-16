const Invoice = require("../models/invoiceModel");
const Patient = require("../models/patientModel");
const catchAsync = require("./lib/catchAsync");
const AppError = require("./lib/appError");
const mongoose = require("mongoose");
const filterObj = require("./lib/filterObj");
const validateId = require("./lib/validateId");

// TODO: date problem, saved as 1 day before...
exports.getAllInvoices = catchAsync(async (req, res, next) => {
  const { year, patient, cashed, sort } = req.query;
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5000;
  const skip = (page - 1) * limit;

  let filter = {
    utente: req.user.id,
  };
  if (patient) {
    if (!mongoose.Types.ObjectId.isValid(patient))
      return next(
        new AppError(`Patient id ${patient} is not a valid id.`, 400)
      );
    if (!(await Patient.findById(patient)))
      return next(new AppError(`Patient with id ${patient} not found.`, 404));
    filter.paziente = patient;
  }
  if (cashed == "true") {
    filter.dataIncasso = { $ne: null };
  } else if (cashed == "false") {
    filter.dataIncasso = { $eq: null };
  } else if (cashed) {
    return next(
      new AppError("Cashed parameter must be either true or false.", 400)
    );
  }
  if (year) {
    if (isNaN(year))
      return next(
        new AppError(`Year parameter ${year} must be a valid year.`, 400)
      );
    filter.dataEmissione = {
      $gte: `${year}-01-01`,
      $lte: `${year}-12-31`,
    };
  }

  const sortParams = sort !== undefined ? sort.split(",") : ["-numeroOrdine"];

  const allowedSort = [
    "valore",
    "dataEmissione",
    "dataIncasso",
    "numeroOrdine",
  ];
  allowedSort.forEach((s) => {
    allowedSort.push(`-${s}`);
  });
  let filteredSortParams = sortParams.filter((p) => allowedSort.includes(p));
  filteredSortParams = filteredSortParams.map((p) => {
    if (p === "numeroOrdine") return "numeroOrdinePerAnno";
    if (p === "-numeroOrdine") return "-numeroOrdinePerAnno";
    return p;
  });

  const invoices = await Invoice.find(filter)
    .sort(filteredSortParams.join(" "))
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    results: invoices.length,
    data: { invoices },
  });
});

exports.getInvoice = catchAsync(async (req, res, next) => {
  validateId(req.params.id, "Invoice", next);
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return next(new AppError(`Invoice not found. ID: ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      invoice,
    },
  });
});

exports.createInvoice = catchAsync(async (req, res, next) => {
  req.body.utente = req.user._id;
  const filteredBody = filterObj(
    req.body,
    "utente",
    "paziente",
    "valore",
    "testo",
    "dataEmissione",
    "dataIncasso",
    "numeroOrdine"
  );

  if (!mongoose.Types.ObjectId.isValid(filteredBody.paziente)) {
    return next(
      new AppError(
        `Patient id ${filteredBody.paziente} is not a valid id.`,
        400
      )
    );
  }

  const patient = await Patient.findById(filteredBody.paziente);
  if (!patient || String(patient.utente._id) !== String(req.user._id)) {
    return next(
      new AppError(`Patient with id ${filteredBody.paziente} not found.`, 404)
    );
  }

  if (!filteredBody.valore) {
    filteredBody.valore = patient.prezzo;
  }

  // Finding or checking numeroOrdine
  const year = filteredBody.dataEmissione
    ? new Date(filteredBody.dataEmissione).getFullYear()
    : new Date(Date.now()).getFullYear();
  const filter = {
    dataEmissione: {
      $gte: `${year}-01-01`,
      $lte: `${year}-12-31`,
    },
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
    if (invoices.find((inv) => inv.numeroOrdine == filteredBody.numeroOrdine))
      return next(
        new AppError(
          `Duplicated order number ${filteredBody.numeroOrdine}`,
          400
        )
      );
  }

  const invoice = await new Invoice(filteredBody).save();
  await Patient.findByIdAndUpdate(filteredBody.paziente, {
    ultimaModifica: new Date(filteredBody.dataEmissione),
  });
  res.status(201).json({
    status: "success",
    data: {
      invoice,
    },
  });
});

exports.updateInvoice = catchAsync(async (req, res, next) => {
  validateId(req.params.id, "Invoice", next);
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice)
    return next(new AppError(`Invoice not found. ID: ${req.params.id}`, 404));
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
    validateId(filteredBody.paziente, "Patient", next);
    const patient = await Patient.findById(filteredBody.paziente);
    if (!patient || String(patient.utente) !== String(req.user.id)) {
      return next(
        new AppError(`Patient with id ${filteredBody.paziente} not found.`, 404)
      );
    }
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
      $ne: req.params.id,
    },
    numeroOrdine: filteredBody.numeroOrdine,
    utente: req.user.id,
    dataEmissione: {
      $gte: `${year}-01-01`,
      $lte: `${year}-12-31`,
    },
  });
  if (duplicatedNumOrdInvoice)
    return next(
      new AppError(
        `Duplicated order number: ${filteredBody.numeroOrdine}/${year}`,
        400
      )
    );

  const updatedInvoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedInvoice) {
    return next(
      new AppError(
        `There was a problem while updating invoice. Try again later`,
        500
      )
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      updatedInvoice,
    },
  });
});

exports.deleteInvoice = catchAsync(async (req, res, next) => {
  validateId(req.params.id, "Invoice", next);
  const invoice = await Invoice.findByIdAndDelete(req.params.id);
  if (!invoice) {
    return next(new AppError(`Invoice not found. ID:${req.params.id}`, 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
