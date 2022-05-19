import * as React from "react";
import {
  Autocomplete,
  TextField,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Button,
  Box,
  Paper,
  Typography,
} from "@mui/material";

export default function NewInvoiceView({ patients }) {
  async function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // paziente, valore, testo, dataEmissione, dataIncasso
    const paziente = data.get("patient-id");
    const valore = data.get("value");
    const testo = data.get("text");
    const cashed = data.get("cashed");
    console.log(`Paziente: ${paziente} ${typeof paziente}
    valore: ${valore} ${typeof valore}
    testo: ${testo} ${typeof testo}
    cashed: ${cashed} ${typeof cashed}`);
  }
  function handlePatientSelectionChange(_event, autocompleteVal) {
    const newValue = autocompleteVal?.price || 0;
    setDefaultInvoiceValue(newValue);
  }
  function validateValue(event) {
    const valueToCheck = event.target.value;
    setValueError(isNaN(valueToCheck));
  }
  const [defaultInvoiceValue, setDefaultInvoiceValue] = React.useState(0);
  const [valueError, setValueError] = React.useState(false);
  return (
    <Paper sx={{ p: 3, mt: 12, maxWidth: "800px", mr: "auto", ml: "auto" }}>
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
        <Box
          component="form"
          onSubmit={submit}
          noValidate
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
          }}
        >
          {
            // DatePicker per data emissione (default oggi)
            // TextField con validator per ammontare (default in base a pz)
          }
          <Autocomplete
            id="patient-id"
            name="patient-id"
            options={patients.map((p) => ({
              label: `${p.cognome} ${p.nome}`,
              _id: p._id,
              price: p.prezzo,
            }))}
            sx={{
              minWidth: 300,
              mt: 3,
            }}
            renderInput={(params) => (
              <TextField variant="standard" label="Paziente" {...params} />
            )}
            onChange={handlePatientSelectionChange}
          />
          <FormControlLabel
            control={<Checkbox defaultChecked id="cashed" name="cashed" />}
            label="Incassa ora"
            sx={{ mt: 3 }}
          />
          <TextField
            label="Valore"
            id="value"
            name="value"
            variant="standard"
            error={valueError}
            onChange={validateValue}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">€</InputAdornment>
              ),
            }}
            sx={{ mt: 3 }}
            defaultValue={defaultInvoiceValue}
          />
          <TextField
            label="Testo"
            id="text"
            name="text"
            variant="standard"
            defaultValue="Trattamento massoterapico"
            sx={{
              minWidth: 300,
              mt: 3,
            }}
          />
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 3 }}>
            Inserisci
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
