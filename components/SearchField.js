import { TextField, Autocomplete, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchField({ optionList }) {
  return (
    <Autocomplete
      disablePortal
      clearOnEscape
      isOptionEqualToValue={(option, value) => option._id === value._id}
      //   autoComplete
      id="patient-list"
      options={optionList}
      sx={{ width: 300 }}
      onChange={(ev, val) => {
        return;
      }}
      renderInput={(params) => (
        <TextField variant="standard" label="Paziente" {...params} />
      )}
    />
  );
}
