// TODO: PROVINCIA VALIDATOR BUG, CAP VALIDATOR BUG, CODFISC VALIDATOR BUG

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
import MarginTextField from "./MarginTextField";
import FormPaper from "./FormPaper";

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

  //const [nameError, setNameError] = React.useState(false);
  //const [surnameError, setSurnameError] = React.useState(false);
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
    // console.log(
    //   `event.target.value: ${event.target.value}`,
    //   `state[name]: ${name}`
    // );
    // console.log(`Name validator: OK=${vName()}`);
  }

  function handleSurname(event) {
    setSurname(event.target.value);
    // vSurname();
  }

  function handleCodFisc(event) {
    setCodFisc(event.target.value);
    // vCodFisc();
  }

  function handlePIva(event) {
    setPIva(event.target.value);
    // vPiva();
  }

  function handleProvinciaResidenza(event) {
    setProvinciaResidenza(event.target.value);
    // vProvinciaResidenza();
  }

  function handleCapResidenza(event) {
    setCapResidenza(event);
    // vCapResidenza();
  }

  function handleTelefono(event) {
    setTelefono(event.target.value);
    // vTelefono();
  }

  function handleEmail(event) {
    setEmail(event.target.value);
    // vEmail();
  }

  function handleDataNascita(newVal) {
    setDataNascita(newVal);
    // vDataNascita();
  }

  function handleProvinciaNascita(event) {
    setProvinciaNascita(event.target.value);
    // vProvinciaNascita();
  }

  function handleCapNascita(event) {
    setCapNascita(event.target.value);
    // vCapNascita();
  }

  function handlePrezzo(event) {
    setPrezzo(event.target.value);
    // vPrezzo();
  }

  // VALIDATORS
  function vName() {
    //setNameError(name === "");
    return name !== "";
  }
  function vSurname() {
    //setSurnameError(surname === "");
    return surname !== "";
  }
  // ERROR SETTER!!
  function vCodFisc() {
    try {
      CodiceFiscale(codFisc);
      //setCodFiscError(false);
      return true;
    } catch (err) {
      //setCodFiscError(true);
      return false;
    }
  }
  function vPiva() {
    //setPIvaError(!(pIva === "" || pIvaRegEx.test(pIva)));
    return pIva === "" || pIvaRegEx.test(pIva);
  }

  function vProvinciaResidenza() {
    //setProvinciaResidenzaError(!provRegEx.test(provinciaResidenza));
    return provRegEx.test(provinciaResidenza);
  }

  function vCapResidenza() {
    //setCapResidenzaError(!capRegEx.test(capResidenza));
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
    <>
      <Typography component="h1" variant="h5">
        Nuovo paziente
      </Typography>
      <Box
        component="form"
        onSubmit={submit}
        noValidate
        sx={{
          p: 3,
          mt: 3,
          mr: "auto",
          ml: "auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <FormPaper>
          <Typography component="h3" variant="h5">
            Informazioni personali
          </Typography>
          <MarginTextField
            variant="standard"
            label="Nome"
            name="name"
            onChange={handleName}
            error={!vName()}
            helperText={!vName() ? "Nome obbligatorio" : null}
          />
          <MarginTextField
            variant="standard"
            label="Cognome"
            name="surname"
            onChange={handleSurname}
            error={!vSurname()}
            helperText={!vSurname() ? "Cognome obbligatorio" : null}
          />
          <MarginTextField
            variant="standard"
            label="Codice fiscale"
            name="codFisc"
            onChange={handleCodFisc}
            error={!vCodFisc()}
            helperText={!vCodFisc() ? "Codice fiscale non corretto" : null}
          />
          <MarginTextField
            variant="standard"
            label="Partita IVA"
            name="pIva"
            onChange={handlePIva}
            error={!vPiva()}
            helperText={!vPiva() ? "P.Iva non corretta" : null}
          />
          <MarginTextField
            variant="standard"
            label="Telefono"
            name="telefono"
            onChange={handleTelefono}
            error={!vTelefono()}
            helperText={!vTelefono() ? "Telefono non corretto" : null}
          />
          <MarginTextField
            variant="standard"
            label="Email"
            name="email"
            onChange={handleEmail}
            error={!vEmail()}
            helperText={!vEmail() ? "Email non corretta" : null}
          />
          <MarginTextField
            variant="standard"
            label="Prezzo"
            name="prezzo"
            onChange={handlePrezzo}
            error={!vPrezzo()}
            helperText={!vPrezzo() ? "Prezzo non corretto" : null}
          />
        </FormPaper>
        <FormPaper>
          <Typography component="h3" variant="h5">
            Residenza
          </Typography>
          <MarginTextField
            variant="standard"
            label="Comune"
            name="paeseResidenza"
            onChange={(ev) => {
              setPaeseResidenza(ev.target.value);
            }}
          />

          <MarginTextField
            variant="standard"
            label="Provincia"
            name="provinciaResidenza"
            onChange={handleProvinciaResidenza}
            error={!vProvinciaResidenza()}
            helperText={
              !vProvinciaResidenza() ? "Provincia non corretta" : null
            }
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
          <MarginTextField
            variant="standard"
            label="CAP"
            name="capResidenza"
            onChange={handleCapResidenza}
            error={!vCapResidenza()}
            helperText={!vCapResidenza() ? "CAP non corretto" : null}
          />
          <MarginTextField
            variant="standard"
            label="Via"
            name="viaResidenza"
            onChange={(ev) => {
              setViaResidenza(ev.target.value);
            }}
          />
          <MarginTextField
            variant="standard"
            label="Civico"
            name="civicoResidenza"
            onChange={(ev) => {
              setCivicoResidenza(ev.target.value);
            }}
          />
        </FormPaper>
        <FormPaper>
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
                <MarginTextField
                  {...params}
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                />
              )}
            />
          </LocalizationProvider>
          <MarginTextField
            variant="standard"
            label="Comune"
            name="paeseNascita"
            onChange={(ev) => {
              setPaeseNascita(ev.target.value);
            }}
          />
          <MarginTextField
            variant="standard"
            label="Provincia"
            name="provinciaNascita"
            onChange={handleProvinciaNascita}
            error={!vProvinciaNascita()}
            helperText={!vProvinciaNascita() ? "Provincia non corretta" : null}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </FormPaper>
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 3 }}>
          Inserisci
        </Button>
      </Box>
    </>
  );
}
