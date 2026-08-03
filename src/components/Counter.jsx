import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section style={{ padding: "60px", textAlign: "center" }}>
      <h2>React useState Example</h2>

      <h1>{count}</h1>

      <button onClick={() => setCount(count + 1)}>
        Increase
        <button onClick={() => setCount(count - 1)}>
  Decrease
</button>
      </button>
    </section>
  );
}

export default Counter;