import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";

function preventDefault(event) {
  event.preventDefault();
}

export default function LastInvoices({ invoices, patients }) {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  const lastPatients = patients
    .sort((p1, p2) => {
      return Date.parse(p1.ultimaModifica) > Date.parse(p2.ultimaModifica)
        ? -1
        : 1;
    })
    .slice(0, 21);
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
      name: `${p.nome} ${p.cognome}`,
      date: new Date(p.ultimaModifica).toISOString(),
      codFisc: p.codiceFiscale,
      value: `${lastInvoiceFound}€ (${amount}€)`,
    };
  });
  return (
    <React.Fragment>
      <Title>Ultime fatture</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Codice fiscale</TableCell>
            <TableCell align="right">Valore (totale)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.codFisc}</TableCell>
              <TableCell align="right">{`${row.value}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
