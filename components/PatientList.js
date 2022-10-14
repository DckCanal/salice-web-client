import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { DataGrid } from "@mui/x-data-grid";
import ListTableToolbar from "./ListTableToolbar";
import PostAddIcon from "@mui/icons-material/PostAdd";
import IconButton from "@mui/material/IconButton";
import { sortDate, italianShortDate } from "../lib/dateUtils";

/*
  EnhancedTable. Field to show:
    - nome cognome
    - ultimaModifica
    - lastYear invoice amount
    - email (mailto link)
    - telefono (WhatsApp link)
    - prezzo

  Can be ordered by:
    - cognome
    - ultimaModifica
    - lastYear invoice amount
    - prezzo
*/

// TODO: correct whatsapp link

export default function PatientList({
  patients,
  openPatientDetail,
  createNewInvoice,
}) {
  const columns = [
    { field: "id", headerName: "ID", hide: true, width: 220 },
    {
      field: "newInvoice",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            createNewInvoice(params.row.id);
          }}
        >
          <PostAddIcon />
        </IconButton>
      ),
    },
    {
      field: "paziente",
      headerName: "Paziente",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          onClick={() => openPatientDetail(params.row.id)}
        >{`${params.row.paziente}`}</Button>
      ),
    },
    {
      field: "codFisc",
      headerName: "Codice fiscale",
      width: 170,
      sortable: false,
    },
    {
      field: "ultimaModifica",
      headerName: "Ultima fattura",
      renderCell: (params) => italianShortDate(params.row.ultimaModifica),
      flex: 0.75,
      sortComparator: sortDate,
    },
    {
      field: "email",
      headerName: "email",
      sortable: false,
      flex: 1.5,
      renderCell: (params) =>
        params.row.email && (
          <Chip
            component="a"
            variant="filled"
            label={`${params.row.email}`}
            href={`mailto:${params.row.email}`}
            clickable
          />
        ),
    },
    {
      field: "telefono",
      headerName: "Telefono",
      sortable: false,
      flex: 1,
      hide: true,
    },
    {
      field: "prezzo",
      headerName: "Prezzo",
      flex: 0.5,
    },
    {
      field: "fatturatoUltimoAnno",
      headerName: "Fatturato ultimo anno",
      flex: 1,
    },
  ];
  const rows = patients.map((p) => ({
    id: p._id,
    paziente: `${p.cognome} ${p.nome}`,
    codFisc: p.codiceFiscale,
    ultimaModifica: new Date(p.ultimaModifica),
    email: p.email,
    telefono: p.telefono,
    prezzo: p.prezzo,
    fatturatoUltimoAnno: p.fatturatoUltimoAnno,
  }));

  return (
    <Paper sx={{ m: 2, p: 2 }}>
      <Typography variant="h6" component="div" sx={{ mb: 1 }}>
        Pazienti
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight={true}
        disableSelectionOnClick={true}
        // onRowClick={(params) => {
        //   openPatientDetail(params.row.id);
        // }}
        components={{
          Toolbar: ListTableToolbar,
        }}
      />
    </Paper>
  );
}
