import Head from "next/head";
import React from "react";
import SignIn from "../components/SignIn";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function LoginPage() {
  const loginUrl = "http://localhost:3000/api/v1/users/login";
  const localLoginUrl = "/api/users/login";

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
      <SignIn loginUrl={localLoginUrl} />
    </div>
  );
}
