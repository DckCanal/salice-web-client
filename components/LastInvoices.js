import * as React from "react";
import Title from "./Title";
import Chip from "@mui/material/Chip";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { italianShortDate } from "../lib/dateUtils";

export default function LastInvoices({
  invoices,
  patients,
  openPatientDetail,
}) {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  // GET patients already ordered by server? This is only a slice()
  const lastPatients = patients
    .sort((p1, p2) => {
      return Date.parse(p1.ultimaModifica) > Date.parse(p2.ultimaModifica)
        ? -1
        : 1;
    })
    .slice(0, 21);

  // GET invoices already ordered by server? This is only a filter()
  const lastInvoices = invoices
    .filter((i) => Date.parse(i.dataEmissione) > Date.parse(oneYearAgo))
    .sort((i1, i2) =>
      Date.parse(i1.dataEmissione) > Date.parse(i2.dataEmissione) ? -1 : 1
    );
  const rows = lastPatients.map((p, i) => {
    let lastInvoiceFound = undefined;
    lastInvoices.forEach((i) => {
      if (i.paziente === p._id) {
        if (!lastInvoiceFound) lastInvoiceFound = Number.parseFloat(i.valore);
      }
    });
    return {
      id: i,
      value: `${lastInvoiceFound || 0}€ (${p.fatturatoUltimoAnno || 0}€)`,
      p,
      name: `${p.cognome.toUpperCase()} ${p.nome}`,
    };
  });
  const columns = [
    {
      field: "name",
      headerName: "Paziente",
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            openPatientDetail(params.row.p._id);
          }}
        >
          {`${params.row.p.cognome} ${params.row.p.nome}`}
        </Button>
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
    <React.Fragment>
      <Title>Ultime fatture</Title>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight={true}
        density="compact"
        disableExtendRowFullWidth={false}
        disableSelectionOnClick={true}
        hideFooter={true}
        // onRowClick={(params) => {
        //   openPatientDetail(params.row.p._id);
        // }}
      />
    </React.Fragment>
  );
}
