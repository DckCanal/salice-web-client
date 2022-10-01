import Head from "next/head";
import React from "react";
import Dashboard from "../components/Dashboard";
import SignIn from "../components/SignIn";

import { getAllInvoices, getAllPatients } from "../lib/controller";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function DashboardPage() {
  const [invoicesLoaded, setInvoicesLoaded] = React.useState(false);
  const [invoicesLoading, setInvoicesLoading] = React.useState(false);
  const [patientsLoaded, setPatientsLoaded] = React.useState(false);
  const [patientsLoading, setPatientsLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [invoices, setInvoices] = React.useState(undefined);
  const [patients, setPatients] = React.useState(undefined);

  const dataManager = {
    addInvoice: (newInv) => {
      setInvoices([...invoices, newInv]);
    },
    addPatient: (newPat) => {
      setPatients([...patients, newPat]);
    },
    removeInvoice: (inv) => {
      setInvoices([
        ...invoices.filter((i) => String(i._id) !== String(inv._id)),
      ]);
    },
  };
  // FIXME: too many re-render
  const loadData = async () => {
    try {
      setLoading(true);
      const invResponse = await getAllInvoices();
      console.log(invResponse);
      const inv = invResponse.invoices;
      setInvoices(inv);
      setInvoicesLoaded(true);
      const patResponse = await getAllPatients();
      const pat = patResponse.patients;

      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      const patientsWithAmount = pat.map((p) => {
        let amount = 0;
        invoices
          .filter((i) => Date.parse(i.dataEmissione) > Date.parse(oneYearAgo))
          .forEach((i) => {
            if (i.paziente === p._id) {
              amount += Number.parseFloat(i.valore);
            }
          });
        return {
          ...p,
          fatturatoUltimoAnno: amount,
        };
      });
      setPatients(patientsWithAmount);
      setPatientsLoaded(true);
      console.log(patientsWithAmount);
    } catch (err) {
      console.error(err);
    }
  };
  if (!patientsLoaded || !invoicesLoaded) {
    loadData();
  }

  return (
    <div>
      <Head>
        <title>il Salice - WebApp</title>
        <meta
          name="description"
          content="Web application to manage patients and invoices."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {invoicesLoaded && patientsLoaded ? (
        <Dashboard
          invoices={invoices}
          patients={patients}
          dataManager={dataManager}
        ></Dashboard>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
