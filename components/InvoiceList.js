import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ListTableToolbar from "./ListTableToolbar";
import excelInvoice from "../lib/excelLib";
import { sortDate, italianShortDate } from "../lib/dateUtils";
import DownloadIcon from "@mui/icons-material/Download";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";

export default function InvoiceList({
  invoices,
  patients,
  dataManager,
  openInvoiceDetail,
  openPatientDetail,
}) {
  const rows = invoices.map((i) => {
    const patient = patients.find((p) => p._id == i.paziente);
    return {
      id: i._id,
      ordinal: i.numeroOrdine,
      patient: `${patient.cognome} ${patient.nome}`,
      patientId: patient._id,
      value: i.valore,
      issueDate: new Date(i.dataEmissione),
      collectDate: new Date(i.dataIncasso),
      patientObj: patient,
      invoiceObj: i,
      ordinalWithYear: `${new Date(i.dataEmissione).getFullYear()}-${String(
        i.numeroOrdine
      ).padStart(10, "0")}`,
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
      field: "patientObj",
      hide: true,
    },
    {
      field: "invoiceObj",
      hide: true,
    },
    {
      field: "ordinalWithYear",
      headerName: "Numero d'ordine",
      align: "center",
      headerAlign: "center",
      flex: 0.7,
      renderCell: (params) =>
        `${params.row.ordinal}/${new Date(params.row.issueDate).getFullYear()}`,
    },
    {
      field: "ordinal",
      hide: true,
    },
    {
      field: "patient",
      headerName: "Paziente",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          onClick={() => openPatientDetail(params.row.patientId)}
        >
          {`${params.row.patient}`}
        </Button>
      ),
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
            excelInvoice(params.row.patientObj, params.row.invoiceObj);
          }}
        >
          <DownloadIcon />
        </IconButton>
      ),
      flex: 0.5,
    },
  ];
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ m: 2, p: 2 }}>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
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
