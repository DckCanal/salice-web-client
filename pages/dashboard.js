import Head from "next/head";
import React from "react";
import Dashboard from "../components/Dashboard";

import { getAllInvoices, getAllPatients } from "../lib/controller";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function DashboardPage() {
  const [appData, setAppData] = React.useState({
    invoices: undefined,
    patients: undefined,
  });
  const dataLoaded =
    appData.invoices == undefined || appData.patients == undefined
      ? false
      : true;

  const dataManager = {
    addInvoice: (newInv) => {
      setAppData({ ...appData, invoices: [...appData.invoices, newInv] });
    },
    addPatient: (newPat) => {
      setAppData({ ...appData, patients: [...appData.patients, newPat] });
    },
    removeInvoice: (inv) => {
      setAppData({
        ...appData,
        invoices: [
          ...appData.invoices.filter((i) => String(i._id) !== String(inv._id)),
        ],
      });
    },
  };

  const loadData = async () => {
    try {
      const invResponse = await getAllInvoices();
      const inv = invResponse.invoices;
      const patResponse = await getAllPatients();
      const pat = patResponse.patients;

      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      const patientsWithAmount = pat.map((p) => {
        let amount = 0;
        inv
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
      setAppData({ ...appData, invoices: inv, patients: patientsWithAmount });
    } catch (err) {
      console.error(err);
    }
  };
  if (!dataLoaded) {
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
      {dataLoaded ? (
        <Dashboard
          invoices={appData.invoices}
          patients={appData.patients}
          dataManager={dataManager}
        ></Dashboard>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
