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
  Legend,
} from "recharts";
import Title from "./Title";
import { getShortMonths } from "../lib/dateUtils";

export default function Chart({
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
      <Title>Today</Title>
      <ResponsiveContainer width="99%">
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
            contentStyle={{
              backgroundColor: theme.palette.mode === "light" ? "#ddd" : "#555",
            }}
          />
          <Legend />
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
