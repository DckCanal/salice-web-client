import axios from "axios";

const baseUrl = "http://localhost:3000/";
const apiUrl = `${baseUrl}api/v1/`;
const invoicesUrl = `${apiUrl}invoices/`;
const patientsUrl = `${apiUrl}patients/`;

export const getAllInvoices = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: invoicesUrl,
      withCredentials: true,
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
  issueDateTime
) => {
  // Send POST request to server
  const data = {
    paziente: patientId,
    valore: amount,
    testo: text,
    dataEmissione: issueDateTime,
  };
  if (cashed) {
    data.dataIncasso = issueDateTime;
  }
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
export const updateInvoice = async () => {
  // Sanitize data
  // Send PATCH request to server
  // Await response, then substitute returned invoice in invoice array
};
export const updatePatient = async () => {};

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
