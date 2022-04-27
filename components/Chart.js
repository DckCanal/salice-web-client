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
import { getMonths, getShortMonths } from "../lib/dateTranslator";

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

export default function Chart({
  lightTheme,
  currentIncome,
  previousIncome,
  currentLabel,
  previousLabel,
}) {
  const theme = useTheme();

  const data = [];
  getShortMonths().forEach((m, i) => {
    const newData = {};
    newData["mese"] = m;
    newData[previousLabel] = previousIncome[i];
    newData[currentLabel] = currentIncome[i];
    data.push(newData);
  });

  return (
    <React.Fragment>
      {console.log(data)}
      <Title>Today</Title>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
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
            dataKey={currentLabel}
            stroke={theme.palette.primary.main}
            dot={true}
          />
          <Line
            isAnimationActive={true}
            type="monotone"
            dataKey={previousLabel}
            stroke={theme.palette.secondary.main}
            dot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
