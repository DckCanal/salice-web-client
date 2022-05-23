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
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";

// TODO: insert date picker for dataEmissione
// TODO: send POST request
// TODO: manage response errors

export default function NewInvoiceView({ patients }) {
  // --- COMPONENT STATE --- //
  const [selectedPatientId, setSelectedPatientId] = React.useState("");
  const [invoiceValueTextField, setInvoiceValueTextField] = React.useState(0);
  const [issueDate, setIssueDate] = React.useState(
    DateTime.now().setZone("Europe/Rome")
  );
  const [valueError, setValueError] = React.useState(false);
  const [autocompleteError, setAutocompleteError] = React.useState(false);

  // HANDLER for Form submit event
  async function submit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    const data = new FormData(event.currentTarget);
    const testo = data.get("text").trim();
    const cashed = data.get("cashed");

    // RUN ALL VALIDATORS
    // IF OK, SUBMIT
  }

  // HANDLER for Autocomplete change event
  function handlePatientSelectionChange(_event, autocompleteVal) {
    const patientPrice = autocompleteVal?.price || 0;
    const patientId = autocompleteVal?._id || "";

    setSelectedPatientId(patientId);
    setAutocompleteError(patientId === "");
    setInvoiceValueTextField(patientPrice);
    validateInvoiceValue(patientPrice);
  }

  // HANDLER for invoice value TextField change event
  function handleInvoiceValue(event) {
    setInvoiceValueTextField(event.target.value);
    validateInvoiceValue(event.target.value);
  }

  // VALIDATOR for invoice amount TextField
  function validateInvoiceValue(valueToCheck) {
    setValueError(isNaN(valueToCheck) || Number(valueToCheck) < 0);
  }

  // VALIDATOR for STATE values
  function validateForm() {
    return (
      selectedPatientId !== "" &&
      !isNaN(invoiceValueTextField) &&
      Number(invoiceValueTextField) >= 0 &&
      issueDate.isValid
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 12, maxWidth: "500px", mr: "auto", ml: "auto" }}>
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">€</InputAdornment>
              ),
            }}
            sx={{ mt: 3 }}
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
            dateAdapter={AdapterLuxon}
            adapterLocale={"eu-IT"}
          >
            <DatePicker
              label="Data emissione"
              onChange={(newValue) => {
                setIssueDate(newValue);
              }}
              value={issueDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ mt: 3 }}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </LocalizationProvider>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 3 }}>
            Inserisci
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
