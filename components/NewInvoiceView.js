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

import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
// import { DateTime } from "@date-io/luxon";

// TODO: insert date picker for dataEmissione
// TODO: send POST request
// TODO: manage response errors

export default function NewInvoiceView({ patients }) {
  // --- COMPONENT STATE --- //
  const [invoiceValueTextField, setInvoiceValueTextField] = React.useState(0);
  const [selectedPatientId, setSelectedPatientId] = React.useState("");
  const [valueError, setValueError] = React.useState(false);
  const [autocompleteError, setAutocompleteError] = React.useState(false);

  // HANDLER for Form submit event
  async function submit(event) {
    event.preventDefault();

    if (selectedPatientId === "") return setAutocompleteError(true);
    else setAutocompleteError(false);

    const data = new FormData(event.currentTarget);
    const valore = data.get("value");
    const testo = data.get("text").trim();
    const cashed = data.get("cashed");

    console.log(`Paziente: ${selectedPatientId} ${typeof selectedPatientId}
    valore: ${valore} ${typeof valore}
    testo: ${testo} ${typeof testo} (Len: ${testo.length})
    cashed: ${cashed} ${typeof cashed}`);
  }

  // HANDLER for Autocomplete change event
  function handlePatientSelectionChange(_event, autocompleteVal) {
    const patientPrice = autocompleteVal?.price || 0;
    const patientId = autocompleteVal?._id || "";
    // setAutomaticInvoiceValue(true);
    // setDefaultInvoiceValue(newValue);
    setSelectedPatientId(patientId);
    setInvoiceValueTextField(patientPrice);
    validateValue(patientPrice);
  }

  // HANDLER for invoice value TextField change event
  function handleInvoiceValue(event) {
    setInvoiceValueTextField(event.target.value);
    validateValue(event.target.value);
  }

  // VALIDATOR for invoice amount TextField
  function validateValue(valueToCheck) {
    setValueError(isNaN(valueToCheck));
  }

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
          <Autocomplete
            id="patient-id"
            name="patient-id"
            isOptionEqualToValue={(option, value) => option._id === value._id}
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
              <TextField
                variant="standard"
                label="Paziente"
                name="pat-id"
                error={autocompleteError}
                helperText={autocompleteError ? "Seleziona un paziente" : null}
                {...params}
              />
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
            onChange={handleInvoiceValue}
            // onFocus={() => {
            //   setAutomaticInvoiceValue(false);
            // }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">€</InputAdornment>
              ),
            }}
            sx={{ mt: 3 }}
            // value={automaticInvoiceValue ? defaultInvoiceValue : undefined}
            value={invoiceValueTextField}
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
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
          ></LocalizationProvider>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 3 }}>
            Inserisci
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
