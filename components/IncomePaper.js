"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Box,
} from "@mui/material";

import ErrorBox from "./ErrorBox";
import { italianMonth } from "../lib/dateUtils";
import { useInvoices } from "../lib/hooks";

const reducer = (sum, inv) => sum + Number.parseFloat(inv.valore);

const Container = ({ children }) => (
  <>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      Fatturato corrente
    </Typography>
    {children}
  </>
);

export default function IncomePaper() {
  const { invoices, isLoading, error } = useInvoices();
  const now = new Date();
  const day = now.getDate();
  const month = italianMonth(now.getMonth());

  if (error)
    return (
      <ErrorBox
        title="Errore nel caricamento delle fatture"
        text={error?.message}
      />
    );

  if (invoices === undefined)
    // || isLoading)
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: "1",
          }}
        >
          <CircularProgress sx={{ mx: "auto" }} />
        </Box>
      </Container>
    );
  else {
    const currentMonthlyIncome = invoices
      .filter((i) => {
        const invDate = new Date(i.dataEmissione);
        return (
          invDate.getFullYear() === now.getFullYear() &&
          invDate.getMonth() === now.getMonth()
        );
      })
      .reduce(reducer, 0);
    const previousMonthlyIncome = invoices
      .filter((i) => {
        const invDate = new Date(i.dataEmissione);
        return (
          invDate.getFullYear() === now.getFullYear() - 1 &&
          invDate.getMonth() === now.getMonth() &&
          invDate.getDate() <= now.getDate()
        );
      })
      .reduce(reducer, 0);
    const currentAnnualIncome = invoices
      .filter(
        (i) => new Date(i.dataEmissione).getFullYear() === now.getFullYear()
      )
      .reduce(reducer, 0);
    const previousAnnualIncome = invoices
      .filter((i) => {
        const invDate = new Date(i.dataEmissione);
        return (
          invDate.getFullYear() === now.getFullYear() - 1 &&
          (invDate.getMonth() < now.getMonth() ||
            (invDate.getMonth() === now.getMonth() &&
              invDate.getDate() <= now.getDate()))
        );
      })
      .reduce(reducer, 0);
    return (
      <Container>
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
                  {currentMonthlyIncome}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography component="p" variant="h6">
                  {currentAnnualIncome}
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
                  {previousMonthlyIncome}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography component="p" color="text.secondary" variant="h6">
                  {previousAnnualIncome}
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
      </Container>
    );
  }
}
