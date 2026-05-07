return (
  <main style={{ padding: 40 }}>
    <h1>Job Radar</h1>

    {jobs.slice(0, 5).map((job, i) => (
      <div key={i} style={{ marginBottom: 20 }}>
        <div>{String(job.job_title)}</div>
        <div>{String(job.company)}</div>
      </div>
    ))}
  </main>
);
