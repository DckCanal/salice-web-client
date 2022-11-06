import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Home from "./Home";
import PatientList from "./PatientList";
import InvoiceList from "./InvoiceList";
import Graph from "./Graph";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItems from "./listItems";
import SearchField from "./SearchField";
import DarkThemeToggler from "./DarkThemeToggler";
import NewInvoiceView from "./NewInvoiceView";
import NewPatientView from "./NewPatientView";
import PatientDetail from "./PatientDetail";
import InvoiceDetail from "./InvoiceDetail";
import UpdateInvoiceView from "./UpdateInvoiceView";
import UpdatePatientView from "./UpdatePatientView";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function DashboardContent({ invoices, patients, dataManager, switchd, d }) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState({
    page: "Home",
    selectedPatient: undefined,
    selectedInvoice: undefined,
  });
  const [lightTheme, setLightTheme] = React.useState(false);
  const openHome = () => {
    setView({
      page: "Home",
      selectedInvoice: undefined,
      selectedPatient: undefined,
    });
  };
  const openPatientDetail = (id) => {
    setView({
      page: "PatientDetail",
      selectedPatient: patients.find((p) => String(p._id) === String(id)),
      selectedInvoice: undefined,
    });
  };
  const openInvoiceDetail = (id) => {
    setView({
      page: "InvoiceDetail",
      selectedInvoice: invoices.find((i) => String(i._id) === String(id)),
      selectedPatient: undefined,
    });
  };
  const openUpdateInvoice = (invoice, patient) => {
    setView({
      page: "UpdateInvoice",
      selectedInvoice: invoice,
      selectedPatient: patient,
    });
  };
  const openUpdatePatient = (patient) => {
    setView({
      page: "UpdatePatient",
      selectedInvoice: undefined,
      selectedPatient: patient,
    });
  };
  const createNewInvoice = (patientId) => {
    setView({
      ...view,
      page: "NewInvoice",
      selectedPatient: patientId,
      selectedInvoice: undefined,
    });
  };
  const switchContent = () => {
    if (view.page === "Home")
      return (
        <Home
          lightTheme={lightTheme}
          invoices={invoices}
          patients={patients}
          openPatientDetail={openPatientDetail}
        />
      );
    if (view.page === "InvoiceList")
      return (
        <InvoiceList
          invoices={invoices}
          patients={patients}
          dataManager={dataManager}
          openInvoiceDetail={openInvoiceDetail}
          openPatientDetail={openPatientDetail}
          openUpdateInvoice={openUpdateInvoice}
          deleteInvoice={dataManager.removeInvoice}
        />
      );
    if (view.page === "PatientList")
      return (
        <PatientList
          patients={patients}
          openPatientDetail={openPatientDetail}
          createNewInvoice={createNewInvoice}
          openUpdatePatient={openUpdatePatient}
          deletePatient={dataManager.removePatient}
        />
      );
    if (view.page === "Graph")
      return <Graph invoices={invoices} patients={patients} />;
    if (view.page === "NewInvoice")
      return (
        <NewInvoiceView
          patients={patients}
          addInvoice={dataManager.addInvoice}
          selectedPatient={view.selectedPatient}
          openNextView={() => setView({ ...view, page: "InvoiceList" })}
          d={d}
        />
      );
    if (view.page === "NewPatient")
      return <NewPatientView addPatient={dataManager.addPatient} />;
    if (view.page === "PatientDetail")
      return (
        <PatientDetail
          patient={view.selectedPatient}
          invoices={invoices.filter(
            (i) => String(i.paziente) === String(view.selectedPatient._id)
          )}
          openInvoiceDetail={openInvoiceDetail}
          createNewInvoice={createNewInvoice}
          openUpdateInvoice={openUpdateInvoice}
          openUpdatePatient={openUpdatePatient}
          deletePatient={dataManager.removePatient}
          deleteInvoice={dataManager.removeInvoice}
          openHome={openHome}
        />
      );
    if (view.page === "InvoiceDetail")
      return (
        <InvoiceDetail
          invoice={view.selectedInvoice}
          patient={patients.find(
            (p) => String(p._id) === String(view.selectedInvoice?.paziente)
          )}
          openPatientDetail={openPatientDetail}
          openUpdateInvoice={openUpdateInvoice}
          deleteInvoice={dataManager.removeInvoice}
          openHome={openHome}
        />
      );

    if (view.page === "UpdateInvoice")
      return (
        <UpdateInvoiceView
          invoice={view.selectedInvoice}
          patient={view.selectedPatient}
          updateInvoice={dataManager.updateInvoice}
          deleteInvoice={dataManager.removeInvoice}
          openNextView={() =>
            setView({
              page: "InvoiceList",
              selectedInvoice: undefined,
              selectedPatient: undefined,
            })
          }
        />
      );

    if (view.page === "UpdatePatient")
      return (
        <UpdatePatientView
          patient={view.selectedPatient}
          openNextView={() =>
            setView({
              page: "PatientList",
              selectedInvoice: undefined,
              selectedPatient: undefined,
            })
          }
          updatePatient={dataManager.updatePatient}
          deletePatient={dataManager.removePatient}
        />
      );
  };

  const getListItemKey = (view) => {
    if (view.page === "Home") return 1;
    if (view.page === "InvoiceList") return 2;
    if (view.page === "PatientList") return 3;
    if (view.page === "Graph") return 4;
    if (view.page === "NewInvoice") return 5;
    if (view.page === "NewPatient") return 6;
    if (view.page === "PatientDetail") return 7;
    if (view.page === "InvoiceDetail") return 8;
  };
  const listItemClickHandler = (viewPage) => {
    return function (event) {
      event.preventDefault();
      setView({
        ...view,
        page: viewPage,
        selectedInvoice: undefined,
        selectedPatient: undefined,
      });
    };
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const toggleLightTheme = () => {
    setLightTheme(!lightTheme);
  };

  return (
    <ThemeProvider theme={lightTheme ? mdTheme : darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              il Salice
            </Typography>
            <SearchField
              optionList={patients.map((p) => ({
                label: `${p.nome} ${p.cognome}`,
                _id: p._id,
              }))}
            />
            <DarkThemeToggler onClick={toggleLightTheme} isLight={lightTheme} />
            <IconButton onClick={() => switchd()}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItems
              sel={getListItemKey(view)}
              clickHandler={listItemClickHandler}
            />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          {/* --- MAIN CONTENT ---  */}
          {switchContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard({
  invoices,
  patients,
  dataManager,
  switchd,
  d,
}) {
  return (
    <DashboardContent
      invoices={invoices}
      patients={patients}
      dataManager={dataManager}
      switchd={switchd}
      d={d}
    />
  );
}
