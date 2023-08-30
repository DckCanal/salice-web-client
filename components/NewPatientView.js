import * as React from "react";
import { useRouter } from "next/router";
import { Button, Box, Typography } from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import validator from "validator";
import CodiceFiscale from "codice-fiscale-js";
import MarginTextField from "./MarginTextField";
import FormPaper from "./FormPaper";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
// IMPORT ADD PATIENT

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
  const [waiting, setWaiting] = React.useState(false);

  const router = useRouter();

  // RegExp for validators
  const capRegEx = /\d{5}/;
  const provRegEx = /[A-Z]{2}/i;
  const pIvaRegEx = /\d{11}/;

  // HANDLER for Form submit event
  async function submit(event) {
    event.preventDefault();
    if (!validateForm()) return;
    setWaiting(true);

    try {
      const newPatient = await addPatient(
        name,
        surname,
        codFisc,
        pIva,
        paeseResidenza,
        provinciaResidenza,
        capResidenza,
        viaResidenza,
        civicoResidenza,
        telefono,
        email,
        new Date(dataNascita),
        paeseNascita,
        provinciaNascita,
        capNascita,
        prezzo
      );
      if (newPatient._id) {
        setWaiting(false);
      }
    } catch (err) {
      console.error(err);
    }
    router.push("/patients");
  }

  // VALIDATORS
  function vName() {
    return name !== "";
  }
  function vSurname() {
    return surname !== "";
  }
  function vCodFisc() {
    try {
      new CodiceFiscale(codFisc);
      return true;
    } catch (err) {
      return codFisc === "";
    }
  }
  function vPiva() {
    return pIva === "" || pIvaRegEx.test(pIva);
  }

  function vProvinciaResidenza() {
    return provinciaNascita === "" || provRegEx.test(provinciaResidenza);
  }

  function vCapResidenza() {
    return capResidenza === "" || capRegEx.test(capResidenza);
  }

  function vTelefono() {
    return telefono === "" || validator.isMobilePhone(telefono);
  }
  function vEmail() {
    return email === "" || validator.isEmail(email);
  }
  function vDataNascita() {
    return (
      dataNascita === "" ||
      dataNascita == null ||
      !isNaN(Date.parse(new Date(dataNascita)))
    );
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
  const enableSubmit = validateForm();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        m: 4,
      }}
    >
      <Typography component="h1" variant="h4" textAlign="center">
        Nuovo paziente
      </Typography>
      <Box component="form" onSubmit={submit} noValidate>
        <Box
          sx={{
            p: 3,
            mt: 3,
            mr: "auto",
            ml: "auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            flexWrap: "wrap",
            justifyContent: "center",
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
              onChange={(e) => setName(e.target.value)}
              error={!vName()}
              helperText={!vName() ? "Nome obbligatorio" : null}
            />
            <MarginTextField
              variant="standard"
              label="Cognome"
              name="surname"
              onChange={(e) => setSurname(e.target.value)}
              error={!vSurname()}
              helperText={!vSurname() ? "Cognome obbligatorio" : null}
            />
            <MarginTextField
              variant="standard"
              label="Codice fiscale"
              name="codFisc"
              onChange={(e) => setCodFisc(e.target.value.toUpperCase())}
              error={!vCodFisc()}
              helperText={!vCodFisc() ? "Codice fiscale non corretto" : null}
              inputProps={{
                style: { textTransform: "uppercase" },
                maxLength: 16,
              }}
            />
            <MarginTextField
              variant="standard"
              label="Partita IVA"
              name="pIva"
              onChange={(e) => setPIva(e.target.value)}
              error={!vPiva()}
              helperText={!vPiva() ? "P.Iva non corretta" : null}
              inputProps={{
                maxLength: 11,
              }}
            />
            <MarginTextField
              variant="standard"
              label="Telefono"
              name="telefono"
              onChange={(e) => setTelefono(e.target.value)}
              error={!vTelefono()}
              helperText={!vTelefono() ? "Telefono non corretto" : null}
            />
            <MarginTextField
              variant="standard"
              label="Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              error={!vEmail()}
              helperText={!vEmail() ? "Email non corretta" : null}
            />
            <MarginTextField
              variant="standard"
              label="Prezzo"
              name="prezzo"
              onChange={(e) => setPrezzo(e.target.value)}
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
              onChange={(e) => {
                setPaeseResidenza(e.target.value);
              }}
            />

            <MarginTextField
              variant="standard"
              label="Provincia"
              name="provinciaResidenza"
              onChange={(e) =>
                setProvinciaResidenza(e.target.value.toUpperCase())
              }
              error={!vProvinciaResidenza()}
              helperText={
                !vProvinciaResidenza() ? "Provincia non corretta" : null
              }
              inputProps={{
                style: { textTransform: "uppercase" },
                maxLength: 2,
              }}
            />
            <MarginTextField
              variant="standard"
              label="CAP"
              name="capResidenza"
              onChange={(e) => setCapResidenza(e.target.value)}
              error={!vCapResidenza()}
              helperText={!vCapResidenza() ? "CAP non corretto" : null}
              inputProps={{
                maxLength: 5,
              }}
            />
            <MarginTextField
              variant="standard"
              label="Via"
              name="viaResidenza"
              onChange={(e) => setViaResidenza(e.target.value)}
            />
            <MarginTextField
              variant="standard"
              label="Civico"
              name="civicoResidenza"
              onChange={(e) => setCivicoResidenza(e.target.value)}
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
                onChange={(date) => setDataNascita(date)}
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
              onChange={(e) => setPaeseNascita(e.target.value)}
            />
            <MarginTextField
              variant="standard"
              label="Provincia"
              name="provinciaNascita"
              onChange={(e) =>
                setProvinciaNascita(e.target.value.toUpperCase())
              }
              error={!vProvinciaNascita()}
              helperText={
                !vProvinciaNascita() ? "Provincia non corretta" : null
              }
              inputProps={{
                style: { textTransform: "uppercase" },
                maxLength: 2,
              }}
            />
          </FormPaper>
        </Box>
        <Box
          sx={{
            maxWidth: 600,
            mr: "auto",
            ml: "auto",
          }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={!enableSubmit}
            loading={waiting}
            sx={{ mt: 3, mb: 3 }}
            startIcon={<SaveIcon />}
          >
            Inserisci
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
}
