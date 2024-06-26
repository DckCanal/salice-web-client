'use client';
import * as React from "react";
import { useContext } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import {
  Autocomplete,
  TextField,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import StyledPaper from "./StyledPaper";

import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";

import { DContext } from "./DContext";
import { usePatient, usePatients } from "../lib/hooks";
import { newInvoice } from "../lib/controller";

// TODO: manage response errors

export default function NewInvoiceView() {
  const d = useContext(DContext);
  const router = useRouter();
  const selectedPatient = router.query?.id;
  const {
    patients,
    isLoading: isLoadingPatients,
    error: patientsError,
  } = usePatients();
  const {
    patient: initialPatient,
    isLoading: isLoadingPatient,
    error: patientError,
  } = usePatient(selectedPatient);

  const [selectedPatientId, setSelectedPatientId] = React.useState(
    selectedPatient ? selectedPatient : ""
  );
  const [invoiceAmountTextField, setInvoiceAmountTextField] = React.useState(
    initialPatient ? initialPatient.prezzo : 0
  );
  const [cashed, setCashed] = React.useState(true);
  const [pagamentoTracciabile, setPagamentoTracciabile] = React.useState(false);
  const [issueDateTime, setIssueDateTime] = React.useState(DateTime.now());
  const [invoiceAmountError, setInvoiceAmountError] = React.useState(false);
  const [autocompleteError, setAutocompleteError] = React.useState(
    selectedPatient === undefined
  );
  const [waiting, setWaiting] = React.useState(false);

  // HANDLER for Form submit event
  async function submit(event) {
    event.preventDefault();
    if (!validateForm()) {
      // should never happens, because if !validateForm(), submit button is disabled
      return;
    }

    setWaiting(true);

    const data = new FormData(event.currentTarget);
    const invoiceText = data.get("text").trim();
    //const cashed = data.get("cashed") === "on" ? true : false;
    const dark = data.get("dark") === "on" ? true : false;

    try {
      const { newInvoice: addedInvoice } = await mutate(
        "/api/invoices",
        newInvoice(
          selectedPatientId,
          cashed,
          Number(invoiceAmountTextField),
          invoiceText,
          new Date(issueDateTime),
          pagamentoTracciabile,
          dark
        ),
        {
          revalidate: false,
          populateCache: (addedInvoice, cacheData) => {
            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                invoices: [...cacheData.data.invoices, addedInvoice.newInvoice],
              },
            };
          },
        }
      );

      if (addedInvoice._id) {
        setWaiting(false);

        router.push(`/invoices/${addedInvoice._id}`);
      }
      // TODO: else show error message modal window, reset fields and enable submit
    } catch (err) {
      console.error(err);
    }
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
      !isNaN(Date.parse(new Date(issueDateTime)))
    );
  }
  const enableSubmit = validateForm();

  return (
    <StyledPaper
      sx={{ p: 3, mt: 12, maxWidth: "500px", mr: "auto", ml: "auto" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isLoadingPatient || isLoadingPatients ? (
          <>
            <Typography component="h1" variant="h5">
              Caricamento pazienti...
            </Typography>
            <CircularProgress sx={{ mx: "auto", mt: 5 }} />
          </>
        ) : (
          <>
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
              {initialPatient == undefined ? (
                <Autocomplete
                  id="patient-id"
                  name="patient-id"
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
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
                      helperText={
                        autocompleteError ? "Seleziona un paziente" : null
                      }
                      {...params}
                    />
                  )}
                  onChange={handlePatientSelectionChange}
                />
              ) : (
                <TextField
                  variant="standard"
                  disabled
                  defaultValue={`${initialPatient.cognome} ${initialPatient.nome}`}
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(_ev, value) => setCashed(value)}
                    checked={cashed}
                    id="cashed"
                    name="cashed"
                  />
                }
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
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(_ev, value) => setPagamentoTracciabile(value)}
                    checked={pagamentoTracciabile}
                    id="pagamentoTracciabile"
                    name="pagamentoTracciabile"
                  />
                }
                label="Pagamento tracciabile"
                sx={{ mt: 3 }}
              />
              <LocalizationProvider
                dateAdapter={AdapterLuxon}
                adapterLocale={"eu-IT"}
              >
                <DateTimePicker
                  label="Data emissione"
                  onChange={(newValue) => {
                    setIssueDateTime(new Date(newValue));
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

              {d && (
                <FormControlLabel
                  control={<Checkbox id="dark" name="dark" />}
                  label="d"
                  sx={{ mt: 3 }}
                />
              )}

              <LoadingButton
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 3 }}
                disabled={!enableSubmit}
                loading={waiting}
                loadingPosition="start"
                startIcon={<SaveIcon />}
              >
                Inserisci
              </LoadingButton>
            </Box>
          </>
        )}
      </Box>
    </StyledPaper>
  );
}
