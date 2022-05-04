import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import React from "react";
import Dashboard from "../components/Dashboard";
import SignIn from "../components/SignIn";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function LoginPage() {
  const loginUrl = "http://localhost:3000/api/v1/users/login";
  const [loading, isLoading] = React.useState(true);
  return (
    <div>
      <Head>
        <title>Login - il Salice</title>
        <meta
          name="description"
          content="Web application to manage patients and invoices."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignIn loginUrl={loginUrl} />
    </div>
  );
}
