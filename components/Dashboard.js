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

// TODO: become DashboardContainer
// TODO: pass a 'children' prop
function DashboardContent({ invoices, patients, dataManager }) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState("Home");
  const [lightTheme, setLightTheme] = React.useState(false);
  const switchContent = () => {
    if (view === "Home")
      return (
        <Home lightTheme={lightTheme} invoices={invoices} patients={patients} />
      );
    if (view === "InvoiceList")
      return (
        <InvoiceList
          invoices={invoices}
          patients={patients}
          dataManager={dataManager}
        />
      );
    if (view === "PatientList")
      return <PatientList invoices={invoices} patients={patients} />;
    if (view === "Graph")
      return <Graph invoices={invoices} patients={patients} />;
    if (view === "NewInvoice")
      return (
        <NewInvoiceView
          patients={patients}
          addInvoice={dataManager.addInvoice}
        />
      );
    if (view === "NewPatient")
      return <NewPatientView addPatient={dataManager.addPatient} />;
  };
  // const listItemMap = {
  //   1: "Home",
  //   2: "InvoiceList",
  //   3: "PatientList",
  //   4: "Graph",
  //   5: "AggregateMonth",
  //   6: "Aggregate4Months",
  //   7: "AggregateYear",
  // };
  const getListItemKey = (view) => {
    if (view === "Home") return 1;
    if (view === "InvoiceList") return 2;
    if (view === "PatientList") return 3;
    if (view === "Graph") return 4;
    if (view === "NewInvoice") return 5;
    if (view === "NewPatient") return 6;
  };
  const listItemClickHandler = (view) => {
    return function (event) {
      event.preventDefault();
      setView(view);
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
          {
            // TODO: render the 'children' component
          }
          {/* --- MAIN CONTENT ---  */}
          {switchContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard({ invoices, patients, dataManager }) {
  return (
    // TODO: pass the Home component as first children
    <DashboardContent
      invoices={invoices}
      patients={patients}
      dataManager={dataManager}
    />
  );
}
