import useSWR from "swr";
import axios from "axios";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

function useInvoice(id) {
  //const { data, error, isLoading } = useSWR(`/api/invoices/${id}`, fetcher);
  const { invoices, isLoading, isError } = useInvoices();
  const invoice = invoices?.find((i) => String(i._id) === String(id));
  return {
    invoice,
    isLoading,
    isError,
  };
}

function usePatient(id) {
  const { patients, isError, isLoading } = usePatients();
  const patient = patients?.find((p) => String(p._id) === String(id));
  return {
    patient,
    isLoading,
    isError,
  };
}

function useInvoices() {
  const { data, error, isLoading } = useSWR(`/api/invoices`, fetcher);
  return {
    invoices: data?.data?.invoices,
    isLoading,
    isError: error,
  };
}

function usePatients() {
  const { data, error, isLoading } = useSWR(`/api/patients/`, fetcher);
  return {
    patients: data?.data?.patients,
    isLoading,
    isError: error,
  };
}

export { useInvoice, usePatient, useInvoices, usePatients };
