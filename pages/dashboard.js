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
    d: false,
    dinvoices: undefined,
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
        updatedPatient.ultimaModifica = new Date();
        if (!d) {
          updatedPatient.fatturatoUltimoAnno += Number.parseFloat(
            response.newInvoice.valore
          );
          const invoices = [...appData.invoices, response.newInvoice].sort(
            (invA, invB) => sortDate(invA.dataEmissione, invB.dataEmissione)
          );
          setAppData({
            ...appData,
            invoices,
            patients,
          });
        } else {
          updatedPatient.dfatturatoUltimoAnno += Number.parseFloat(
            response.newInvoice.valore
          );
          const dinvoices = [...appData.dinvoices, response.newInvoice].sort(
            (invA, invB) => sortDate(invA.dataEmissione, invB.dataEmissione)
          );
          setAppData({
            ...appData,
            dinvoices,
            patients,
          });
        }

        // setAppData({
        //   ...appData,
        //   invoices: [...appData.invoices, response.newInvoice].sort(
        //     (invA, invB) => sortDate(invA.dataEmissione, invB.dataEmissione)
        //   ),
        //   patients: appData.patients.map((p) => {
        //     if (String(p._id) === String(response.newInvoice.paziente)) {
        //       return {
        //         ...p,
        //         fatturatoUltimoAnno:
        //           p.fatturatoUltimoAnno +
        //           Number.parseFloat(response.newInvoice.valore),
        //         ultimaModifica: new Date(),
        //       };
        //     } else return p;
        //   }),
        // });
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
          if (!inv.d) {
            setAppData({
              ...appData,
              invoices: [
                ...appData.invoices.filter(
                  (i) => String(i._id) !== String(inv._id)
                ),
              ],
            });
          } else {
            setAppData({
              ...appData,
              dinvoices: [
                ...appData.dinvoices.filter(
                  (i) => String(i._id) !== String(inv._id)
                ),
              ],
            });
          }
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
      const inv = invResponse.invoices;
      const dinvResponse = await getAllInvoices(true);
      const dinv = dinvResponse.invoices;
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
        let damount = amount;
        dinv
          .filter((i) => Date.parse(i.dataEmissione) > Date.parse(oneYearAgo))
          .forEach((i) => {
            if (i.paziente === p._id) {
              damount += Number.parseFloat(i.valore);
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
        dinvoices: dinv,
      });
    } catch (err) {
      console.error(err);
    }
  };
  if (!dataLoaded) {
    loadData();
  }

  const getdPatients = () => {
    return appData.patients.map((p) => ({
      _id: p._id,
      id: p.id,
      fatturatoUltimoAnno: p.dfatturatoUltimoAnno,
      nome: p.nome,
      cognome: p.cognome,
      partitaIva: p.partitaIva,
      indirizzoResidenza: { ...p.indirizzoResidenza },
      telefono: p.telefono,
      email: p.email,
      dataNascita: p.dataNascita,
      luogoNascita: { ...p.luogoNascita },
      prezzo: p.prezzo,
      ultimaModifica: p.ultimaModifica,
    }));
  };

  const getPatients = () => {
    return appData.patients.map((p) => ({
      _id: p._id,
      id: p.id,
      fatturatoUltimoAnno: p.fatturatoUltimoAnno,
      nome: p.nome,
      cognome: p.cognome,
      partitaIva: p.partitaIva,
      indirizzoResidenza: { ...p.indirizzoResidenza },
      telefono: p.telefono,
      email: p.email,
      dataNascita: p.dataNascita,
      luogoNascita: { ...p.luogoNascita },
      prezzo: p.prezzo,
      ultimaModifica: p.ultimaModifica,
    }));
  };

  const switchd = () => {
    setAppData({
      ...appData,
      d: !appData.d,
    });
  };

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
          invoices={
            appData.d
              ? [...appData.invoices, ...appData.dinvoices].sort((invA, invB) =>
                  sortDate(invA.dataEmissione, invB.dataEmissione)
                )
              : appData.invoices
          }
          patients={appData.d ? getdPatients() : getPatients()}
          dataManager={dataManager}
          switchd={switchd}
          d={appData.d}
        ></Dashboard>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
