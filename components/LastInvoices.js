import * as React from "react";
import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Chip from "@mui/material/Chip";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";

import Title from "./Title";
import ErrorBox from "./ErrorBox";
import { italianShortDate } from "../lib/dateUtils";
import { useInvoices, usePatients } from "../lib/hooks";

export default function LastInvoices() {
  const router = useRouter();
  const {
    invoices,
    isLoading: isLoadingInvoices,
    error: invoicesError,
  } = useInvoices();
  const {
    patients,
    isLoading: isLoadingPatients,
    error: patientsError,
  } = usePatients();

  if (patientsError)
    return (
      <ErrorBox
        title="Errore nel caricamento del paziente"
        text={patientsError}
      />
    );

  if (invoicesError)
    return (
      <ErrorBox
        title="Errore nel caricamento delle fatture"
        text={invoicesError}
      />
    );

  if (
    invoices === undefined ||
    patients === undefined ||
    isLoadingPatients ||
    isLoadingInvoices
  )
    return (
      <>
        <Title>Ultime fatture</Title>
        <CircularProgress sx={{ mx: "auto", my: 10 }} />
      </>
    );

  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const lastInvoices = invoices
    .filter((i) => Date.parse(i.dataEmissione) > Date.parse(oneYearAgo))
    .sort((i1, i2) =>
      Date.parse(i1.dataEmissione) > Date.parse(i2.dataEmissione) ? -1 : 1
    );

  const fatturatoUltimoAnno = {};
  patients.forEach((p) => {
    fatturatoUltimoAnno[p._id] = 0;
  });
  lastInvoices.forEach((i) => {
    fatturatoUltimoAnno[i.paziente] += Number.parseFloat(i.valore);
  });

  const rows = patients.slice(0, 21).map((p, i) => {
    let lastInvoiceFound = undefined;
    lastInvoices.forEach((i) => {
      if (i.paziente === p._id) {
        if (!lastInvoiceFound) lastInvoiceFound = Number.parseFloat(i.valore);
      }
    });
    return {
      id: i,
      value: `${lastInvoiceFound || 0}€ (${fatturatoUltimoAnno[p._id]}€)`,
      p,
      name: `${p.cognome.toUpperCase()} ${p.nome}`,
    };
  });

  const columns = [
    {
      field: "name",
      headerName: "Paziente",
      renderCell: (params) => (
        <Link href={`/patients/${params.row.p._id}`} passHref>
          <Button variant="text" size="small">
            {`${params.row.p.cognome} ${params.row.p.nome}`}
          </Button>
        </Link>
      ),
      flex: 1,
    },
    {
      field: "date",
      headerName: "Data",
      flex: 1,
      renderCell: (params) =>
        italianShortDate(new Date(params.row.p.ultimaModifica)),
      sortComparator: (a, b) => (Date.parse(a) > Date.parse(b) ? -1 : 1),
    },
    {
      field: "email",
      headerName: "email",
      flex: 1.5,
      sortable: false,
      renderCell: (params) =>
        params.row.p.email && (
          <Chip
            component="a"
            variant="filled"
            label={`${params.row.p.email}`}
            href={`mailto:${params.row.p.email}`}
            clickable
            onClick={(ev) => {
              ev.stopPropagation();
            }}
          />
        ),
    },
    {
      field: "value",
      headerName: "Valore (ultimi 12 mesi)",
      flex: 1,
      sortComparator: (a, b) =>
        Number.parseFloat(a.substring(a.indexOf("(") + 1, a.indexOf("€)"))) -
        Number.parseFloat(b.substring(b.indexOf("(") + 1, b.indexOf("€)"))),
    },
  ];
  return (
    <>
      <Title>Ultime fatture</Title>

      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight={true}
        density="compact"
        disableExtendRowFullWidth={false}
        disableSelectionOnClick={true}
        hideFooter={true}
        onRowClick={(params) => {
          router.push(`/patients/${params.row.p._id}`);
        }}
      />
    </>
  );
}
