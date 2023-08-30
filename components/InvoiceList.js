import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";

import ListTableToolbar from "./ListTableToolbar";
import excelInvoice from "../lib/excelLib";
import { sortDate, italianShortDate } from "../lib/dateUtils";
import { useInvoices, usePatients } from "../lib/hooks";
import { deleteInvoice } from "../lib/controller";
import ErrorBox from "./ErrorBox";

function YearButtonGroup({ years, selectedYears, handleYearsChange }) {
  return (
    <ToggleButtonGroup onChange={handleYearsChange} value={selectedYears}>
      {years.map((y, i) => (
        <ToggleButton key={i} value={i}>{`${y}`}</ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

const Container = ({ children }) => (
  <Box sx={{ width: "100%", height: "90%" }}>
    <Paper sx={{ m: 2, p: 2, height: "95%" }}>{children}</Paper>
  </Box>
);

export default function InvoiceList() {
  const [yearsIndex, setYearsIndex] = React.useState([0]); // TODO: USE CONTEXT!
  const {
    invoices,
    isLoading: isLoadingInvoices,
    error: invoicesError,
  } = useInvoices();
  const {
    patients,
    isLoading: isLoadingPatients,
    error: patientsError,
  } = usePatients();
  const router = useRouter();

  if (isLoadingInvoices || isLoadingPatients)
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            mt: 10,
          }}
        >
          <CircularProgress sx={{ mx: "auto" }} />
        </Box>
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
  if (patientsError)
    return (
      <Container>
        <ErrorBox
          title="Errore nel caricamento dei pazienti"
          text={patientsError}
        />
      </Container>
    );

  const years = invoices
    .reduce((years, invoice) => {
      const year = new Date(invoice.dataEmissione).getFullYear();
      if (!years.includes(year)) return [...years, year];
      return years;
    }, [])
    .sort((y1, y2) => y2 - y1);
  const handleYearsChange = (ev, newYearsIndex) => setYearsIndex(newYearsIndex);
  const rows = invoices
    .filter((i) => {
      const year = new Date(i.dataEmissione).getFullYear();
      const index = years.indexOf(year);
      return yearsIndex.includes(index);
    })
    .map((i) => {
      const patient = patients.find((p) => p._id == i.paziente);
      return {
        id: i._id,
        patient,
        patientName: `${patient.cognome} ${patient.nome}`,
        invoice: i,
        ordinalWithYear: `${new Date(i.dataEmissione).getFullYear()}-${String(
          i.numeroOrdine
        ).padStart(10, "0")}`,
        value: i.valore,
      };
    });

  const columns = [
    {
      field: "id",
      headerName: "ID",
      hide: true,
      width: 220,
    },
    {
      field: "ordinalWithYear",
      headerName: "Numero d'ordine",
      align: "center",
      headerAlign: "center",
      flex: 0.7,
      renderCell: (params) =>
        `${params.row.invoice.numeroOrdine}/${new Date(
          params.row.invoice.dataEmissione
        ).getFullYear()}`,
    },
    {
      field: "patientName",
      headerName: "Paziente",
      flex: 1,
      renderCell: (params) => (
        <Link href={`/patients/${params.row.patient._id}`} passHref>
          <Button variant="text" size="small">
            {`${params.row.patient.cognome} ${params.row.patient.nome}`}
          </Button>
        </Link>
      ),
    },
    {
      field: "value",
      headerName: "Valore",
      align: "center",
      headerAlign: "center",
      flex: 0.3,
      renderCell: (params) => `${params.row.invoice.valore} €`,
    },
    {
      field: "issueDate",
      headerName: "Data emissione",
      renderCell: (params) =>
        italianShortDate(new Date(params.row.invoice.dataEmissione)),
      flex: 0.7,
      sortComparator: sortDate,
    },
    {
      field: "collectDate",
      headerName: "Data incasso",
      renderCell: (params) =>
        italianShortDate(new Date(params.row.invoice.dataIncasso)),
      flex: 0.7,
      sortComparator: sortDate,
    },
    {
      field: "download",
      headerName: "Azioni",
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <>
          {/* <Link href={`/invoices/${params.row.invoice._id}`} passHref>
            <IconButton>
              <VisibilityIcon />
            </IconButton>
          </Link> */}
          <IconButton
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              excelInvoice(params.row.patient, params.row.invoice);
            }}
          >
            <DownloadIcon />
          </IconButton>
          <Link href={`/invoices/update/${params.row.invoice._id}`} passHref>
            <IconButton
            // onClick={(ev) => {
            //   ev.preventDefault();
            //   ev.stopPropagation();
            //   openUpdateInvoice(params.row.invoice, params.row.patient);
            // }}
            >
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              deleteInvoice(params.row.invoice);
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
    <Container>
      <Typography variant="h6" component="div" sx={{ mb: 1 }}>
        Fatture
      </Typography>
      <Box sx={{ mb: 2 }}>
        <YearButtonGroup
          years={years}
          selectedYears={yearsIndex}
          handleYearsChange={handleYearsChange}
        />
      </Box>
      <Box sx={{ height: "85%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={25}
          disableSelectionOnClick={true}
          components={{
            Toolbar: ListTableToolbar,
          }}
          checkboxSelection={true}
          onRowClick={(params) =>
            router.push(`/invoices/${params.row.invoice._id}`)
          }
        />
      </Box>
    </Container>
  );
}
