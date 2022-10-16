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
      patient,
      invoice: i,
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
      field: "patient",
      headerName: "Paziente",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          onClick={() => openPatientDetail(params.row.patient._id)}
        >
          {`${params.row.patient.cognome} ${params.row.patient.nome}`}
        </Button>
      ),
    },
    {
      field: "value",
      headerName: "Valore",
      align: "center",
      headerAlign: "center",
      flex: 0.3,
      renderCell: (params) => params.row.invoice.valore,
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
      field: "detailView",
      headerName: "Visualizza",
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton onClick={() => openInvoiceDetail(params.row.invoice._id)}>
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
            excelInvoice(params.row.patient, params.row.invoice);
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
