import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { DataGrid } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { CircularProgress } from "@mui/material";

import ListTableToolbar from "./ListTableToolbar";
import ErrorBox from "./ErrorBox";
import { sortDate, italianShortDate } from "../lib/dateUtils";
import { deletePatient } from "../lib/controller";
import { usePatients } from "../lib/hooks";

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
    - modify patient
    - send email
*/

// TODO: correct whatsapp link

const Container = ({ children }) => (
  <Paper sx={{ m: 2, p: 2, height: "90%" }}>{children}</Paper>
);

export default function PatientList() {
  const router = useRouter();
  const { patients, isLoading, error } = usePatients();

  const [colVisibilityModel, setColVisibilityModel] = React.useState({
    id: false,
    paziente: true,
    codFisc: false,
    ultimaModifica: true,
    email: true,
    telefono: false,
    prezzo: true,
    fatturatoUltimoAnno: true,
    actions: true,
  });

  React.useEffect(() => {
    const toggleColVisibilityOnResize = () => {
      if (window.innerWidth < 800) {
        setColVisibilityModel((_) => {
          return {
            id: false,
            paziente: true,
            codFisc: false,
            ultimaModifica: true,
            email: false,
            telefono: false,
            prezzo: true,
            fatturatoUltimoAnno: false,
            actions: false,
          };
        });
      } else if (window.innerWidth < 1200) {
        setColVisibilityModel((_) => {
          return {
            id: false,
            paziente: true,
            codFisc: false,
            ultimaModifica: true,
            email: true,
            telefono: false,
            prezzo: true,
            fatturatoUltimoAnno: true,
            actions: false,
          };
        });
      } else {
        setColVisibilityModel((_) => {
          return {
            id: false,
            paziente: true,
            codFisc: false,
            ultimaModifica: true,
            email: true,
            telefono: false,
            prezzo: true,
            fatturatoUltimoAnno: true,
            actions: true,
          };
        });
      }
    };
    if (typeof window !== "undefined") {
      toggleColVisibilityOnResize();
    }
    window.addEventListener("resize", toggleColVisibilityOnResize);
    return () =>
      window.removeEventListener("resize", toggleColVisibilityOnResize);
  }, []);

  if (isLoading)
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            mt: 15,
          }}
        >
          <CircularProgress sx={{ mx: "auto" }} />
        </Box>
      </Container>
    );
  if (error)
    return (
      <Container>
        <ErrorBox title="Errore nel caricamento dei pazienti" text={error} />
      </Container>
    );
  const columns = [
    { field: "id", headerName: "ID", width: 220 },

    {
      field: "paziente",
      headerName: "Paziente",
      flex: 1,
      renderCell: (params) => (
        <Link href={`/patients/${params.row.id}`} passHref>
          <Button
            variant="text"
            size="small"
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
      width: 180,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <>
          <Link href={`/newInvoice/${params.row.id}`} passHref>
            <IconButton>
              <PostAddIcon />
            </IconButton>
          </Link>
          <IconButton
            onClick={() => {
              alert("TODO: download documents");
            }}
          >
            <HistoryEduIcon />
          </IconButton>
          <Link href={`/patients/update/${params.row.patient._id}`} passHref>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
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
    <Container>
      <Typography variant="h6" component="div" sx={{ mb: 1 }}>
        Pazienti
      </Typography>
      <Box sx={{ height: "90%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          columnVisibilityModel={colVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColVisibilityModel(newModel)
          }
          pageSize={25}
          disableSelectionOnClick={true}
          components={{
            Toolbar: ListTableToolbar,
          }}
          onRowClick={(params) => router.push(`/patients/${params.row.id}`)}
        />
      </Box>
    </Container>
  );
}
