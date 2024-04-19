import * as React from "react";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import DarkThemeToggler from "./DarkThemeToggler";
import { useUser } from "../lib/hooks";

export default function SignInLayout({ children }) {
  const { user, error, isLoading, mutate, loggedOut } = useUser();

  const router = useRouter();

  React.useEffect(() => {
    if (user && !loggedOut) {
      router.replace("/dashboard");
    }
  }, [user, loggedOut, router]);

  return (
    <Box sx={{ display: "flex" }}>
      <MuiAppBar position="absolute">
        <Toolbar
          sx={{
            // pr: "24px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
            }}
          >
            il Salice
          </Typography>

          <DarkThemeToggler />
        </Toolbar>
      </MuiAppBar>
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
  );
}
