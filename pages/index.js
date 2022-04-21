import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import React from "react";
import Dashboard from "../components/Dashboard";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// --- LOADING AS STATIC PROPS, NEED TO BE CHANGED ---
import { invoices } from "../lib/data/invoicesSmall";
import { patients } from "../lib/data/patients";

export const getStaticProps = async () => {
  return {
    props: {
      invoices,
      patients,
    },
  };
};

// -----------------------------------------------------

export default function Home({ invoices, patients }) {
  const [loading, isLoading] = React.useState(true);
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
      <Dashboard invoices={invoices} patients={patients}></Dashboard>
    </div>
  );
}
