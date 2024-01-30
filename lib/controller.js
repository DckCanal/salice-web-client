import axios from "axios";

const baseUrl = "/"; //before http://localhost:3000
const apiUrl = `${baseUrl}api/`; //before api/v1/
const invoicesUrl = `${apiUrl}invoices/`;
const patientsUrl = `${apiUrl}patients/`;

export const getAllInvoices = async (d) => {
  try {
    const res = await axios({
      method: "GET",
      url: invoicesUrl,
      withCredentials: true,
      params: { d },
    });
    if (res.data.status === "success") {
      return {
        results: res.data.results,
        invoices: res.data.data.invoices,
      };
    }
  } catch (err) {
    console.error(err);
  }
};

export const getAllPatients = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: patientsUrl,
      withCredentials: true,
    });
    if (res.data.status === "success") {
      return {
        results: res.data.results,
        patients: res.data.data.patients,
      };
    }
  } catch (err) {
    console.error(err);
  }
};

export const newInvoice = async (
  patientId,
  cashed,
  amount,
  text,
  issueDateTime,
  pagamentoTracciabile,
  d = false
) => {
  // Send POST request to server
  const data = {
    paziente: patientId,
    valore: amount,
    testo: text,
    dataEmissione: issueDateTime,
    incassata: cashed,
    pagamentoTracciabile,
  };
  if (cashed) {
    data.dataIncasso = issueDateTime;
  }
  if (d) data.d = true;
  try {
    const res = await axios({
      method: "POST",
      url: invoicesUrl,
      withCredentials: true,
      data,
    });
    if (res.data.status === "success") {
      return {
        newInvoice: res.data.data.invoice,
      };
    }
  } catch (err) {
    console.error(err);
    return err;
  }
};
export const newPatient = async (
  nome,
  cognome,
  codiceFiscale,
  partitaIva,
  paeseResidenza,
  provinciaResidenza,
  capResidenza,
  viaResidenza,
  civicoResidenza,
  telefono,
  email,
  dataNascita,
  paeseNascita,
  provinciaNascita,
  capNascita,
  prezzo
) => {
  const data = {
    nome,
    cognome,
    codiceFiscale,
    partitaIva,
    indirizzoResidenza: {
      paese: paeseResidenza,
      provincia: provinciaResidenza,
      cap: capResidenza,
      via: viaResidenza,
      civico: civicoResidenza,
    },
    telefono,
    email,
    dataNascita,
    luogoNascita: {
      paese: paeseNascita,
      provincia: provinciaNascita,
      cap: capNascita,
    },
    prezzo,
  };
  try {
    const res = await axios({
      method: "POST",
      url: patientsUrl,
      withCredentials: true,
      data,
    });
    if (res.data.status === "success") {
      return {
        newPatient: res.data.data.patient,
      };
    }
  } catch (err) {
    console.error(err);
  }
};
export const updateInvoice = async (invoiceId, newValues) => {
  const data = {};
  // Sanitize data
  if (
    newValues?.valore &&
    !isNaN(Number.parseFloat(newValues.valore)) &&
    Number.parseFloat(newValues.valore) >= 0
  )
    data.valore = Number.parseFloat(newValues.valore);

  if (newValues?.testo && newValues.testo !== "") data.testo = newValues.testo;

  if (newValues?.dataEmissione && !isNaN(Date.parse(newValues.dataEmissione)))
    data.dataEmissione = new Date(newValues.dataEmissione);

  if (
    newValues?.dataIncasso &&
    !isNaN(Date.parse(newValues.dataIncasso)) &&
    newValues?.cashed == true
  )
    data.dataIncasso = new Date(newValues.dataIncasso);

  if (newValues?.cashed == false) {
    data.dataIncasso = undefined;
  }
  if (newValues?.pagamentoTracciabile !== undefined) {
    data.pagamentoTracciabile = newValues.pagamentoTracciabile;
  }
  data.incassata = newValues.cashed;

  // Send PATCH request to server
  try {
    const res = await axios({
      method: "PATCH",
      url: `${invoicesUrl}${invoiceId}`,
      withCredentials: true,
      data,
    });
    if (res.data.status === "success") {
      return {
        updatedInvoice: res.data.data.updatedInvoice,
      };
    }
  } catch (err) {
    console.error(err);
  }
};
export const updatePatient = async (patientId, newValues) => {
  const data = {};
  // Sanitize data
  if (newValues?.nome === "" || newValues?.cognome === "")
    throw new Error("Must provide a non empty name or surname");
  else {
    data.nome = newValues.nome;
    data.cognome = newValues.cognome;
  }
  if (newValues?.codiceFiscale) data.codiceFiscale = newValues.codiceFiscale;
  if (newValues?.partitaIva) data.partitaIva = newValues.partitaIva;
  if (newValues?.indirizzoResidenza) {
    data.indirizzoResidenza = {};
    if (newValues.indirizzoResidenza?.paese !== undefined)
      data.indirizzoResidenza.paese = newValues.indirizzoResidenza.paese;
    if (newValues.indirizzoResidenza?.provincia !== undefined)
      data.indirizzoResidenza.provincia =
        newValues.indirizzoResidenza.provincia;
    if (newValues.indirizzoResidenza?.cap !== undefined)
      data.indirizzoResidenza.cap = newValues.indirizzoResidenza.cap;
    if (newValues.indirizzoResidenza?.via !== undefined)
      data.indirizzoResidenza.via = newValues.indirizzoResidenza.via;
    if (newValues.indirizzoResidenza?.civico !== undefined)
      data.indirizzoResidenza.civico = newValues.indirizzoResidenza.civico;
  }
  if (newValues?.telefono !== undefined) data.telefono = newValues.telefono;
  if (newValues?.email !== undefined) data.email = newValues.email;
  if (newValues?.dataNascita !== undefined)
    data.dataNascita = new Date(newValues.dataNascita);
  if (newValues?.luogoNascita) {
    data.luogoNascita = {};
    if (newValues.luogoNascita?.paese !== undefined)
      data.luogoNascita.paese = newValues.luogoNascita.paese;
    if (newValues.luogoNascita?.provincia !== undefined)
      data.luogoNascita.provincia = newValues.luogoNascita.provincia;
    if (newValues.luogoNascita?.cap !== undefined)
      data.luogoNascita.cap = newValues.luogoNascita.cap;
  }
  if (newValues?.prezzo !== undefined) data.prezzo = newValues.prezzo;

  // Send PATCH request to server
  try {
    const res = await axios({
      method: "PATCH",
      url: `${patientsUrl}${patientId}`,
      withCredentials: true,
      data,
    });
    if (res.data.status === "success") {
      return {
        updatedPatient: res.data.data.updatedPatient,
      };
    }
  } catch (err) {
    console.error(err);
  }
};

export const deleteInvoice = async (invoiceId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `${invoicesUrl}${invoiceId}`,
      withCredentials: true,
    });

    if (res.status == 204) {
      return true;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};
export const deletePatient = async (patientId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `${patientsUrl}${patientId}`,
      withCredentials: true,
    });
    if (res.status == 204) {
      return true;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};
