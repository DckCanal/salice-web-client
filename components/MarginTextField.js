import { TextField } from "@mui/material";
export default function MarginTextField(params) {
  return <TextField {...params} sx={{ m: 3, minWidth: "80%" }} />;
}
