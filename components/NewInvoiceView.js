import { Box } from "@mui/material";
import { Paper, Typography } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material";

export default function NewInvoiceView({ patients }) {
  function submit() {}
  const [defaultInvoiceValue, setDefaultInvoiceValue] =
    React.useState(undefined);
  return (
    <Paper sx={{ p: 3, mt: 12 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Nuova fattura
        </Typography>
        <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }}>
          {
            // Autocomplete per scelta paziente, con aggiornamento prezzo
            // DatePicker per data emissione (default oggi)
            // CheckBox per incasso immediato (default checked)
            // TextField con validator per ammontare (default in base a pz)
            // TextField per testo, default "Trattamento massoterapico"
          }
          <Autocomplete
            id="patient-id"
            options={patients.map((p) => ({
              label: `${p.cognome} ${p.nome}`,
              _id: p._id,
            }))}
          />
        </Box>
      </Box>
    </Paper>
  );
}
