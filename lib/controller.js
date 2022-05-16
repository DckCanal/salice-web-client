import axios from "axios";

const baseUrl = "http://localhost:3000/";
const apiUrl = `${baseUrl}api/v1/`;
const usersUrl = `${apiUrl}users/`;
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
