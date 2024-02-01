import * as React from "react";
import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { mutate } from "swr";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import CreditScoreIcon from "@mui/icons-material/Payment";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";

import ListTableToolbar from "./ListTableToolbar";
import excelInvoice from "../lib/excelLib";
import { sortDate, italianShortDate } from "../lib/dateUtils";
import { useInvoices, usePatients } from "../lib/hooks";
import { deleteInvoice } from "../lib/controller";
import ErrorBox from "./ErrorBox";
import { YearContext } from "./YearContext";

function YearButtonGroup({ years, selectedYears, handleYearsChange }) {
  return (
    <ToggleButtonGroup onChange={handleYearsChange} value={selectedYears}>
      {years.map((y, i) => (
        <ToggleButton key={i} value={y}>{`${y}`}</ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

const Container = ({ children }) => (
  // <Box sx={{ width: "100%", height: "90%" }}>
  <Paper
    // variant="elevation"
    sx={{
      m: { xs: 0, md: 2 },
      mt: { xs: 0, md: 4 },
      p: 2,
      pt: { xs: 4, md: 2 },

      //height: "85%"
    }}
  >
    {children}
  </Paper>
  /* </Box> */
);

export default function InvoiceList() {
  const [selectedYears, setSelectedYears] = useContext(YearContext);
  const [colVisibilityModel, setColVisibilityModel] = React.useState({
    id: false,
    ordinalWithYear: true,
    patientName: true,
    codFisc: false,
    value: true,
    issueDate: true,
    collectDate: true,
    download: true,
  });
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

  React.useEffect(() => {
    const toggleColVisibilityOnResize = () => {
      if (window.innerWidth < 800) {
        setColVisibilityModel((_) => {
          return {
            id: false,
            ordinalWithYear: true,
            patientName: true,
            codFisc: false,
            value: true,
            issueDate: true,
            collectDate: false,
            download: false,
          };
        });
      } else if (window.innerWidth < 1200) {
        setColVisibilityModel((_) => {
          return {
            id: false,
            ordinalWithYear: true,
            patientName: true,
            codFisc: false,
            value: true,
            issueDate: true,
            collectDate: false,
            download: false,
          };
        });
      } else {
        setColVisibilityModel((_) => {
          return {
            id: false,
            ordinalWithYear: true,
            patientName: true,
            codFisc: false,
            value: true,
            issueDate: true,
            collectDate: true,
            download: true,
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

  if (invoicesError)
    return (
      <Container>
        <ErrorBox
          title="Errore nel caricamento delle fatture"
          text={invoicesError?.message}
        />
      </Container>
    );
  if (patientsError)
    return (
      <Container>
        <ErrorBox
          title="Errore nel caricamento dei pazienti"
          text={patientsError?.message}
        />
      </Container>
    );

  if (
    isLoadingInvoices ||
    isLoadingPatients ||
    invoices === undefined ||
    patients === undefined
  )
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

  const years = invoices
    .reduce((years, invoice) => {
      const year = new Date(invoice.dataEmissione).getFullYear();
      if (!years.includes(year)) return [...years, year];
      return years;
    }, [])
    .sort((y1, y2) => y2 - y1);
  const handleYearsChange = (_ev, years) => {
    setSelectedYears(years);
  };
  const rows = invoices
    .filter((i) => {
      const year = new Date(i.dataEmissione).getFullYear();
      return selectedYears.includes(year);
    })
    .map((i) => {
      const patient = patients.find((p) => p._id == i.paziente);
      return {
        id: i._id,
        patient,
        patientName: `${patient.cognome} ${patient.nome}`,
        codFisc: patient.codiceFiscale,
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
      width: 220,
    },
    {
      field: "ordinalWithYear",
      headerName: "Numero",
      align: "center",
      headerAlign: "center",
      flex: 0.4,
      valueFormatter: ({ value }) => {
        const [year, number] = value.split("-");
        return `${Number.parseInt(number)}/${year}`;
      },
      renderCell: (params) => (
        <Link href={`/invoices/${params.row.invoice._id}`} passHref>
          <Button variant="text" size="small">
            {`${params.row.invoice.numeroOrdine}/${new Date(
              params.row.invoice.dataEmissione
            ).getFullYear()}`}
          </Button>
        </Link>
      ),
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
      field: "codFisc",
      headerName: "Codice fiscale",
      flex: 1,
      renderCell: (params) =>
        params.row.patient.codiceFiscale ? (
          <Tooltip title="Copia" enterDelay={300} arrow>
            <Chip
              color="primary"
              variant="outlined"
              label={params.row.patient.codiceFiscale}
              onClick={() =>
                navigator.clipboard.writeText(params.row.patient.codiceFiscale)
              }
              sx={{ my: 1 }}
            />
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      field: "value",
      headerName: "Valore",
      align: "right",
      headerAlign: "center",
      flex: 0.3,
      minWidth: 80,

      renderCell: (params) => (
        <>
          {`${params.row.invoice.valore} €`}
          {params.row.invoice.pagamentoTracciabile ? (
            <Tooltip title="Pagamento tracciabile" arrow>
              <CreditScoreIcon fontSize="small" sx={{ ml: 1 }} />
            </Tooltip>
          ) : (
            <Tooltip title="Pagamento non tracciabile" arrow>
              <CreditCardOffIcon fontSize="small" sx={{ ml: 1 }} />
            </Tooltip>
          )}
        </>
      ),
    },
    {
      field: "issueDate",
      headerName: "Data emissione",
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
      valueGetter: (params) => Date.parse(params.row.invoice.dataEmissione),
      renderCell: (params) =>
        italianShortDate(new Date(params.row.invoice.dataEmissione)),
      flex: 0.7,
      sortComparator: sortDate,
    },
    {
      field: "collectDate",
      headerName: "Data incasso",
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
      valueGetter: (params) => Date.parse(params.row.invoice.dataIncasso),
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
          <Link href={`/invoices/update/${params.row.invoice._id}`} passHref>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              //deleteInvoice(params.row.invoice);
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
    <Container>
      <Typography variant="h6" component="div" sx={{ mb: 1 }}>
        Fatture
      </Typography>
      {/* <Box sx={{ mb: { xs: 0, md: 2 } }}> */}
      <Box>
        <YearButtonGroup
          years={years}
          selectedYears={selectedYears}
          handleYearsChange={handleYearsChange}
        />
      </Box>
      {/* <Box
      </Container>sx={{ height: "70%" }}
      > */}
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        density="compact"
        columnVisibilityModel={colVisibilityModel}
        onColumnVisibilityModelChange={(newModel) =>
          setColVisibilityModel(newModel)
        }
        pageSize={25}
        disableSelectionOnClick={true}
        components={{
          Toolbar: ListTableToolbar,
        }}
        // slotProps={{
        //   toolbar: { csvOptions: { allColumns: true, fields: ["id"] } },
        // }}
        checkboxSelection={false}
        // onRowClick={(params) =>
        //   router.push(`/invoices/${params.row.invoice._id}`)
        // }
      />
      {/* </Box> */}
    </Container>
  );
}
