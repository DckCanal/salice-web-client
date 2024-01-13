import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { mutate } from "swr";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import Chip from "@mui/material/Chip";
import DownloadIcon from "@mui/icons-material/Download";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress } from "@mui/material";

import ListTableToolbar from "./ListTableToolbar";
import excelInvoice from "../lib/excelLib";
import { sortDate, italianShortDate } from "../lib/dateUtils";
import { deleteInvoice, deletePatient } from "../lib/controller";
import { useInvoices, usePatient } from "../lib/hooks";
import ErrorBox from "./ErrorBox";

const Container = ({ children }) => (
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
        p: 4,
        maxWidth: "700px",
        width: { xs: "100%", sm: "96%" },
      }}
    >
      {children}
    </Paper>
  </Box>
);

export default function PatientDetail({ id }) {
  const router = useRouter();
  const {
    patient,
    isLoading: isLoadingPatient,
    error: patientError,
  } = usePatient(id);
  const {
    invoices,
    isLoading: isLoadingInvoices,
    error: invoicesError,
  } = useInvoices();

  if (isLoadingInvoices || isLoadingPatient)
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
          }}
        >
          <CircularProgress sx={{ mx: "auto" }} />
        </Box>
      </Container>
    );

  if (patientError)
    return (
      <Container>
        <ErrorBox
          title="Errore nel caricamento del paziente"
          text={patientError}
        />
      </Container>
    );
  if (invoicesError)
    return (
      <Container>
        <ErrorBox
          title="Errore nel caricamento delle fatture"
          text={invoicesError}
        />
      </Container>
    );

  const res = patient.indirizzoResidenza;
  const rows = invoices
    .filter((i) => String(i.paziente) === String(patient._id))
    .map((i) => ({
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
      field: "actions",
      headerName: "Azioni",
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <IconButton
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              excelInvoice(
                patient,
                invoices.find((i) => String(i._id) === String(params.row.id))
              );
            }}
          >
            <DownloadIcon />
          </IconButton>
          <Link href={`/invoices/update/${params.row.id}`} passHref>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              mutate("/api/invoices", deleteInvoice(params.row.id), {
                revalidate: false,
                populateCache: (_res, cacheData) => {
                  return {
                    ...cacheData,
                    data: {
                      ...cacheData.data,
                      invoices: cacheData.data.invoices.filter(
                        (i) => String(i._id) !== String(params.row.id)
                      ),
                    },
                  };
                },
              });
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
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
          p: 4,
          maxWidth: "700px",
          width: { xs: "100%", sm: "96%" },
        }}
      >
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Typography variant="h5">
            {patient.cognome.toUpperCase()} {patient.nome}
          </Typography>
          <Box>
            <Link href={`/newInvoice/${patient._id}`} passHref>
              <IconButton>
                <PostAddIcon />
              </IconButton>
            </Link>
            <Link href={`/patients/update/${patient._id}`} passHref>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Link>

            <IconButton
              onClick={() => {
                alert("TODO: download documents");
              }}
            >
              <HistoryEduIcon />
            </IconButton>
            <IconButton
              onClick={async (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                try {
                  const res = await deletePatient(patient);
                  if (res) router.push("/dashboard");
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: { xs: "flex-start", sm: "flex-end" },
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
                  <Chip
                    component="a"
                    variant="filled"
                    label={`${patient.email}`}
                    href={`mailto:${patient.email}`}
                    clickable
                  />
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
          onRowClick={(params) => {
            router.push(`/invoices/${params.row.id}`);
          }}
        />
      </Paper>
    </Box>
  );
}
