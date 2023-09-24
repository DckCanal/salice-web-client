import { useContext } from "react";

import { useTheme } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
import IconButton from "@mui/material/IconButton";

import { SwitchThemeContext } from "./ThemeContext";

export default function DarkThemeToggler() {
  const toggleLightTheme = useContext(SwitchThemeContext);
  const theme = useTheme();
  return (
    <IconButton sx={{ ml: 5 }} onClick={toggleLightTheme}>
      {theme.palette.mode === "light" ? (
        <NightlightIcon htmlColor="#ffffff" />
      ) : (
        <LightModeIcon />
      )}
    </IconButton>
  );
}
