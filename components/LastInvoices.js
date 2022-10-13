import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/system";

function preventDefault(event) {
  event.preventDefault();
}

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
      date: new Date(p.ultimaModifica).toLocaleString(),
      codFisc: p.codiceFiscale,
      value: `${lastInvoiceFound}€ (${amount}€)`,
    };
  });
  const columns = [
    {
      field: "name",
      headerName: "Paziente",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Data",
      flex: 1,
      //type: "date-time",
      sortComparator: (a, b) => (Date.parse(a) > Date.parse(b) ? -1 : 1),
    },
    {
      field: "codFisc",
      headerName: "Codice fiscale",
      flex: 1,
      sortable: false,
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
      {/* <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Codice fiscale</TableCell>
            <TableCell align="right">Valore (ultimi 12 mesi)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              hover
              onClick={() => {
                openPatientDetail(row.patientId);
              }}
            >
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.codFisc}</TableCell>
              <TableCell align="right">{`${row.value}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
      {/* <Box sx={{ height: "300px" }}> */}
      <Box>
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
      </Box>
    </React.Fragment>
  );
}
