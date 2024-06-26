'use client';
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { CircularProgress, Box } from "@mui/material";

import {
  //LineChart,
  AreaChart,
  //Line,
  Area,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import Title from "./Title";
import ErrorBox from "./ErrorBox";
import { getShortMonths } from "../lib/dateUtils";
import { useInvoices } from "../lib/hooks";

const reducer = (monthlyIncome, inv) => {
  const m = new Date(inv.dataEmissione).getMonth();
  monthlyIncome[m] += Number.parseFloat(inv.valore);
  return monthlyIncome;
};

export default function Chart() {
  const { invoices, error, isLoading } = useInvoices();
  const theme = useTheme();

  if (error)
    return (
      <ErrorBox
        title="Errore nel caricamento delle fatture"
        text={error?.message}
      />
    );

  if (invoices === undefined)// || isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: "1",
        }}
      >
        <CircularProgress sx={{ mx: "auto" }} />
      </Box>
    );

  const data = [];
  const now = new Date();
  const previousLabel = now.getFullYear() - 1;
  const currentLabel = now.getFullYear();
  const currentIncome = invoices
    .filter(
      (i) => new Date(i.dataEmissione).getFullYear() === now.getFullYear()
    )
    .reduce(reducer, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    .slice(0, now.getMonth() + 1);
  const previousIncome = invoices
    .filter(
      (i) => new Date(i.dataEmissione).getFullYear() === now.getFullYear() - 1
    )
    .reduce(reducer, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  getShortMonths().forEach((m, i) => {
    const newData = {};
    newData["mese"] = m;
    newData[previousLabel] = previousIncome[i];
    newData[currentLabel] = currentIncome[i];
    data.push(newData);
  });

  return (
    <React.Fragment>
      {/* <Title>Today</Title> */}
      <ResponsiveContainer width="99%">
        <AreaChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="mese"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Fatturato (€)
            </Label>
          </YAxis>
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.mode === "light" ? "#ddd" : "#555",
            }}
          />
          <Legend />
          <Area
            isAnimationActive={true}
            type="monotone"
            dataKey={currentLabel}
            stroke={theme.palette.primary.main}
            //dot={true}
            fillOpacity={1}
            fill="url(#colorPv)"
          />
          <Area
            isAnimationActive={true}
            type="monotone"
            dataKey={previousLabel}
            stroke={theme.palette.secondary.main}
            //dot={true}
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
