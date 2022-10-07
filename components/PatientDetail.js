import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import PostAddIcon from "@mui/icons-material/PostAdd";
import IconButton from "@mui/material/IconButton";

export default function PatientDetail({
  patient,
  invoices,
  openInvoiceDetail,
  createNewInvoice,
}) {
  // invoices: is a subset of appData.invoices, containing only patient's ones.
  const res = patient.indirizzoResidenza;
  return (
    <Paper sx={{ mt: 2, p: 4, maxWidth: "900px", mr: "auto", ml: "auto" }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">
          {patient.cognome.toUpperCase()} {patient.nome}
        </Typography>
        <IconButton
          onClick={() => {
            createNewInvoice(patient._id);
          }}
        >
          <PostAddIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-end",
          flexDirection: "column",
        }}
      >
        {patient.ultimaModifica && (
          <Typography variant="overline">
            Ultima fattura{" "}
            {new Date(patient.ultimaModifica).toLocaleDateString()}
          </Typography>
        )}
        <Typography variant="overline">Prezzo {patient.prezzo}€</Typography>
      </Box>

      <Divider />
      <Box sx={{ m: 2, ml: 2 }}>
        <Typography variant="h6">Residenza</Typography>
        <Box sx={{ ml: 2, mt: 1 }}>
          {res && res.paese && res.provincia && res.cap && (
            <Typography variant="body1">
              {res.paese} ({res.provincia}), {res.cap}
            </Typography>
          )}
          {res.via && res.civico && (
            <Typography variant="body1">
              {res.via} {res.civico}
            </Typography>
          )}
        </Box>
      </Box>
      <Divider />
      <Box sx={{ m: 2, ml: 2 }}>
        <Typography variant="h6">Anagrafica</Typography>
        <Box sx={{ ml: 2, mt: 1 }}>
          {patient.codiceFiscale && (
            <Typography variant="body1">
              Codice fiscale: {patient.codiceFiscale}
            </Typography>
          )}
          {patient.partitaIva && (
            <Typography variant="body1">
              Partita IVA: {patient.partitaIva}
            </Typography>
          )}
          {patient.dataNascita && (
            <Typography variant="body1">
              Nato/a il {new Date(patient.dataNascita).toLocaleDateString()}
              {patient.luogoNascita.paese && ` a ${patient.luogoNascita.paese}`}
              {patient.luogoNascita.provincia &&
                ` (${patient.luogoNascita.provincia})`}
              {patient.luogoNascita.CAP && `, ${patient.luogoNascita.CAP}`}
            </Typography>
          )}
        </Box>
      </Box>
      <Divider />
      {(patient.email || patient.telefono) && (
        <>
          <Box sx={{ m: 2, ml: 2 }}>
            <Typography variant="h6">Recapiti</Typography>
            <Box sx={{ ml: 2, mt: 1 }}>
              {patient.telefono && (
                <Typography variant="body1">{patient.telefono}</Typography>
              )}
              {patient.email && (
                <Typography variant="body1">{patient.email}</Typography>
              )}
            </Box>
          </Box>
          <Divider />
        </>
      )}
    </Paper>
  );
}
