import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import React from "react";
import Dashboard from "../components/Dashboard";
import SignIn from "../components/SignIn";

import { getAllInvoices, getAllPatients } from "../lib/controller";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// --- LOADING AS STATIC PROPS, NEED TO BE CHANGED ---
// import { patients } from "../lib/data/patients";

// export const getStaticProps = async () => {
//   return {
//     props: {
//       patients,
//     },
//   };
// };

export default function DashboardPage() {
  const [invoicesLoaded, setInvoicesLoaded] = React.useState(false);
  const [patientsLoaded, setPatientsLoaded] = React.useState(false);
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
      //invoices.splice(invoices.indexOf(inv),1);
      setInvoices([...invoices.filter((i) => i._id !== inv._id)]);
    },
  };

  if (!invoicesLoaded) {
    getAllInvoices()
      .then((res) => {
        setInvoices(res.invoices);
      })
      .finally(() => setInvoicesLoaded(true))
      .catch((err) => {
        // TODO: manage err!
        setInvoices(invoices);
        console.error(err);
      });
  }
  if (!patientsLoaded) {
    getAllPatients()
      .then((res) => {
        setPatients(res.patients);
      })
      .finally(() => setPatientsLoaded(true))
      .catch((err) => {
        // TODO: manage err!
        setPatients(patients);
        console.error(err);
      });
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
