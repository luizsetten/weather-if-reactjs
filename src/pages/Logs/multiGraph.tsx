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

interface IGraphItem {
  min: number;
  avg: number;
  max: number;
  reference_date: string;
}

interface IGraph {
  title: string;
  data: IGraphItem[];
  unit: string | undefined;
}

function MultiGraph({ title, data, unit }: IGraph) {
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
        <XAxis dataKey="created_at" />
        <YAxis unit={unit} />

        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />

        <Line
          type="monotone"
          dataKey="min"
          stroke="#253ea0"
          unit={unit}
          yAxisId={0}
        />
        <Line
          type="monotone"
          dataKey="avg"
          stroke="#25a029"
          unit={unit}
          yAxisId={0}
        />
        <Line
          type="monotone"
          dataKey="max"
          stroke="#a02525"
          unit={unit}
          yAxisId={0}
        />
      </LineChart>
    </div>
  );
}

export default MultiGraph;
