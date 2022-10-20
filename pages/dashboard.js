import Head from "next/head";
import React from "react";
import Dashboard from "../components/Dashboard";
import { sortDate } from "../lib/dateUtils";
import {
  newInvoice,
  newPatient,
  updateInvoice,
  updatePatient,
  deleteInvoice,
  deletePatient,
} from "../lib/controller";

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
    addInvoice: async (patientId, cashed, amount, text, issueDateTime) => {
      const response = await newInvoice(
        patientId,
        cashed,
        amount,
        text,
        issueDateTime
      );
      if (response.newInvoice) {
        // OK, invoice created
        const updatedPatient = appData.patients.find(
          (p) => String(p._id) === String(response.newInvoice.paziente)
        );
        updatedPatient.fatturatoUltimoAnno += Number.parseFloat(
          response.newInvoice.valore
        );
        updatePatient.ultimaModifica = new Date();
        setAppData({
          ...appData,
          invoices: [...appData.invoices, response.newInvoice].sort(
            (invA, invB) => sortDate(invA.dataEmissione, invB.dataEmissione)
          ),
          patients: appData.patients.map((p) => {
            if (String(p._id) === String(response.newInvoice.paziente)) {
              return {
                ...p,
                fatturatoUltimoAnno:
                  p.fatturatoUltimoAnno +
                  Number.parseFloat(response.newInvoice.valore),
                ultimaModifica: new Date(),
              };
            } else return p;
          }),
        });
        return response.newInvoice;
      } else {
        // ERROR, TODO: manage error response
        return response;
      }
    },
    addPatient: (newPat) => {
      setAppData({ ...appData, patients: [newPat, ...appData.patients] });
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
