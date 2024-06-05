"use client"
// components/Counter.js
import { useAtom } from 'jotai';
import { counterAtom } from '../atoms/counterAtom';

function Counter() {
  const [count, setCount] = useAtom(counterAtom);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount((c) => c + 1)}>Increment + 1</button>
    </div>
  );
}

export default Counter;
