import React from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from "recharts";
// http://recharts.org/en-US/guide/getting-started

function Graph({ title, data, color, dataKey, unit }) {
  return (
    <div id="graph">
      <h2>{title}</h2>
      <LineChart
        width={600}
        height={400}
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: 10,
          bottom: 5,
        }}
      >
        <XAxis dataKey="createdAt" />
        <YAxis unit={unit} />

        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />

        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          unit={unit || null}
          yAxisId={0}
        />
      </LineChart>
    </div>
  );
}

export default Graph;
