import * as React from "react";
import { useRouter } from "next/router";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItems from "./listItems";
import DarkThemeToggler from "./DarkThemeToggler";
import { useUser } from "../lib/hooks";
import SearchField from "./SearchField";
import { usePatients } from "../lib/hooks";

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

export default function Layout({ children }) {
  const [lightTheme, setLightTheme] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [d, setD] = React.useState(false);
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const { patients } = usePatients();

  console.log(patients, patients === undefined);

  const switchd = () => setD((d) => !d);

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
            {!error && (
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
            )}
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              il Salice
            </Typography>
            {/* TODO: INTRODURRE NUOVAMENTE BARRA DI RICERCA!! */}
            <SearchField
              optionList={patients?.map((p) => ({
                label: `${p.nome} ${p.cognome}`,
                _id: p._id,
              }))}
              openPatientDetail={(id) => {
                router.push(`/patients/${id}`);
              }}
              disabled={patients === undefined}
            />
            {!error && (
              <IconButton onClick={() => switchd()}>
                <MenuIcon />
                {d ? "true" : "false"}
              </IconButton>
            )}
            {!error && <p>{user?.fullName}</p>}
            <DarkThemeToggler onClick={toggleLightTheme} isLight={lightTheme} />
          </Toolbar>
        </AppBar>
        {!error && (
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
              <ListItems />
            </List>
          </Drawer>
        )}
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
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
