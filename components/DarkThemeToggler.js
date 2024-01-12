import { useContext } from "react";
import { useCallback } from "react";

import { useTheme } from "@mui/material";
import { useLongPress } from "use-long-press";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
import IconButton from "@mui/material/IconButton";

import { SwitchThemeContext } from "./ThemeContext";
import { ToggleDContext } from "./SwitchDContext";

export default function DarkThemeToggler() {
  const toggleLightTheme = useContext(SwitchThemeContext);
  const switchd = useContext(ToggleDContext);
  const handleLongPress = useCallback(() => {
    switchd();
  });
  const theme = useTheme();
  const longPressProps = useLongPress(handleLongPress, {
    isPreventDefault: true,
    threshold: 2000, // Modifica il valore del ritardo a tuo piacimento
    onCancel: toggleLightTheme,
  });

  return (
    <IconButton {...longPressProps()} sx={{ ml: 5 }}>
      {theme.palette.mode === "light" ? (
        <NightlightIcon htmlColor="#ffffff" />
      ) : (
        <LightModeIcon />
      )}
    </IconButton>
  );
}
