import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import BarChartIcon from "@mui/icons-material/BarChart";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function ListItems({ sel, clickHandler }) {
  const router = useRouter();
  const pathname = router.pathname;
  return (
    <React.Fragment>
      <Link href="/dashboard" passHref>
        <ListItemButton selected={/*sel == 1*/ pathname === "/dashboard"}>
          {/*onClick={clickHandler("Home")}>*/}
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
      </Link>
      <Link href="/invoices" passHref>
        <ListItemButton selected={/*sel == 2*/ pathname === "/invoices"}>
          {/*onClick={clickHandler("InvoiceList")}>*/}
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Fatture" />
        </ListItemButton>
      </Link>
      <Link href="/patients" passHref>
        <ListItemButton selected={/*sel == 3*/ pathname === "/patients"}>
          {/*} onClick={clickHandler("PatientList")}> */}
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Pazienti" />
        </ListItemButton>
      </Link>
      <Link href="/graphs" passHref>
        <ListItemButton selected={/*sel == 4*/ pathname === "/graphs"}>
          {/* onClick={clickHandler("Graph")}>*/}
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Grafici" />
        </ListItemButton>
      </Link>
      <Divider sx={{ my: 1 }} />
      <ListSubheader component="div" inset>
        Azioni
      </ListSubheader>
      <Link href="/newInvoice" passHref>
        <ListItemButton selected={/*sel == 5*/ pathname === "/newInvoice"}>
          {/*onClick={clickHandler("NewInvoice")}>*/}
          <ListItemIcon>
            <PostAddIcon />
          </ListItemIcon>
          <ListItemText primary={"Nuova fattura"} />
        </ListItemButton>
      </Link>
      <Link href="/newPatient" passHref>
        <ListItemButton selected={/*sel == 6*/ pathname === "/newPatient"}>
          {/*onClick={clickHandler("NewPatient")}>*/}
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText primary="Nuovo paziente" />
        </ListItemButton>
      </Link>
    </React.Fragment>
  );
}
