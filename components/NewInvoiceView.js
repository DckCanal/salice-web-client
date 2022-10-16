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
import { DateTimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
// import { newInvoice } from "../lib/controller";

// TODO: manage response errors

export default function NewInvoiceView({
  patients,
  addInvoice,
  selectedPatient,
}) {
  // --- COMPONENT STATE --- //
  const initialPatient = selectedPatient
    ? patients.find((p) => String(p._id) === String(selectedPatient))
    : undefined;
  const [selectedPatientId, setSelectedPatientId] = React.useState(
    selectedPatient ? selectedPatient : ""
  );
  const [invoiceAmountTextField, setInvoiceAmountTextField] = React.useState(
    initialPatient ? initialPatient.prezzo : 0
  );
  const [issueDateTime, setIssueDateTime] = React.useState(DateTime.now());
  const [invoiceAmountError, setInvoiceAmountError] = React.useState(false);
  const [autocompleteError, setAutocompleteError] = React.useState(false);
  const autocompleteDefaultValue = initialPatient
    ? {
        label: `${initialPatient.cognome} ${initialPatient.nome}`,
        _id: initialPatient._id,
        price: initialPatient.prezzo,
      }
    : undefined;

  // HANDLER for Form submit event
  async function submit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    const data = new FormData(event.currentTarget);
    const invoiceText = data.get("text").trim();
    const cashed = data.get("cashed") === "on" ? true : false;

    const newInvoice = await addInvoice(
      selectedPatientId,
      cashed,
      Number(invoiceAmountTextField),
      invoiceText,
      issueDateTime
    );
    // addInvoice(response.newInvoice);
  }

  // HANDLER for Autocomplete change event
  function handlePatientSelectionChange(_event, autocompleteVal) {
    const patientPrice = autocompleteVal?.price || 0;
    const patientId = autocompleteVal?._id || "";

    setSelectedPatientId(patientId);
    setAutocompleteError(patientId === "");
    setInvoiceAmountTextField(patientPrice);
    validateInvoiceValue(patientPrice);
  }

  // HANDLER for invoice value TextField change event
  function handleInvoiceValue(event) {
    setInvoiceAmountTextField(event.target.value);
    validateInvoiceValue(event.target.value);
  }

  // VALIDATOR for invoice amount TextField
  function validateInvoiceValue(valueToCheck) {
    setInvoiceAmountError(isNaN(valueToCheck) || Number(valueToCheck) < 0);
  }

  // VALIDATOR for STATE values
  function validateForm() {
    return (
      selectedPatientId !== "" &&
      !isNaN(invoiceAmountTextField) &&
      Number(invoiceAmountTextField) >= 0 &&
      issueDateTime.isValid
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
            value={
              autocompleteDefaultValue ? autocompleteDefaultValue : undefined
            }
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
            error={invoiceAmountError}
            onChange={handleInvoiceValue}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">€</InputAdornment>
              ),
            }}
            sx={{ mt: 3 }}
            value={invoiceAmountTextField}
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
            <DateTimePicker
              label="Data emissione"
              onChange={(newValue) => {
                setIssueDateTime(newValue);
              }}
              value={issueDateTime}
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
