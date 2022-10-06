import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function ListItems({ sel, clickHandler }) {
  return (
    <React.Fragment>
      <ListItemButton selected={sel == 1} onClick={clickHandler("Home")}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton selected={sel == 2} onClick={clickHandler("InvoiceList")}>
        <ListItemIcon>
          <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary="Fatture" />
      </ListItemButton>
      <ListItemButton selected={sel == 3} onClick={clickHandler("PatientList")}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Pazienti" />
      </ListItemButton>
      <ListItemButton selected={sel == 4} onClick={clickHandler("Graph")}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Grafici" />
      </ListItemButton>
      <Divider sx={{ my: 1 }} />
      <ListSubheader component="div" inset>
        Azioni
      </ListSubheader>
      <ListItemButton selected={sel == 5} onClick={clickHandler("NewInvoice")}>
        <ListItemIcon>
          <PostAddIcon />
        </ListItemIcon>
        <ListItemText primary={"Nuova fattura"} />
      </ListItemButton>
      <ListItemButton selected={sel == 6} onClick={clickHandler("NewPatient")}>
        <ListItemIcon>
          <PersonAddIcon />
        </ListItemIcon>
        <ListItemText primary="Nuovo paziente" />
      </ListItemButton>
      {/* <ListItemButton selected={sel == 7}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary={new Date().getFullYear()} />
      </ListItemButton> */}
    </React.Fragment>
  );
}
