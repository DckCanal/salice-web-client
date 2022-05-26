import { Paper } from "@mui/material";
export default function FormPaper(params) {
  return (
    <Paper
      {...params}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 600,
        padding: 3,
        margin: 3,
      }}
    />
  );
}
