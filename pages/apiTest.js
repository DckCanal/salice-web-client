import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import * as React from "react";
import axios from "axios";

const url = "/api/users/login";
const data = {
  email: "",
  password: "",
};

export default function ApiTest() {
  const [res, setRes] = React.useState(undefined);
  const sendReq = async () => {
    try {
      const res = await axios({
        method: "POST",
        url,
        withCredentials: true,
        data,
      });
      setRes(res);
    } catch (err) {
      setRes({status: 'error', error: err});
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
        fontFamily: 'roboto'
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
          fontFamily: 'roboto'
        }}
        onClick={() => sendReq()}
      >
        Send API req
      </button>
      <div
        style={{
          width: "500px",
          height: "300px",
          marginTop: "20px",
          backgroundColor: res?.status === "error" ? "#ffeeee" : "#eeffee",
          borderRadius: 0,
          mt: 4,
        }}
      >
        {/* <p>{res && `${res.data.nome} ${res.data.cognome}`}</p> */}
        <p>{res && JSON.stringify(res)}</p>
      </div>
    </div>
  );
}
