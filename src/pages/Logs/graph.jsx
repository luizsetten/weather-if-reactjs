import React from 'react';
import {
  LineChart,
  XAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from 'recharts';

const Graph = ({
  title, data, color, dataKey,
}) => (
  <div id="graph">
    <h2>{title}</h2>
    <LineChart
      width={600}
      height={400}
      data={data}
      margin={{
        top: 5, right: 20, left: 10, bottom: 5,
      }}
    >
      <XAxis dataKey="createdAt" />
      <Tooltip />
      <CartesianGrid stroke="#f5f5f5" />

      <Line type="monotone" dataKey={dataKey} stroke={color} yAxisId={0} />
    </LineChart>
  </div>
);

export default Graph;
