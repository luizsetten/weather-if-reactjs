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

interface IItemData {
  reference_date: string;
  value: number;
}

interface IGraph {
  title: string;
  data: IItemData[];
  color: string;
  // eslint-disable-next-line react/require-default-props
  dataKey?: string;
  unit: string | undefined;
}

function Graph({ title, data, color, dataKey = "value", unit }: IGraph) {
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
        <XAxis dataKey="reference_date" />
        <YAxis unit={unit} />

        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />

        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          unit={unit}
          yAxisId={0}
        />
      </LineChart>
    </div>
  );
}

export default Graph;
