import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
import IconButton from "@mui/material/IconButton";
export default function DarkThemeToggler({ onClick, isLight }) {
  return (
    <IconButton sx={{ ml: 5 }} onClick={onClick}>
      {isLight ? <NightlightIcon /> : <LightModeIcon />}
    </IconButton>
  );
}
