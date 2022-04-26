import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import IncomePaper from "./IncomePaper";
import Orders from "./Orders";
import Chart from "./Chart";
import italianMonth from "../lib/dateTranslator";

export default function Home({ lightTheme, patients, invoices }) {
  const now = new Date();
  const currentMonthlyIncome = () =>
    invoices.reduce((sum, inv) => {
      const invDate = new Date(inv.dataEmissione);
      if (
        invDate.getFullYear() == now.getFullYear() &&
        invDate.getMonth() == now.getMonth()
      ) {
        return sum + Number.parseFloat(inv.valore);
      }
      return sum;
    }, 0);
  const currentAnnualIncome = () =>
    invoices.reduce((sum, inv) => {
      const invDate = new Date(inv.dataEmissione);
      if (invDate.getFullYear() == now.getFullYear()) {
        return sum + Number.parseFloat(inv.valore);
      }
      return sum;
    }, 0);
  const previousMonthlyIncome = () =>
    invoices.reduce((sum, inv) => {
      const invDate = new Date(inv.dataEmissione);
      if (
        now.getMonth() == 1 &&
        invDate.getMonth() == 12 &&
        invDate.getFullYear() == now.getFullYear() - 1
      ) {
        return sum + Number.parseFloat(inv.valore);
      } else if (
        invDate.getFullYear() == now.getFullYear() &&
        invDate.getMonth() == now.getMonth() - 1
      ) {
        return sum + Number.parseFloat(inv.valore);
      }
      return sum;
    }, 0);
  const previousAnnualIncome = () =>
    invoices.reduce((sum, inv) => {
      const invDate = new Date(inv.dataEmissione);
      if (invDate.getFullYear() == now.getFullYear() - 1) {
        return sum + Number.parseFloat(inv.valore);
      }
      return sum;
    }, 0);
  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240 + 160,
            margin: 3,
          }}
        >
          <Chart lightTheme={lightTheme} />
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240 + 160,
            margin: 3,
          }}
        >
          <IncomePaper
            day={now.getDate()}
            month={italianMonth(now.getMonth())}
            currentIncome={{
              monthly: currentMonthlyIncome(),
              annual: currentAnnualIncome(),
            }}
            previousIncome={{
              monthly: previousMonthlyIncome(),
              annual: previousAnnualIncome(),
            }}
          />
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper
          sx={{ p: 2, display: "flex", flexDirection: "column", margin: 3 }}
        >
          <Orders />
        </Paper>
      </Grid>
    </Grid>
  );
}
