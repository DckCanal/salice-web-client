import Head from "next/head";
import React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Layout from "../components/layout";
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

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function DashboardPage() {
  //const { user, error, isLoading } = useUser();
  const [appData, setAppData] = React.useState({
    invoices: undefined,
    patients: undefined,
    d: false,
  });
  const dataLoaded =
    appData.invoices == undefined || appData.patients == undefined
      ? false
      : true;

  const dataManager = {
    addInvoice: async (
      patientId,
      cashed,
      amount,
      text,
      issueDateTime,
      d = false
    ) => {
      const response = await newInvoice(
        patientId,
        cashed,
        amount,
        text,
        issueDateTime,
        d
      );
      if (response.newInvoice) {
        // OK, invoice created
        const updatedPatient = appData.patients.find(
          (p) => String(p._id) === String(response.newInvoice.paziente)
        );
        if (d === false) updatedPatient.ultimaModifica = new Date();
        if (!d) {
          updatedPatient.fatturatoUltimoAnno += Number.parseFloat(
            response.newInvoice.valore
          );
        } else {
          updatedPatient.dfatturatoUltimoAnno += Number.parseFloat(
            response.newInvoice.valore
          );
        }
        const invoices = [...appData.invoices, response.newInvoice].sort(
          (invA, invB) => sortDate(invA.dataEmissione, invB.dataEmissione)
        );
        setAppData({
          ...appData,
          invoices,
        });
        return response.newInvoice;
      } else {
        // ERROR, TODO: manage error response
        return response;
      }
    },
    addPatient: async (
      nome,
      cognome,
      codiceFiscale,
      partitaIva,
      paeseResidenza,
      provinciaResidenza,
      capResidenza,
      viaResidenza,
      civicoResidenza,
      telefono,
      email,
      dataNascita,
      paeseNascita,
      provinciaNascita,
      capNascita,
      prezzo
    ) => {
      const response = await newPatient(
        nome,
        cognome,
        codiceFiscale,
        partitaIva,
        paeseResidenza,
        provinciaResidenza,
        capResidenza,
        viaResidenza,
        civicoResidenza,
        telefono,
        email,
        dataNascita,
        paeseNascita,
        provinciaNascita,
        capNascita,
        prezzo
      );
      if (response.newPatient) {
        response.newPatient.fatturatoUltimoAnno = 0;
        response.newPatient.dfatturatoUltimoAnno = 0;
        response.newPatient.ultimaModifica = new Date();
        setAppData({
          ...appData,
          patients: [response.newPatient, ...appData.patients],
        });
        return response.newPatient;
      } else return response;
    },
    updateInvoice: async (invoiceId, newValues) => {
      const response = await updateInvoice(invoiceId, newValues);
      if (response.updatedInvoice) {
        if (!response.updatedInvoice.d) {
          setAppData({
            ...appData,
            invoices: [
              ...appData.invoices.filter(
                (i) => String(i._id) !== String(invoiceId)
              ),
              response.updatedInvoice,
            ].sort((invA, invB) =>
              sortDate(invA.dataEmissione, invB.dataEmissione)
            ),
          });
        } else {
          setAppData({
            ...appData,
            dinvoices: [
              ...appData.dinvoices.filter(
                (i) => String(i._id) !== String(invoiceId)
              ),
              response.updatedInvoice,
            ].sort((invA, invB) =>
              sortDate(invA.dataEmissione, invB.dataEmissione)
            ),
          });
        }
        return response.updatedInvoice;
      } else return response;
    },
    removeInvoice: async (inv) => {
      try {
        const res = await deleteInvoice(inv._id);
        if (res == true) {
          setAppData({
            ...appData,
            invoices: [
              ...appData.invoices.filter(
                (i) => String(i._id) !== String(inv._id)
              ),
            ],
          });

          return true;
        }
      } catch (err) {
        console.error(err);
      }
    },
    updatePatient: async (patientId, newValues) => {
      const response = await updatePatient(patientId, newValues);
      if (response.updatedPatient) {
        setAppData({
          ...appData,
          patients: [
            ...appData.patients.filter(
              (p) => String(p._id) !== String(patientId)
            ),
            response.updatedPatient,
          ].sort((invA, invB) =>
            sortDate(invA.ultimaModifica, invB.ultimaModifica)
          ),
        });
        return response.updatedPatient;
      } else return response;
    },
    removePatient: async (p) => {
      try {
        const res = await deletePatient(p._id);
        if (res == true) {
          setAppData({
            ...appData,
            patients: [
              ...appData.patients.filter(
                (pat) => String(pat._id) !== String(p._id)
              ),
            ],
          });
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    },
  };

  const loadData = async () => {
    try {
      const invResponse = await getAllInvoices(false);
      invResponse.invoices.forEach((i) => (i.d = false));
      // const inv = invResponse.invoices;
      const dinvResponse = await getAllInvoices(true);
      dinvResponse.invoices.forEach((i) => (i.d = true));
      const inv = [...invResponse.invoices, ...dinvResponse.invoices];
      const patResponse = await getAllPatients();
      const pat = patResponse.patients;

      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      const patientsWithAmount = pat.map((p) => {
        let amount = 0,
          damount = 0;
        inv
          .filter((i) => Date.parse(i.dataEmissione) > Date.parse(oneYearAgo))
          .forEach((i) => {
            if (i.paziente === p._id) {
              if (i.d == false) amount += Number.parseFloat(i.valore);
              else damount += Number.parseFloat(i.valore);
            }
          });
        return {
          ...p,
          fatturatoUltimoAnno: amount,
          dfatturatoUltimoAnno: damount,
        };
      });
      setAppData({
        ...appData,
        invoices: inv,
        patients: patientsWithAmount,
      });
    } catch (err) {
      console.error(err);
    }
  };
  if (!dataLoaded) {
    loadData();
  }

  const switchd = () => {
    setAppData({
      ...appData,
      d: !appData.d,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

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
            invoices={
              appData.d
                ? appData.invoices
                : appData.invoices.filter((i) => i.d != true)
            }
            patients={appData.patients}
            dataManager={dataManager}
            d={appData.d}
          ></Dashboard>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              m: 0,
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              height: "100vh",
              overflow: "auto",
            }}
          >
            <CircularProgress />
            <Typography component="h3" variant="h5" sx={{ mt: 3 }}>
              Caricamento pazienti e fatture in corso...
            </Typography>
          </Box>
        )}
      </div>
    </ThemeProvider>
  );
}

DashboardPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
