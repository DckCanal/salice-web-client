import { TextField, Autocomplete, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchField({ optionList, openPatientDetail }) {
  return (
    <Autocomplete
      disablePortal
      clearOnEscape
      autoHighlight
      isOptionEqualToValue={(option, value) => option._id === value._id}
      autoComplete
      id="patient-list"
      options={optionList}
      sx={{ width: 300 }}
      onChange={(ev, val) => {
        if (val == null) return;
        openPatientDetail(val._id);
        return;
      }}
      renderInput={(params) => (
        <TextField variant="filled" label="Paziente" autoFocus={true} {...params} />
      )}
    />
  );
}
