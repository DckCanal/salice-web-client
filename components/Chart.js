import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import Title from "./Title";
import italianMonth from "../lib/dateTranslator";

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData("00:00", 0),
  createData("03:00", 300),
  createData("06:00", 600),
  createData("09:00", 800),
  createData("12:00", 1500),
  createData("15:00", 2000),
  createData("18:00", 2400),
  createData("21:00", 2400),
  createData("24:00", undefined),
];

export default function Chart({ lightTheme, currentIncome, previousIncome }) {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={currentIncome.map((income, month) => ({
            mese: italianMonth(month),
            fatturato: income,
          }))}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="mese"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            dataKey="fatturato"
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
            contentStyle={{ backgroundColor: lightTheme ? "#ddd" : "#555" }}
          />
          <Legend />
          {/* <CartesianGrid stroke="#f5f5f5" /> */}
          <Line
            isAnimationActive={true}
            type="monotone"
            dataKey="fatturato"
            stroke={theme.palette.primary.main}
            dot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
