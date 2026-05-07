export default async function Page() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/opportunities`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();
  const rawJobs = data.opportunities || data || [];

  const jobs = rawJobs
    .filter((job) => job.job_url && !job.job_url.includes("example.com"))
    .slice(0, 5);

  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Job Radar</h1>

      {jobs.map((job, i) => (
        <div
          key={i}
          style={{
            marginBottom: 20,
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 10,
          }}
        >
          <div>
            <strong>{String(job.job_title)}</strong>
          </div>

          <div>{String(job.company)}</div>

          <div>Score: {String(job.score)}</div>
        </div>
      ))}
    </main>
  );
          }
