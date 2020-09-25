import React, { useState } from 'react';

function Logs() {
  // Declarar uma nova variável de state, na qual chamaremos de "count"
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>
        You clicked
        {' '}
        {count}
        {' '}
        times
      </p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
export default Logs;
