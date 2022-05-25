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
import validator from "validator";
import { newInvoice } from "../lib/controller";
import CodiceFiscale from "codice-fiscale-js";

export default function NewPatientView() {
  // ---- COMPONENT STATE --- //
  const [name, setName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [codFisc, setCodFisc] = React.useState("");
  const [pIva, setPIva] = React.useState("");
  const [paeseResidenza, setPaeseResidenza] = React.useState(undefined);
  const [provinciaResidenza, setProvinciaResidenza] = React.useState("");
  const [capResidenza, setCapResidenza] = React.useState("");
  const [viaResidenza, setViaResidenza] = React.useState(undefined);
  const [civicoResidenza, setCivicoResidenza] = React.useState(undefined);
  const [telefono, setTelefono] = React.useState(undefined);
  const [email, setEmail] = React.useState(undefined);
  const [dataNascita, setDataNascita] = React.useState(DateTime.now());
  const [paeseNascita, setPaeseNascita] = React.useState(undefined);
  const [provinciaNascita, setProvinciaNascita] = React.useState("");
  const [capNascita, setCapNascita] = React.useState("");
  const [prezzo, setPrezzo] = React.useState(0);

  const [nameError, setNameError] = React.useState(false);
  const [surnameError, setSurnameError] = React.useState(false);
  const [codFiscError, setCodFiscError] = React.useState(false);
  const [pIvaError, setPIvaError] = React.useState(false);
  // RegExp for validators
  const capRegEx = /\d{5}/;
  const provRegEx = /\D{2}/;
  const pIvaRegEx = /\d{11}/;

  // HANDLER for Form submit event
  async function submit(event) {
    event.preventDefault();
    if (!validateForm()) return;
  }

  // HANDLER for field change events
  function handleName(event) {
    setName(event.target.value);
    vName();
  }

  function handleSurname(event) {
    setSurname(event.target.value);
    vSurname();
  }

  function handleCodFisc(event) {
    setCodFisc(event.target.value);
    vCodFisc();
  }

  function handlePIva(event) {
    setPIva(event.target.value);
    vPiva();
  }

  function handleProvinciaResidenza(event) {
    setProvinciaResidenza(event.target.value);
    vProvinciaResidenza();
  }

  function handleCapResidenza(event) {
    setCapResidenza(event);
    vCapResidenza();
  }

  function handleTelefono(event) {
    setTelefono(event.target.value);
    vTelefono();
  }

  function handleEmail(event) {
    setEmail(event.target.value);
    vEmail();
  }

  function handleDataNascita(event) {
    setDataNascita(event.target.value);
    vDataNascita();
  }

  function handleProvinciaNascita(event) {
    setProvinciaNascita(event.target.value);
    vProvinciaNascita();
  }

  function handleCapNascita(event) {
    setCapNascita(event.target.value);
    vCapNascita();
  }

  function handlePrezzo(event) {
    setPrezzo(event.target.value);
    vPrezzo();
  }

  // VALIDATORS
  function vName() {
    setNameError(name === "");
    return name !== "";
  }
  function vSurname() {
    setSurnameError(surname === "");
    return surname !== "";
  }
  function vCodFisc() {
    try {
      CodiceFiscale(codFisc);
      return true;
    } catch (err) {
      return false;
    }
  }
  function vPiva() {
    return pIva === "" || pIvaRegEx.test(pIva);
  }

  function vProvinciaResidenza() {
    return provRegEx.test(provinciaResidenza);
  }

  function vCapResidenza() {
    return capRegEx.test(capResidenza);
  }

  function vTelefono() {
    return telefono === "" || validator.isMobilePhone(telefono);
  }
  function vEmail() {
    return email === "" || validator.isEmail(email);
  }
  function vDataNascita() {
    return dataNascita === "" || dataNascita.isValid;
  }
  function vProvinciaNascita() {
    return provinciaNascita === "" || provRegEx.test(provinciaNascita);
  }
  function vCapNascita() {
    return capNascita === "" || capRegEx.test(capNascita);
  }
  function vPrezzo() {
    return !isNaN(prezzo) && prezzo >= 0;
  }

  // VALIDATOR for STATE values
  function validateForm() {
    return (
      vDataNascita() &&
      vPrezzo() &&
      vEmail() &&
      vTelefono() &&
      vCodFisc() &&
      vCapResidenza() &&
      vCapNascita() &&
      vProvinciaResidenza() &&
      vProvinciaNascita() &&
      vName() &&
      vSurname() &&
      vPiva()
    );
  }

  return (
    <Box
      component="form"
      onSubmit={submit}
      noValidate
      sx={{
        p: 3,
        mt: 12,
        maxWidth: "500px",
        mr: "auto",
        ml: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Nuovo paziente
      </Typography>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          variant="standard"
          label="Nome"
          name="name"
          onChange={handleName}
          error={nameError}
          helperText={nameError ? "Nome obbligatorio" : null}
        />
        <TextField
          variant="standard"
          label="Cognome"
          name="surname"
          onChange={handleSurname}
          error={surnameError}
          helperText={surnameError ? "Cognome obbligatorio" : null}
        />
        <TextField
          variant="standard"
          label="Codice fiscale"
          name="codFisc"
          onChange={handleCodFisc}
          error={codFiscError}
          helperText={codFiscError ? "Cognome obbligatorio" : null}
        />
        <TextField
          variant="standard"
          label="Partita IVA"
          name="pIva"
          onChange={handlePIva}
          error={pIvaError}
          helperText={pIvaError ? "Cognome obbligatorio" : null}
        />
      </Paper>
    </Box>
  );
}
