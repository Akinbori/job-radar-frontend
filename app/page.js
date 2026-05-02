export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/opportunities`, {
    cache: "no-store",
  });

  const data = await res.json();
  const rawJobs = data.opportunities || data || [];
  const now = new Date();

  const freshJobs = rawJobs.filter((job) => {
    const dateStr = job.posted_date || job.date_found;
    if (!dateStr) return false;

    const jobDate = new Date(dateStr);
    const diffDays = (now - jobDate) / (1000 * 60 * 60 * 24);

    return diffDays <= 14;
  });

  const jobs = freshJobs
    .filter((job) => job.job_url && !job.job_url.includes("example.com"))
    .filter((job, index, arr) => {
      const key = `${job.company}-${job.job_title}-${job.job_url}`;
      return (
        arr.findIndex(
          (item) =>
            `${item.company}-${item.job_title}-${item.job_url}` === key
        ) === index
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.posted_date || a.date_found);
      const dateB = new Date(b.posted_date || b.date_found);
      return dateB - dateA;
    });

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Job Radar</h1>
      <p>{jobs.length} fresh opportunities found from the last 14 days</p>

      {jobs.map((job, i) => {
        const jobDate = new Date(job.posted_date || job.date_found);
        const daysAgo = Math.floor((now - jobDate) / (1000 * 60 * 60 * 24));

        return (
          <div
            key={i}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <h2>{job.job_title}</h2>

            <p>
              <strong>
                {job.company && job.company !== "unknown"
                  ? job.company
                  : "Unknown (verify from post)"}
              </strong>
            </p>

            <p>
              {job.location && job.location !== "unknown"
                ? job.location
                : "Location not specified"}
            </p>

            <p style={{ fontSize: 12, color: "gray" }}>
              Source: {job.source}
              {job.source === "reddit" && " • verify before applying"}
            </p>

            <p style={{ fontSize: 12, color: "gray" }}>
              Posted {daysAgo} day{daysAgo !== 1 && "s"} ago
            </p>

            <p>Score: {job.score}</p>
            <p>{job.match_reason}</p>

            <a href={job.job_url} target="_blank">
              View job
            </a>
          </div>
        );
      })}
    </div>
  );
}
