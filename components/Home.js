import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import IncomePaper from "./IncomePaper";
import LastInvoices from "./LastInvoices";
import Chart from "./Chart";

export default function Home() {
  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240 + 80,
            margin: 2,
            mt: 4,
          }}
        >
          <Chart />
        </Paper>
      </Grid>
      {/* Income Paper */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240 + 80,
            margin: 2,
            mt: 4,
          }}
        >
          <IncomePaper />
        </Paper>
      </Grid>
      {/* Last invoices */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column", m: 2 }}>
          <LastInvoices />
        </Paper>
      </Grid>
    </Grid>
  );
}
