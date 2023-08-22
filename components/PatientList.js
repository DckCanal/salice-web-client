import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { DataGrid } from "@mui/x-data-grid";
import ListTableToolbar from "./ListTableToolbar";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { sortDate, italianShortDate } from "../lib/dateUtils";

/*
  PatientList. Field to show:
    - nome cognome
    - codiceFiscale
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

  Actions: 
    - create new Invoice
    - TODO: modify patient
    - send email
*/

// TODO: correct whatsapp link

export default function PatientList({
  patients,
  openUpdatePatient,
  deletePatient,
}) {
  const router = useRouter();
  const columns = [
    { field: "id", headerName: "ID", hide: true, width: 220 },

    {
      field: "paziente",
      headerName: "Paziente",
      flex: 1,
      //sortComparator: (a, b) => a.localeCompare(b),
      renderCell: (params) => (
        <Link href={`/patients/${params.row.id}`} passHref>
          <Button
            variant="text"
            size="small"
            //onClick={() => openPatientDetail(params.row.id)}
          >{`${params.row.patient.cognome} ${params.row.patient.nome}`}</Button>
        </Link>
      ),
    },
    {
      field: "codFisc",
      headerName: "Codice fiscale",
      width: 170,
      sortable: false,
      renderCell: (params) => params.row.patient.codiceFiscale,
    },
    {
      field: "ultimaModifica",
      headerName: "Ultima fattura",
      renderCell: (params) =>
        italianShortDate(new Date(params.row.patient.ultimaModifica)),
      flex: 0.75,
      sortComparator: sortDate,
    },
    {
      field: "email",
      headerName: "email",
      sortable: false,
      flex: 1.5,
      renderCell: (params) =>
        params.row.patient.email && (
          <Chip
            component="a"
            variant="filled"
            label={`${params.row.patient.email}`}
            href={`mailto:${params.row.patient.email}`}
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
      renderCell: (params) => params.row.patient.telefono,
    },
    {
      field: "prezzo",
      headerName: "Prezzo",
      flex: 0.5,
      renderCell: (params) => `${params.row.patient.prezzo} €`,
    },
    {
      field: "fatturatoUltimoAnno",
      headerName: "Fatturato ultimo anno",
      flex: 1,
      renderCell: (params) => `${params.row.patient.fatturatoUltimoAnno} €`,
    },
    {
      field: "actions",
      headerName: "Azioni",
      width: 150,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              //createNewInvoice(params.row.id);
              router.push(`/newInvoice/${params.row.id}`);
            }}
          >
            <PostAddIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              alert("TODO: download documents");
            }}
          >
            <HistoryEduIcon />
          </IconButton>
          <IconButton
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              openUpdatePatient(params.row.patient);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              deletePatient(params.row.patient);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  const rows = patients.map((p) => ({
    id: p._id,
    patient: p,
    paziente: `${p.cognome} ${p.nome}`,
    prezzo: p.prezzo,
    fatturatoUltimoAnno: p.fatturatoUltimoAnno,
  }));

  return (
    <Paper sx={{ m: 2, p: 2, height: "90%" }}>
      <Typography variant="h6" component="div" sx={{ mb: 1 }}>
        Pazienti
      </Typography>
      <Box sx={{ height: "90%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={25}
          disableSelectionOnClick={true}
          components={{
            Toolbar: ListTableToolbar,
          }}
          onRowClick={(params) => router.push(`/patients/${params.row.id}`)}
        />
      </Box>
    </Paper>
  );
}
