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
  // Sanitize data
  // Send POST request to server
  // Await response, then add returned invoice in invoice array, and re-order it
};
export const newPatient = async () => {};
export const updateInvoice = async () => {
  // Sanitize data
  // Send PATCH request to server
  // Await response, then substitute returned invoice in invoice array
};
export const updatePatient = async () => {};
export const deleteInvoice = async () => {};
export const deletePatient = async () => {};
