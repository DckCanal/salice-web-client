import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import italianMonth from "../lib/dateTranslator";

export default function ListItems({ sel, clickHandler }) {
  return (
    <React.Fragment>
      <ListItemButton selected={sel == 1} onClick={clickHandler("Home")}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton selected={sel == 2} onClick={clickHandler("InvoiceList")}>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Fatture" />
      </ListItemButton>
      <ListItemButton selected={sel == 3} onClick={clickHandler("PatientList")}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Pazienti" />
      </ListItemButton>
      <ListItemButton selected={sel == 4} onClick={clickHandler("Graph")}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Grafici" />
      </ListItemButton>
      {/* <ListItemButton>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItemButton> */}
      <Divider sx={{ my: 1 }} />
      <ListSubheader component="div" inset>
        Saved reports
      </ListSubheader>
      <ListItemButton selected={sel == 5}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary={italianMonth(new Date().getMonth())} />
      </ListItemButton>
      <ListItemButton selected={sel == 6}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Quadrimestre" />
      </ListItemButton>
      <ListItemButton selected={sel == 7}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary={new Date().getFullYear()} />
      </ListItemButton>
    </React.Fragment>
  );
}

// export function SecondaryListItems({ sel }) {
//   return (
//     <React.Fragment>
//       <ListSubheader component="div" inset>
//         Saved reports
//       </ListSubheader>
//       <ListItemButton selected={sel == 5}>
//         <ListItemIcon>
//           <AssignmentIcon />
//         </ListItemIcon>
//         <ListItemText primary={italianMonth(new Date().getMonth())} />
//       </ListItemButton>
//       <ListItemButton selected={sel == 6}>
//         <ListItemIcon>
//           <AssignmentIcon />
//         </ListItemIcon>
//         <ListItemText primary="Quadrimestre" />
//       </ListItemButton>
//       <ListItemButton selected={sel == 7}>
//         <ListItemIcon>
//           <AssignmentIcon />
//         </ListItemIcon>
//         <ListItemText primary={new Date().getFullYear()} />
//       </ListItemButton>
//     </React.Fragment>
//   );
// }
