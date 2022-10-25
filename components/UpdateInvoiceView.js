import * as React from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";

// TODO: manage response errors

export default function UpdateInvoiceView({ invoice, patient, openNextView }) {
  // --- COMPONENT STATE --- //
  const [invoiceAmountTextField, setInvoiceAmountTextField] = React.useState(
    invoice.valore ? invoice.valore : 0
  );
  const [cashed, setCashed] = React.useState(invoice.dataIncasso != undefined);
  const [cashedDateTime, setCashedDateTime] = React.useState(
    invoice.dataIncasso ? new Date(invoice.dataIncasso) : undefined
  );
  const [issueDateTime, setIssueDateTime] = React.useState(
    invoice.dataEmissione ? new Date(invoice.dataEmissione) : undefined
  );
  const [invoiceAmountError, setInvoiceAmountError] = React.useState(false);
  const [text, setText] = React.useState(
    invoice.testo ? invoice.testo : undefined
  );
  const [textError, setTextError] = React.useState(
    invoice.testo === "" || invoice.testo == undefined
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
    openNextView();

    // const data = new FormData(event.currentTarget);
    //const cashed = data.get("cashed") === "on" ? true : false;

    // const newInvoice = await addInvoice(
    //   selectedPatientId,
    //   cashed,
    //   Number(invoiceAmountTextField),
    //   invoiceText,
    //   issueDateTime
    // );

    // if it's all OK, go to invoiceList

    // if (newInvoice._id) {
    //   setWaiting(false);
    //   openNextView();
    // }

    // else show error message modal window, reset fields and enable submit
  }

  // HANDLER for invoice value TextField change event
  function handleInvoiceValue(event) {
    setInvoiceAmountTextField(event.target.value);
    validateInvoiceValue(event.target.value);
  }

  // HANDLER for invoice text TextField change event
  function handleInvoiceText(event) {
    setText(event.target.value);
    validateInvoiceText(event.target.value);
  }

  // VALIDATOR for invoice amount TextField
  function validateInvoiceValue(valueToCheck) {
    setInvoiceAmountError(isNaN(valueToCheck) || Number(valueToCheck) < 0);
  }

  // VALIDATOR for invoice text TextField
  function validateInvoiceText(valueToCheck) {
    setTextError(valueToCheck === "" || valueToCheck == undefined);
  }

  // VALIDATOR for STATE values
  function validateForm() {
    return (
      !isNaN(invoiceAmountTextField) &&
      Number(invoiceAmountTextField) >= 0 &&
      issueDateTime.isValid &&
      (cashed ? cashedDateTime.isValid : true)
    );
  }
  const enableSubmit = validateForm();

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
          Modifica
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
          <Typography variant="h6">
            {patient.cognome} {patient.nome}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked={{ cashed }}
                id="cashed"
                name="cashed"
                onChange={(_ev, checked) => {
                  setCashed(checked);
                }}
              />
            }
            label="Incassata"
            sx={{ mt: 3 }}
          />
          {cashed && (
            <LocalizationProvider
              dateAdapter={AdapterLuxon}
              adapterLocale={"eu-IT"}
            >
              <DateTimePicker
                label="Data incasso"
                onChange={(newValue) => {
                  setCashedDateTime(newValue);
                }}
                value={cashedDateTime}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ mt: 3 }}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </LocalizationProvider>
          )}
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
            defaultValue={text}
            error={textError}
            onChange={handleInvoiceText}
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
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 3 }}
              disabled={!enableSubmit}
              loading={waiting}
              loadingPosition="start"
              startIcon={<SaveIcon />}
            >
              Modifica
            </LoadingButton>
            <LoadingButton
              variant="contained"
              sx={{ mt: 3, mb: 3 }}
              disabled={!enableSubmit}
              loading={waiting}
              loadingPosition="start"
              startIcon={<DeleteIcon />}
              color="error"
            >
              Elimina
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
