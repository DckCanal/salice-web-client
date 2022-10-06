import Paper from "@mui/material/Paper";
export default function InvoiceDetail({ invoice, patient }) {
  return (
    <Paper sx={{ m: 2 }}>
      <p>
        Numero ordine: {invoice.numeroOrdine} del{" "}
        {new Date(invoice.dataEmissione).toLocaleDateString()}
      </p>
      <p>
        Intestatario: {patient.cognome} {patient.nome}
      </p>
    </Paper>
  );
}
