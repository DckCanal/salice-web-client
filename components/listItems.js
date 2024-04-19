import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const itemsData = [
  ["/dashboard", HomeIcon, "Home"],
  ["/invoices", DescriptionIcon, "Fatture"],
  ["/patients", PersonIcon, "Pazienti"],
  //["/graphs", BarChartIcon, "Grafici"],
];
const actionsData = [
  ["/newInvoice", PostAddIcon, "Nuova fattura"],
  ["/newPatient", PersonAddIcon, "Nuovo paziente"],
];

export default function ListItems() {
  const router = useRouter();
  const pathname = router.pathname;
  const createList = (data) =>
    data.map(([href, Icon, text]) => (
      <ListItemButton
        key={href}
        component={Link}
        href={href}
        selected={pathname === href}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    ));
  return (
    <>
      {createList(itemsData)}

      <Divider sx={{ my: 1 }} />

      {createList(actionsData)}
    </>
  );
}
