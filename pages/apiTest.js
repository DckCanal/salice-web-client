import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import * as React from "react";
import axios from "axios";
import Link from "next/link";

const url = "/api/users/login";

export default function ApiTest() {
  const [res, setRes] = React.useState(undefined);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const sendReq = async () => {
    try {
      const res = await axios({
        method: "POST",
        url,
        withCredentials: true,
        data: {
          email,
          password,
        },
      });
      setRes(res);
    } catch (err) {
      setRes({ status: "error", error: err });
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "500px",
        marginTop: 30,
        marginRight: "auto",
        marginLeft: "auto",
        fontFamily: "roboto",
      }}
    >
      <button
        style={{
          backgroundColor: "#88cc88",
          border: "1px solid #44cc44",
          borderRadius: 0,
          ":hover": {
            backgroundColor: "#66eeee",
          },
          fontFamily: "roboto",
        }}
        onClick={() => sendReq()}
      >
        Send LOGIN req
      </button>
      <input
        type="text"
        name="username"
        onChange={(ev) => {
          setEmail(ev.target.value);
        }}
      />
      <input
        type="password"
        name="pwd"
        onChange={(ev) => {
          setPassword(ev.target.value);
        }}
      />
      <div
        style={{
          width: "500px",
          // height: "300px",
          marginTop: "20px",
          backgroundColor: res?.status === "error" ? "#ffeeee" : "#eeffee",
          borderRadius: 0,
          mt: 4,
        }}
      >
        {/* <p>{res && `${res.data.nome} ${res.data.cognome}`}</p> */}
        <p>
          {res &&
            res?.status !== "error" &&
            `Welcome ${res.data.data.user.fullName}\n${JSON.stringify(res)}`}
        </p>
      </div>
      <Link href="tests/invoiceTest">Test invoices</Link>
      <Link href="tests/patientTest">Test patients</Link>
    </div>
  );
}
