import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

function preventDefault(event) {
  event.preventDefault();
}

export default function IncomePaper({
  day,
  month,
  currentIncome,
  previousIncome,
}) {
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Fatturato corrente
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography component="p">Mensile</Typography>
            </TableCell>
            <TableCell>
              <Typography component="p">Annuale</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ "td, th": { border: 0 } }}>
            <TableCell>
              <Typography component="p" variant="h6">
                {currentIncome.monthly}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography component="p" variant="h6">
                {currentIncome.annual}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Anno precedente
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography component="p" color="text.secondary">
                Mensile
              </Typography>
            </TableCell>

            <TableCell>
              <Typography component="p" color="text.secondary">
                Annuale
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ "td, th": { border: 0 } }}>
            <TableCell>
              <Typography component="p" color="text.secondary" variant="h6">
                {previousIncome.monthly}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography component="p" color="text.secondary" variant="h6">
                {previousIncome.annual}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Typography
        color="text.secondary"
        sx={{ flex: 1 }}
        textAlign="right"
        variant="subtitle1"
      >
        al {`${day} ${month}`}
      </Typography>
    </React.Fragment>
  );
}
