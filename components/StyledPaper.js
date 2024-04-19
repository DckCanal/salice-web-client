import Paper from "@mui/material/Paper";
import { useTheme } from "@emotion/react";
export default function StyledPaper({ children, sx }) {
  const theme = useTheme();
  return (
    <Paper
      variant="outlined"
      sx={{ bgcolor: theme.palette.mode === "light" ? "#fff" : "#000", ...sx }}
    >
      {children}
    </Paper>
  );
}
