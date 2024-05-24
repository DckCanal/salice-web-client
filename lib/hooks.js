"use client";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";

import { DContext } from "../components/DContext";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

function useUser() {
  const { data, error, isLoading, mutate } = useSWR("/api/users/me", fetcher);
  const loggedOut = error && error.response.status === 401;
  return {
    user: data?.user,
    error,
    isLoading,
    mutate,
    loggedOut,
  };
}

function useInvoice(id) {
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
  if (id === undefined) return { undefined, undefined, undefined, undefined };
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
  const d = useContext(DContext);
  const { data, error, isLoading, mutate } = useSWR(`/api/invoices`, (url) =>
    axios
      .get(url, {
        withCredentials: true,
        params: { sort: "-dataEmissione" },
      })
      .then((res) => res.data)
  );
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (window.localStorage) {
      if (!data && window.localStorage.getItem("invoices")) {
        setInvoices(JSON.parse(window.localStorage.getItem("invoices")));
      } else if (data?.data?.invoices) {
        setInvoices(data.data.invoices);
        localStorage.setItem("invoices", JSON.stringify(data.data.invoices));
      }
    } else if (data?.data?.invoices) {
      // Se per qualche motivo window.localStorage non fosse disponibile
      setInvoices(data.data.invoices);
    }
  }, [data]);

  return {
    invoices: d ? invoices : invoices.filter((i) => !i.d),
    isLoading,
    error,
    mutate,
  };
}

function usePatients() {
  const { data, error, isLoading, mutate } = useSWR(`/api/patients`, fetcher);
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    if (window.localStorage) {
      if (!data && window.localStorage.getItem("patients")) {
        setPatients(JSON.parse(window.localStorage.getItem("patients")));
      } else if (data?.data?.patients) {
        setPatients(data.data.patients);
        localStorage.setItem("patients", JSON.stringify(data.data.patients));
      }
    } else if (data?.data?.patients) {
      setPatients(data.data.patients);
    }
  }, [data]);

  return {
    patients,
    isLoading,
    error,
    mutate,
  };
}

export { useUser, useInvoice, usePatient, useInvoices, usePatients };
