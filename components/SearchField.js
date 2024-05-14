'use client';
import { useRouter } from "next/router";
import { TextField, Autocomplete } from "@mui/material";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";

import { usePatients } from "../lib/hooks";

export default function SearchField() {
  const theme = useTheme();
  const router = useRouter();
  const { patients, error, isLoading } = usePatients();
  const optionList = patients
    ? patients.map((p) => ({
        label: `${p.nome} ${p.cognome}`,
        _id: p._id,
      }))
    : [];
  return (
    <ThemeProvider
      theme={createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          highlight: { main: "#ffffff" },
        },
      })}
    >
      <Autocomplete
        disablePortal
        clearOnEscape
        autoHighlight
        isOptionEqualToValue={(option, value) => option._id === value._id}
        autoComplete
        id="patient-list"
        options={optionList}
        sx={{ width: 300 }}
        onChange={(_ev, val) => {
          if (val == null) return;
          router.push(`/patients/${val._id}`);
          return;
        }}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            size="small"
            label="Paziente"
            margin="normal"
            color="highlight"
            autoFocus={true}
            {...params}
          />
        )}
        disabled={error !== undefined || isLoading}
      />
    </ThemeProvider>
  );
}
