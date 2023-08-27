import useSWR from "swr";
import axios from "axios";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

function useUser() {
  const { data, error, isLoading } = useSWR("/api/users/me", fetcher);
  return {
    user: data?.user,
    error,
    isLoading,
  };
}

function useInvoice(id) {
  //const { data, error, isLoading } = useSWR(`/api/invoices/${id}`, fetcher);
  const { invoices, isLoading, isError, mutate } = useInvoices();
  const invoice = invoices?.find((i) => String(i._id) === String(id));
  return {
    invoice,
    isLoading,
    isError,
    mutate,
  };
}

function usePatient(id) {
  const { patients, isError, isLoading, mutate } = usePatients();
  const patient = patients?.find((p) => String(p._id) === String(id));
  return {
    patient,
    isLoading,
    isError,
    mutate,
  };
}

function useInvoices() {
  const { data, error, isLoading, mutate } = useSWR(`/api/invoices`, fetcher);
  return {
    invoices: data?.data?.invoices,
    isLoading,
    isError: error,
    mutate,
  };
}

function usePatients() {
  const { data, error, isLoading, mutate } = useSWR(`/api/patients/`, fetcher);
  return {
    patients: data?.data?.patients,
    isLoading,
    isError: error,
    mutate,
  };
}

export { useUser, useInvoice, usePatient, useInvoices, usePatients };
