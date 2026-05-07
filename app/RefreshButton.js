"use client";

import { useState } from "react";

export default function RefreshButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRefresh() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scan`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        throw new Error("Scan failed");
      }

      const data = await res.json();

      setMessage(
        `Found ${data.opportunity_count || 0} fresh opportunities.`
      );

      window.location.reload();
    } catch (err) {
      setMessage("Refresh failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 18 }}>
      <button
        onClick={handleRefresh}
        disabled={loading}
        style={{
          padding: "12px 16px",
          borderRadius: 10,
          border: "none",
          background: "#111",
          color: "#fff",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Refreshing..." : "Refresh jobs"}
      </button>

      {message && (
        <p
          style={{
            marginTop: 10,
            color: "#555",
            fontSize: 14,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
