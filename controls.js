"use client";

import { useState } from "react";

export default function Controls({ onChange }) {
  const [minScore, setMinScore] = useState(0);
  const [days, setDays] = useState(14);

  function handleUpdate(newState) {
    const updated = { minScore, days, ...newState };
    onChange(updated);
  }

  return (
    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
      <select
        onChange={(e) => {
          const val = Number(e.target.value);
          setMinScore(val);
          handleUpdate({ minScore: val });
        }}
      >
        <option value={0}>All scores</option>
        <option value={30}>30+</option>
        <option value={50}>50+</option>
        <option value={70}>70+</option>
      </select>

      <select
        onChange={(e) => {
          const val = Number(e.target.value);
          setDays(val);
          handleUpdate({ days: val });
        }}
      >
        <option value={14}>Last 14 days</option>
        <option value={7}>Last 7 days</option>
        <option value={3}>Last 3 days</option>
      </select>
    </div>
  );
}
