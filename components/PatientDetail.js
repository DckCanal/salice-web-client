import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
export default function PatientDetail({ patient, invoices }) {
  // invoices: is a subset of appData.invoices, containing only patient's ones.
  return (
    <Paper sx={{ m: 2 }}>
      <p>
        {/* Nome: {patient.nome} {patient.cognome} */}
        Patient detail: {JSON.stringify(patient)}
        {/* {invoices} */}
      </p>
      <Box>
        {invoices.map((i) => (
          <Typography key={i._id}>
            `${i.paziente} == ${patient._id}`
          </Typography>
        ))}
      </Box>
    </Paper>
  );
}
