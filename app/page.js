export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/opportunities`, {
    cache: "no-store",
  });

  const data = await res.json();
  const jobs = data.opportunities || data;

  return (
    <div style={{ padding: 20 }}>
      <h1>Job Radar</h1>

      {jobs.map((job, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <h3>{job.job_title}</h3>
          <p>{job.company}</p>
          <a href={job.job_url} target="_blank">
            Apply
          </a>
        </div>
      ))}
    </div>
  );
}
