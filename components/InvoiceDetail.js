import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import IconButton from "@mui/material/IconButton";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import Chip from "@mui/material/Chip";
import italianMonth from "../lib/dateTranslator";
import excelInvoice from "../lib/excelLib";

const TextLine = ({ children, width }) => {
  const w = width ? width : "auto";
  return (
    <Box sx={{ m: 1, w }}>
      <Typography variant="body1">{children}</Typography>
    </Box>
  );
};

export default function InvoiceDetail({ invoice, patient, openPatientDetail }) {
  const date = new Date(invoice.dataEmissione);
  const cashed = invoice.dataIncasso !== undefined;
  return (
    <Paper sx={{ mt: 2, p: 4, maxWidth: "700px", mr: "auto", ml: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h5">
          Fattura N. {invoice.numeroOrdine} del{" "}
          {`${date.getDate()} ${italianMonth(
            date.getMonth()
          ).toLowerCase()} ${date.getFullYear()}`}
        </Typography>
        <IconButton
          onClick={() => {
            excelInvoice(patient, invoice);
          }}
        >
          <InsertDriveFileIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box
        sx={{
          m: 2,
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            mt: 1,
            width: "33%",
          }}
        >
          <Typography variant="button" sx={{ m: 2 }}>
            Intestatario
          </Typography>
        </Box>
        <Box sx={{ width: "66%" }}>
          <Button variant="text" onClick={() => openPatientDetail(patient._id)}>
            {patient.cognome} {patient.nome}
          </Button>
          <Divider />
          {patient.codiceFiscale && (
            <TextLine>{patient.codiceFiscale}</TextLine>
          )}
          {patient.partitaIva && <TextLine>patient.partitaIva</TextLine>}
          <TextLine>
            Residente a {patient.indirizzoResidenza.paese} (
            {patient.indirizzoResidenza.provincia}),{" "}
            {patient.indirizzoResidenza.cap}, {patient.indirizzoResidenza.via}{" "}
            {patient.indirizzoResidenza.civico}
          </TextLine>
          {patient.telefono && <TextLine>{patient.telefono}</TextLine>}
          {patient.email && <TextLine>{patient.email}</TextLine>}
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          m: 2,
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            mt: 1,
            width: "33%",
            p: 2,
            pt: 1,
          }}
        >
          <Typography variant="button">Prestazione eseguita</Typography>
        </Box>
        <Box sx={{ width: "66%", p: 2, pt: 1, mt: 1 }}>
          <Typography>{invoice.testo}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          m: 2,
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            mt: 1,
            width: "33%",
            p: 2,
            pt: 1,
          }}
        >
          <Typography variant="button">Valore</Typography>
        </Box>
        <Box sx={{ width: "66%", p: 2, pt: 1, mt: 1 }}>
          <Typography>{invoice.valore}€</Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        {cashed ? (
          new Date(invoice.dataIncasso).getTime() == date.getTime() ? (
            <Chip
              variant="outlined"
              color="success"
              icon={<DoneIcon fontSize="small" />}
              label="INCASSATA"
            />
          ) : (
            <Chip
              variant="outlined"
              color="success"
              icon={<DoneIcon fontSize="small" />}
              label={`INCASSATA IL ${new Date(
                invoice.dataIncasso
              ).toLocaleDateString()}`}
            />
          )
        ) : (
          <Chip
            variant="outlined"
            color="error"
            icon={<ErrorOutlineIcon fontSize="small" />}
            label="NON INCASSATA"
          />
        )}
      </Box>
    </Paper>
  );
}