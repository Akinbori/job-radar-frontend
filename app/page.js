import RefreshButton from "./RefreshButton";

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/opportunities`, {
    cache: "no-store",
  });

  const data = await res.json();

  const rawJobs = data.opportunities || data || [];

  const jobs = rawJobs
    .filter((job) => job?.job_url && !String(job.job_url).includes("example.com"))
    .slice(0, 10);

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Job Radar</h1>

      <RefreshButton />

      <div style={{ marginTop: 24 }}>
        {jobs.map((job, i) => (
          <div
            key={job.id || job.deal_id || job.job_url || i}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 12,
              background: "#fff",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {String(job.job_title || "Untitled role")}
            </div>

            <div style={{ marginTop: 4 }}>
              {String(job.company || "Unknown company")}
            </div>

            <div style={{ marginTop: 8 }}>
              Score: {String(job.score ?? "N/A")}
            </div>

            <a
              href={String(job.job_url)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 8,
                background: "#111",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              View Job
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
