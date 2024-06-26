'use client';
import * as React from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import {
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
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";

import StyledPaper from "./StyledPaper";
import { useInvoice, usePatient } from "../lib/hooks";
import { updateInvoice } from "../lib/controller";
import ErrorBox from "./ErrorBox";
// TODO: manage response errors

const Container = ({ children }) => (
  <StyledPaper sx={{ p: 3, mt: 12, maxWidth: "500px", mr: "auto", ml: "auto" }}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {children}
    </Box>
  </StyledPaper>
);

export default function UpdateInvoiceView() {
  const router = useRouter();
  const invoiceId = router.query.id;

  // --- COMPONENT STATE --- //
  const {
    invoice,
    isLoading: isLoadingInvoice,
    error: invoiceError,
  } = useInvoice(invoiceId);

  const {
    patient,
    isLoading: isLoadingPatient,
    error: patientError,
  } = usePatient(invoice?.paziente);

  const [invoiceAmountTextField, setInvoiceAmountTextField] = React.useState(
    invoice?.valore ? invoice.valore : 0
  );
  const [cashed, setCashed] = React.useState(invoice?.incassata);
  const [cashedDateTime, setCashedDateTime] = React.useState(
    invoice?.dataIncasso ? new Date(invoice.dataIncasso) : undefined
  );
  const [pagamentoTracciabile, setPagamentoTracciabile] = React.useState(
    invoice?.pagamentoTracciabile ? invoice.pagamentoTracciabile : false
  );
  const [issueDateTime, setIssueDateTime] = React.useState(
    invoice?.dataEmissione ? new Date(invoice.dataEmissione) : undefined
  );
  const [invoiceAmountError, setInvoiceAmountError] = React.useState(false);
  const [text, setText] = React.useState(
    invoice?.testo ? invoice.testo : undefined
  );
  const [textError, setTextError] = React.useState(
    invoice?.testo === "" || invoice?.testo == undefined
  );
  //const [dark, setDark] = React.useState(invoice?.d ? true : false);

  const [waiting, setWaiting] = React.useState(false);

  // HANDLER for Form submit event
  async function submit(event) {
    event.preventDefault();
    if (!validateForm()) {
      // should never happens, because if !validateForm(), submit button is disabled
      return;
    }

    setWaiting(true);
    const newValues = {};
    if (Number.parseFloat(invoiceAmountTextField) != invoice.valore)
      newValues.valore = Number.parseFloat(invoiceAmountTextField);
    if (
      Date.parse(new Date(issueDateTime)) !=
      Date.parse(new Date(invoice.dataEmissione))
    ) {
      newValues.dataEmissione = new Date(issueDateTime);
    }
    if (text !== invoice.testo) newValues.testo = text;
    newValues.cashed = cashed;
    // NaN != NaN is true
    if (
      Date.parse(new Date(cashedDateTime)) !=
      Date.parse(new Date(invoice.dataIncasso))
    )
      newValues.dataIncasso = new Date(cashedDateTime);
    if (pagamentoTracciabile !== invoice.pagamentoTracciabile) {
      newValues.pagamentoTracciabile = pagamentoTracciabile;
    }
    try {
      const { updatedInvoice } = await mutate(
        "/api/invoices",
        updateInvoice(invoice._id, newValues),
        {
          revalidate: false,
          populateCache: ({ updatedInvoice }, cacheData) => {
            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                invoices: cacheData.data.invoices.map((inv) => {
                  if (String(inv._id) === String(updatedInvoice._id))
                    return updatedInvoice;
                  else return inv;
                }),
              },
            };
          },
        }
      );
      if (updatedInvoice._id) {
        setWaiting(false);
        router.push(`/invoices/${invoice._id}`);
      }
    } catch (err) {
      console.error(err);
    }
    //openNextView();
  }

  // HANDLER for delete button
  async function deleteBtn(event) {
    event.preventDefault();
    if (!validateForm()) return;
    setWaiting(true);
    try {
      const res = await deleteInvoice(invoice);
      if (res) setWaiting(false);
    } catch (err) {
      console.error(err);
    }
    //openNextView();
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
      !isNaN(Date.parse(issueDateTime)) &&
      (cashed ? !isNaN(Date.parse(cashedDateTime)) : true)
    );
  }
  const enableSubmit = validateForm();

  if (invoiceError)
    return (
      <Container>
        <ErrorBox
          title="Errore nel caricamento della fattura"
          text={invoiceError?.message}
        />
      </Container>
    );
  if (patientError)
    return (
      <Container>
        <ErrorBox
          title="Errore nel caricamento del paziente"
          text={patientError?.message}
        />
      </Container>
    );

  return (
    <Container>
      <Typography component="h1" variant="h5">
        Modifica
      </Typography>

      {isLoadingInvoice || isLoadingPatient ? (
        <CircularProgress sx={{ mx: "auto", mt: 15 }} />
      ) : (
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
            {patient?.cognome} {patient?.nome}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                //defaultChecked={cashed}
                checked={cashed}
                id="cashed"
                name="cashed"
                onChange={(_ev, checked) => {
                  setCashed(checked);
                  if (checked) {
                    if (cashedDateTime === undefined)
                      setCashedDateTime(new Date());
                  }
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
                  setCashedDateTime(new Date(newValue));
                }}
                value={cashedDateTime ?? new Date()}
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
              onClick={(event) => {
                deleteBtn(event);
              }}
              startIcon={<DeleteIcon />}
              color="error"
            >
              Elimina
            </LoadingButton>
          </Box>
        </Box>
      )}
    </Container>
  );
}
