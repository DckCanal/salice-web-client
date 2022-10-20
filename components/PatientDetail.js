import * as React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import PostAddIcon from "@mui/icons-material/PostAdd";
import IconButton from "@mui/material/IconButton";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ListTableToolbar from "./ListTableToolbar";
import excelInvoice from "../lib/excelLib";
import { sortDate, italianShortDate } from "../lib/dateUtils";
import DownloadIcon from "@mui/icons-material/Download";
import { DataGrid } from "@mui/x-data-grid";

export default function PatientDetail({
  patient,
  invoices,
  openInvoiceDetail,
  createNewInvoice,
}) {
  // invoices: is a subset of appData.invoices, containing only patient's ones.
  if (patient == undefined || invoices == undefined)
    return <p>Patient not found...</p>;
  const res = patient.indirizzoResidenza;
  const rows = invoices.map((i) => ({
    id: i._id,
    ordinal: i.numeroOrdine,
    value: i.valore,
    issueDate: new Date(i.dataEmissione),
    collectDate: new Date(i.dataIncasso),
    ordinalWithYear: `${new Date(i.dataEmissione).getFullYear()}-${String(
      i.numeroOrdine
    ).padStart(10, "0")}`,
  }));
  const columns = [
    {
      field: "id",
      headerName: "ID",
      hide: true,
      width: 220,
    },
    {
      field: "ordinalWithYear",
      headerName: `Numero d'ordine`,
      align: "center",
      headerAlign: "center",
      flex: 0.7,
      renderCell: (params) =>
        `${params.row.ordinal}/${new Date(params.row.issueDate).getFullYear()}`,
    },
    {
      field: "value",
      headerName: "Valore",
      align: "center",
      headerAlign: "center",
      flex: 0.3,
    },
    {
      field: "issueDate",
      headerName: "Data emissione",
      renderCell: (params) => italianShortDate(params.row.issueDate),
      flex: 0.7,
      sortComparator: sortDate,
    },
    {
      field: "collectDate",
      headerName: "Data incasso",
      renderCell: (params) => italianShortDate(params.row.collectDate),
      flex: 0.7,
      sortComparator: sortDate,
    },
    {
      field: "detailView",
      headerName: "Visualizza",
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton onClick={() => openInvoiceDetail(params.row.id)}>
          <InsertDriveFileIcon />
        </IconButton>
      ),
      flex: 0.5,
    },
    {
      field: "download",
      headerName: "Scarica",
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            excelInvoice(
              patient,
              invoices.find((i) => String(i._id) === String(params.row.id))
            );
          }}
        >
          <DownloadIcon />
        </IconButton>
      ),
      flex: 0.5,
    },
  ];
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        sx={{
          mt: 2,
          ml: 2,
          mr: 2,
          p: 4,
          minWidth: "700px",
          maxWidth: "900px",
        }}
      >
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
            {res && res.via && res.civico && (
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
                {patient.luogoNascita.paese &&
                  ` a ${patient.luogoNascita.paese}`}
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
      <Paper
        sx={{ mt: 2, ml: 2, mr: 2, p: 4, minWidth: "700px", maxWidth: "900px" }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Fatture
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight={true}
          disableSelectionOnClick={true}
          components={{
            Toolbar: ListTableToolbar,
          }}
          checkboxSelection={true}
        />
      </Paper>
    </Box>
  );
}
