import * as React from "react";

import { styled } from "@mui/material/styles";
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
import { DContext } from "./DContext";
import { ToggleDContext } from "./SwitchDContext";
import { YearContext } from "../components/YearContext";

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

export default function Layout({ children }) {
  const [open, setOpen] = React.useState(false);
  // const [open, setOpen] = React.useState(window.innerWidth > 1200);
  const [d, setD] = React.useState(false);
  const [selectedYears, setSelectedYears] = React.useState([
    new Date().getFullYear(),
  ]);
  const { user, error, isLoading } = useUser();

  function switchd() {
    setD(!d);
  }

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const yearContext = [selectedYears, setSelectedYears];

  React.useEffect(() => {
    const autoOpenOrCloseDrawer = () => {
      if (window.innerWidth > 1200) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };
    // Verifica se il codice è eseguito lato client prima di utilizzare window
    if (typeof window !== "undefined") {
      if (window.innerWidth > 1200) {
        setOpen(true);
      }
      window.addEventListener("resize", autoOpenOrCloseDrawer);
    }
    return () => window.removeEventListener("resize", autoOpenOrCloseDrawer);
  }, []);

  return (
    <DContext.Provider value={d}>
      <YearContext.Provider value={yearContext}>
        <Box sx={{ display: "flex" }}>
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
              <SearchField />
              <ToggleDContext.Provider value={switchd}>
                <DarkThemeToggler />
              </ToggleDContext.Provider>
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
      </YearContext.Provider>
    </DContext.Provider>
  );
}
