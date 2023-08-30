import { useRouter } from "next/router";
import { TextField, Autocomplete } from "@mui/material";
import { usePatients } from "../lib/hooks";

export default function SearchField() {
  const router = useRouter();
  const { patients, error, isLoading } = usePatients();
  const optionList = patients?.map((p) => ({
    label: `${p.nome} ${p.cognome}`,
    _id: p._id,
  }));
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
      onChange={(_ev, val) => {
        if (val == null) return;
        router.push(`/patients/${val._id}`);
        return;
      }}
      renderInput={(params) => (
        <TextField
          variant="filled"
          label="Paziente"
          autoFocus={true}
          {...params}
        />
      )}
      disabled={error || isLoading}
    />
  );
}
