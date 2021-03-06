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
        //val && console.log(val.label, val._id);
        return;
      }}
      renderInput={(params) => (
        <TextField
          //   type="search"
          variant="standard"
          label="Paziente"
          {...params}
        />
      )}
    />
  );
}
