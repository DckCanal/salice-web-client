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
import { DatePicker } from "@mui/x-date-pickers";
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
  const [telefono, setTelefono] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [dataNascita, setDataNascita] = React.useState(DateTime.now());
  const [paeseNascita, setPaeseNascita] = React.useState(undefined);
  const [provinciaNascita, setProvinciaNascita] = React.useState("");
  const [capNascita, setCapNascita] = React.useState("");
  const [prezzo, setPrezzo] = React.useState(0);

  const [nameError, setNameError] = React.useState(false);
  const [surnameError, setSurnameError] = React.useState(false);
  const [codFiscError, setCodFiscError] = React.useState(false);
  const [pIvaError, setPIvaError] = React.useState(false);
  const [provinciaResidenzaError, setProvinciaResidenzaError] =
    React.useState(false);
  const [capResidenzaError, setCapResidenzaError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [telefonoError, setTelefonoError] = React.useState(false);
  const [provinciaNascitaError, setProvinciaNascitaError] =
    React.useState(false);
  const [prezzoError, setPrezzoError] = React.useState(false);
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

  function handleDataNascita(newVal) {
    setDataNascita(newVal);
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
  // ERROR SETTER!!
  function vCodFisc() {
    try {
      CodiceFiscale(codFisc);
      setCodFiscError(false);
      return true;
    } catch (err) {
      setCodFiscError(true);
      return false;
    }
  }
  function vPiva() {
    setPIvaError(!(pIva === "" || pIvaRegEx.test(pIva)));
    return pIva === "" || pIvaRegEx.test(pIva);
  }

  function vProvinciaResidenza() {
    setProvinciaResidenzaError(!provRegEx.test(provinciaResidenza));
    return provRegEx.test(provinciaResidenza);
  }

  function vCapResidenza() {
    setCapResidenzaError(!capRegEx.test(capResidenza));
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
        <Typography component="h3" variant="h5">
          Informazioni personali
        </Typography>
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
          helperText={codFiscError ? "Codice fiscale non corretto" : null}
        />
        <TextField
          variant="standard"
          label="Partita IVA"
          name="pIva"
          onChange={handlePIva}
          error={pIvaError}
          helperText={pIvaError ? "P.Iva non corretta" : null}
        />
        <TextField
          variant="standard"
          label="Telefono"
          name="telefono"
          onChange={handleTelefono}
          error={telefonoError}
          helperText={telefonoError ? "Telefono non corretto" : null}
        />
        <TextField
          variant="standard"
          label="Email"
          name="email"
          onChange={handleEmail}
          error={emailError}
          helperText={emailError ? "Email non corretta" : null}
        />
        <TextField
          variant="standard"
          label="Prezzo"
          name="prezzo"
          onChange={handlePrezzo}
          error={prezzoError}
          helperText={prezzoError ? "Prezzo non corretto" : null}
        />
      </Paper>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h3" variant="h5">
          Residenza
        </Typography>
        <TextField
          variant="standard"
          label="Comune"
          name="paeseResidenza"
          onChange={(ev) => {
            setPaeseResidenza(ev.target.value);
          }}
        />
        {
          // TODO: solo maiuscolo!
        }
        <TextField
          variant="standard"
          label="Provincia"
          name="provinciaResidenza"
          onChange={handleProvinciaResidenza}
          error={provinciaResidenzaError}
          helperText={provinciaResidenzaError ? "Provincia non corretta" : null}
        />
        <TextField
          variant="standard"
          label="CAP"
          name="capResidenza"
          onChange={handleCapResidenza}
          error={capResidenzaError}
          helperText={capResidenzaError ? "CAP non corretto" : null}
        />
        <TextField
          variant="standard"
          label="Via"
          name="viaResidenza"
          onChange={(ev) => {
            setViaResidenza(ev.target.value);
          }}
        />
        <TextField
          variant="standard"
          label="Civico"
          name="civicoResidenza"
          onChange={(ev) => {
            setCivicoResidenza(ev.target.value);
          }}
        />
      </Paper>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h3" variant="h5">
          Nascita
        </Typography>
        <LocalizationProvider
          dateAdapter={AdapterLuxon}
          adapterLocale={"eu-IT"}
        >
          <DatePicker
            label="Data di nascita"
            onChange={handleDataNascita}
            value={dataNascita}
            renderInput={(params) => (
              <TextField
                {...params}
                InputLabelProps={{ shrink: true }}
                variant="standard"
              />
            )}
          />
        </LocalizationProvider>
        <TextField
          variant="standard"
          label="Comune"
          name="paeseNascita"
          onChange={(ev) => {
            setPaeseNascita(ev.target.value);
          }}
        />
        <TextField
          variant="standard"
          label="Provincia"
          name="provinciaNascita"
          onChange={handleProvinciaNascita}
          error={provinciaNascitaError}
          helperText={provinciaNascitaError ? "Provincia non corretta" : null}
        />
      </Paper>
      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 3 }}>
        Inserisci
      </Button>
    </Box>
  );
}
