import * as React from "react";
import Title from "./Title";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { DataGrid } from "@mui/x-data-grid";
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
    let amount = 0;
    let lastInvoiceFound = undefined;
    lastInvoices.forEach((i) => {
      if (i.paziente === p._id) {
        amount += Number.parseFloat(i.valore);
        if (!lastInvoiceFound) lastInvoiceFound = Number.parseFloat(i.valore);
      }
    });
    return {
      id: i,
      patientId: p._id,
      name: `${p.cognome} ${p.nome}`,
      date: new Date(p.ultimaModifica),
      email: p.email,
      value: `${lastInvoiceFound}€ (${amount}€)`,
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
          onClick={() => openPatientDetail(params.row.patientId)}
        >
          {`${params.row.name}`}
        </Button>
      ),
      flex: 1,
    },
    {
      field: "date",
      headerName: "Data",
      flex: 1,
      renderCell: (params) => italianShortDate(params.row.date),
      sortComparator: (a, b) => (Date.parse(a) > Date.parse(b) ? -1 : 1),
    },
    {
      field: "email",
      headerName: "email",
      flex: 1.5,
      sortable: false,
      renderCell: (params) =>
        params.row.email && (
          <Chip
            component="a"
            variant="filled"
            label={`${params.row.email}`}
            href={`mailto:${params.row.email}`}
            clickable
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
        onRowClick={(params) => {
          openPatientDetail(params.row.patientId);
        }}
      />
    </React.Fragment>
  );
}
