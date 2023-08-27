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
  const { invoices, isLoading, error, mutate } = useInvoices();
  const invoice = invoices?.find((i) => String(i._id) === String(id));
  if (!isLoading && !error && invoice === undefined)
    return {
      invoice,
      isLoading,
      error: `Fattura con id ${id} non trovata`,
      mutate,
    };

  return {
    invoice,
    isLoading,
    error,
    mutate,
  };
}

function usePatient(id) {
  const { patients, error, isLoading, mutate } = usePatients();
  const patient = patients?.find((p) => String(p._id) === String(id));
  if (!isLoading && !error && patient === undefined)
    return {
      patient,
      isLoading,
      error: `Paziente con id ${id} non trovato`,
      mutate,
    };
  return {
    patient,
    isLoading,
    error,
    mutate,
  };
}

function useInvoices() {
  const { data, error, isLoading, mutate } = useSWR(`/api/invoices`, fetcher);
  return {
    invoices: data?.data?.invoices,
    isLoading,
    error,
    mutate,
  };
}

function usePatients() {
  const { data, error, isLoading, mutate } = useSWR(`/api/patients/`, fetcher);
  return {
    patients: data?.data?.patients,
    isLoading,
    error,
    mutate,
  };
}

export { useUser, useInvoice, usePatient, useInvoices, usePatients };
