import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import IncomePaper from "./IncomePaper";
import LastInvoices from "./LastInvoices";
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
  const currentIncomeByMonth = invoices
    .filter(
      (inv) => new Date(inv.dataEmissione).getFullYear() == now.getFullYear()
    )
    .reduce((monthlyIncome, inv) => {
      const m = new Date(inv.dataEmissione).getMonth();
      monthlyIncome[m] = monthlyIncome[m]
        ? monthlyIncome[m] + inv.valore
        : inv.valore;
      return monthlyIncome;
    }, new Array().fill(undefined, 0, 12));
  const previousIncomeByMonth = invoices
    .filter(
      (inv) =>
        new Date(inv.dataEmissione).getFullYear() == now.getFullYear() - 1
    )
    .reduce((monthlyIncome, inv) => {
      const m = new Date(inv.dataEmissione).getMonth();
      monthlyIncome[m] = monthlyIncome[m]
        ? monthlyIncome[m] + inv.valore
        : inv.valore;
      return monthlyIncome;
    }, new Array().fill(undefined, 0, 12));
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
          }}
        >
          <Chart
            lightTheme={lightTheme}
            currentIncome={currentIncomeByMonth}
            previousIncome={previousIncomeByMonth}
            currentLabel={now.getFullYear()}
            previousLabel={now.getFullYear() - 1}
          />
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
      {/* Last invoices */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column", m: 2 }}>
          <LastInvoices invoices={invoices} patients={patients} />
        </Paper>
      </Grid>
    </Grid>
  );
}
