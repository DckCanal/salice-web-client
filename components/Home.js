import Grid from "@mui/material/Grid";
import { useTheme } from "@emotion/react";

import IncomePaper from "./IncomePaper";
import LastInvoices from "./LastInvoices";
import Chart from "./Chart";
import StyledPaper from "./StyledPaper";

export default function Home() {
  const theme = useTheme();
  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <StyledPaper
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
        </StyledPaper>
      </Grid>
      {/* Income Paper */}
      <Grid item xs={12} md={4} lg={3}>
        <StyledPaper
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
        </StyledPaper>
      </Grid>
      {/* Last invoices */}
      <Grid item xs={12}>
        <StyledPaper
          variant="outlined"
          sx={{
            bgcolor: theme.palette.mode === "light" ? "#fff" : "#000",
            p: 2,
            display: "flex",
            flexDirection: "column",
            m: 2,
          }}
        >
          <LastInvoices />
        </StyledPaper>
      </Grid>
    </Grid>
  );
}
