import axios from "axios";

const baseUrl = "http://localhost:3000/";
const apiUrl = `${baseUrl}api/v1/`;
const usersUrl = `${apiUrl}users/`;
const invoicesUrl = `${apiUrl}invoices/`;
const patientsUrl = `${apiUrl}patients/`;

export const getAllInvoices = async () => {
  try {
    console.log("sending request...");
    const res = await axios({
      method: "GET",
      url: invoicesUrl,
      withCredentials: true,
    });
    console.log(`response: ${res}`);
    if (res.data.status === "success") {
      console.log(`SUCCESS!!
        ${res}`);
      return {
        results: res.data.results,
        invoices: res.data.data,
      };
    }
    // else {
    //   return new Error(res.data.message);
    // }
  } catch (err) {
    console.error(err);
  }
};
