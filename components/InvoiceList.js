import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ListTableToolbar from "./ListTableToolbar";
import excelInvoice from "../lib/excelLib";
import { sortDate, italianShortDate } from "../lib/dateUtils";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";

export default function InvoiceList({
  invoices,
  patients,
  deleteInvoice,
  openInvoiceDetail,
  openPatientDetail,
  openUpdateInvoice,
}) {
  const rows = invoices.map((i) => {
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
        <Button
          variant="text"
          size="small"
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            openPatientDetail(params.row.patient._id);
          }}
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
          <IconButton
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              excelInvoice(params.row.patient, params.row.invoice);
            }}
          >
            <DownloadIcon />
          </IconButton>
          <IconButton
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              openUpdateInvoice(params.row.invoice, params.row.patient);
            }}
          >
            <EditIcon />
          </IconButton>
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
          onRowClick={(params) => openInvoiceDetail(params.row.invoice._id)}
        />
      </Paper>
    </Box>
  );
}
