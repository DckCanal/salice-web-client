import React from "react";
import Head from "next/head";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Layout from "../components/layout";
import Home from "../components/Home";

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>il Salice - WebApp</title>
        <meta
          name="description"
          content="Web application to manage patients and invoices."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Home />
    </>
  );
}

DashboardPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
