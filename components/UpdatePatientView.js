import * as React from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";

import { Box, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { CircularProgress } from "@mui/material";

import validator from "validator";
import CodiceFiscale from "codice-fiscale-js";
import MarginTextField from "./MarginTextField";
import FormPaper from "./FormPaper";
import ErrorBox from "./ErrorBox";
import { usePatient } from "../lib/hooks";
import { updatePatient } from "../lib/controller";

const Container = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      m: 4,
    }}
  >
    {children}
  </Box>
);

export default function UpdatePatientView() {
  const router = useRouter();
  const patientId = router.query.id;

  const { patient, isLoading, error } = usePatient(patientId);

  const [name, setName] = React.useState(patient?.nome || undefined);
  const [surname, setSurname] = React.useState(patient?.cognome || undefined);
  const [codFisc, setCodFisc] = React.useState(patient?.codiceFiscale || "");
  const [pIva, setPIva] = React.useState(patient?.partitaIva || "");
  const [paeseResidenza, setPaeseResidenza] = React.useState(
    patient?.indirizzoResidenza?.paese || ""
  );
  const [provinciaResidenza, setProvinciaResidenza] = React.useState(
    patient?.indirizzoResidenza?.provincia || ""
  );
  const [capResidenza, setCapResidenza] = React.useState(
    patient?.indirizzoResidenza?.cap || ""
  );
  const [viaResidenza, setViaResidenza] = React.useState(
    patient?.indirizzoResidenza?.via || ""
  );
  const [civicoResidenza, setCivicoResidenza] = React.useState(
    patient?.indirizzoResidenza?.civico || ""
  );
  const [telefono, setTelefono] = React.useState(patient?.telefono || "");
  const [email, setEmail] = React.useState(patient?.email || "");
  const [dataNascita, setDataNascita] = React.useState(
    patient?.dataNascita !== null ? new Date(patient.dataNascita) : ""
  );
  const [paeseNascita, setPaeseNascita] = React.useState(
    patient?.luogoNascita?.paese || ""
  );
  const [provinciaNascita, setProvinciaNascita] = React.useState(
    patient?.luogoNascita?.provincia || ""
  );
  const [capNascita, setCapNascita] = React.useState(
    patient?.luogoNascita?.CAP || ""
  );
  const [prezzo, setPrezzo] = React.useState(patient?.prezzo || 0);

  const [waiting, setWaiting] = React.useState(false);

  // RegExp for validators
  const capRegEx = /\d{5}/;
  const provRegEx = /[A-Z]{2}/i;
  const pIvaRegEx = /\d{11}/;

  // HANDLER for Form submit event
  async function submit(event) {
    event.preventDefault();
    if (!validateForm()) return;
    setWaiting(true);

    const newValues = {};
    if (name !== patient.nome) newValues.nome = name;
    if (surname !== patient.cognome) newValues.cognome = surname;
    if (codFisc !== patient.codiceFiscale) newValues.codiceFiscale = codFisc;
    if (pIva !== patient.partitaIva) newValues.partitaIva = pIva;
    newValues.indirizzoResidenza = {};
    if (paeseResidenza !== patient.indirizzoResidenza?.paese)
      newValues.indirizzoResidenza.paese = paeseResidenza;
    if (provinciaResidenza !== patient.indirizzoResidenza?.provincia)
      newValues.indirizzoResidenza.provincia = provinciaResidenza;
    if (capResidenza !== patient.indirizzoResidenza?.cap)
      newValues.indirizzoResidenza.cap = capResidenza;
    if (viaResidenza !== patient.indirizzoResidenza?.via)
      newValues.indirizzoResidenza.via = viaResidenza;
    if (civicoResidenza !== patient.indirizzoResidenza?.civico)
      newValues.indirizzoResidenza.civico = civicoResidenza;
    if (telefono !== patient.telefono) newValues.telefono = telefono;
    if (email !== patient.email) newValues.email = email;
    if (
      new Date(dataNascita) !== new Date(patient.dataNascita) ||
      dataNascita === ""
    ) {
      // newValues.dataNascita = new Date(dataNascita);
      newValues.dataNascita = dataNascita;
    }
    newValues.luogoNascita = {};
    if (paeseNascita !== patient.luogoNascita?.paese)
      newValues.luogoNascita.paese = paeseNascita;
    if (provinciaNascita !== patient.luogoNascita?.provincia)
      newValues.luogoNascita.provincia = provinciaNascita;
    if (capNascita !== patient.luogoNascita?.cap)
      newValues.luogoNascita.cap = capNascita;
    if (Number.parseFloat(prezzo) !== Number.parseFloat(patient.prezzo))
      newValues.prezzo = Number.parseFloat(prezzo);
    try {
      const { updatedPatient } = await mutate(
        "/api/patients",
        updatePatient(patient._id, newValues),
        {
          revalidate: false,
          populateCache: ({ updatedPatient }, cacheData) => {
            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                patients: cacheData.data.patients.map((pat) => {
                  if (String(pat._id) === String(updatedPatient._id))
                    return updatedPatient;
                  else return pat;
                }),
              },
            };
          },
        }
      );
      if (updatedPatient._id) {
        setWaiting(false);
        router.push(`/patients/${updatedPatient._id}`);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // HANDLER for delete button
  async function deleteBtn(event) {
    event.preventDefault();
    if (!validateForm()) return;
    setWaiting(true);
    try {
      const res = await deletePatient(patient);
      if (res) setWaiting(false);
    } catch (err) {
      console.error(err);
    }
    //openNextView();
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
    return provinciaResidenza === "" || provRegEx.test(provinciaResidenza);
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
      //dataNascita === "" ||
      dataNascita == null || !isNaN(Date.parse(dataNascita))
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

  if (error)
    return (
      <Container>
        <ErrorBox
          title="Errore nel caricamento del paziente"
          text={error?.message}
        />
      </Container>
    );

  return (
    <Container>
      <Typography component="h1" variant="h4" textAlign="center">
        Modifica
      </Typography>
      {isLoading ? (
        <CircularProgress sx={{ mx: "auto", mt: 15 }} />
      ) : (
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
              {/* <MarginTextField */}
              <MarginTextField
                variant="standard"
                label="Nome"
                name="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                error={!vName()}
                helperText={!vName() ? "Nome obbligatorio" : null}
              />
              <MarginTextField
                variant="standard"
                label="Cognome"
                name="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                error={!vSurname()}
                helperText={!vSurname() ? "Cognome obbligatorio" : null}
              />
              <MarginTextField
                variant="standard"
                label="Codice fiscale"
                name="codFisc"
                value={codFisc}
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
                value={pIva}
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
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                error={!vTelefono()}
                helperText={!vTelefono() ? "Telefono non corretto" : null}
              />
              <MarginTextField
                variant="standard"
                label="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!vEmail()}
                helperText={!vEmail() ? "Email non corretta" : null}
              />
              <MarginTextField
                variant="standard"
                label="Prezzo"
                name="prezzo"
                value={prezzo}
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
                value={paeseResidenza}
                onChange={(e) => {
                  setPaeseResidenza(e.target.value);
                }}
              />

              <MarginTextField
                variant="standard"
                label="Provincia"
                name="provinciaResidenza"
                value={provinciaResidenza}
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
                value={capResidenza}
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
                value={viaResidenza}
                onChange={(e) => setViaResidenza(e.target.value)}
              />
              <MarginTextField
                variant="standard"
                label="Civico"
                name="civicoResidenza"
                value={civicoResidenza}
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
                value={paeseNascita}
                onChange={(e) => setPaeseNascita(e.target.value)}
              />
              <MarginTextField
                variant="standard"
                label="Provincia"
                name="provinciaNascita"
                value={provinciaNascita}
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
            <Box
              sx={{
                mt: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                width: 400,
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
                onClick={(event) => {
                  deleteBtn(event);
                }}
              >
                Elimina
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
}
