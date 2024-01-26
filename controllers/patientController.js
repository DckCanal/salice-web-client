const Patient = require("../models/patientModel");
const AppError = require("./lib/appError");
const catchAsync = require("./lib/catchAsync");
const filterObj = require("./lib/filterObj");
const validateId = require("./lib/validateId");

exports.getAllPatients = catchAsync(async (req, res, next) => {
  const { sort, active } = req.query;
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5000;
  const skip = (page - 1) * limit;
  // if (req.query.page !== undefined) {
  //   const numPatients = await Patient.countDocuments();
  //   console.log(numPatients);
  //   if (skip >= numPatients)
  //     return next(new AppError(`Page ${page} does not exist.`, 404));
  // }
  const sortParams = sort !== undefined ? sort.split(",") : ["-cognome -nome"];
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
  const filteredSortParams = sortParams.filter((p) => allowedSort.includes(p));

  let filter = {
    utente: req.user.id,
  };
  const allowedActiveState = ["true", "false", "both"];
  const activeState = allowedActiveState.includes(active) ? active : "true";
  if (activeState === "true") filter["attivo"] = { $ne: false };
  else if (activeState === "false") filter["attivo"] = { $eq: false };

  const patients = await Patient.find(filter)
    .sort(filteredSortParams.join(" "))
    .skip(skip)
    .limit(limit);
  res.status(200).json({
    status: "success",
    results: patients.length,
    data: { patients },
  });
});

exports.getPatient = catchAsync(async (req, res, next) => {
  validateId(req.params.id, "Patient", next);
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    return next(new AppError(`Patient not found. ID: ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      patient,
    },
  });
});
exports.createPatient = catchAsync(async (req, res, next) => {
  req.body.utente = req.user._id;
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
    "ultimaModifica",
    "utente"
  );
  const patient = await new Patient(filteredBody).save();
  res.status(201).json({
    status: "success",
    data: {
      patient,
    },
  });
});

exports.updatePatient = catchAsync(async (req, res, next) => {
  validateId(req.params.id, "Patient", next);
  const patient = await Patient.findById(req.params.id);
  if (!patient)
    return next(new AppError(`Patient not found. ID: ${req.params.id}`, 404));
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
        filteredBody.indirizzoResidenza[key] = patient.indirizzoResidenza[key];
    });
  }
  if (filteredBody.luogoNascita !== undefined) {
    Object.keys(patient.luogoNascita).forEach((key) => {
      if (filteredBody.luogoNascita[key] == undefined)
        filteredBody.luogoNascita[key] = patient.luogoNascita[key];
    });
  }
  const updatedPatient = await Patient.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!patient) {
    return next(
      new AppError(
        `There was a problem while updating patient. Try again later`,
        500
      )
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      patient: updatedPatient,
    },
  });
});

exports.deletePatient = catchAsync(async (req, res, next) => {
  validateId(req.params.id, "Patient", next);
  const patient = await Patient.findByIdAndUpdate(req.params.id, {
    attivo: false,
  });
  if (!patient) {
    return next(new AppError(`Patient not found. ID: ${req.params.id}`, 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
