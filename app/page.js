export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/opportunities`, {
    cache: "no-store",
  });

  const data = await res.json();
  const rawJobs = data.opportunities || data || [];
  const now = new Date();

  const jobs = rawJobs
    .filter((job) => job.job_url && !job.job_url.includes("example.com"))
    .filter((job) => {
      const dateStr = job.posted_date || job.date_found;
      if (!dateStr) return false;

      const jobDate = new Date(dateStr);
      const diffDays = (now - jobDate) / (1000 * 60 * 60 * 24);

      return diffDays <= 14;
    })
    .filter((job, index, arr) => {
      const key = `${job.company}-${job.job_title}-${job.job_url}`.toLowerCase();

      return (
        arr.findIndex(
          (item) =>
            `${item.company}-${item.job_title}-${item.job_url}`.toLowerCase() ===
            key
        ) === index
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.posted_date || a.date_found);
      const dateB = new Date(b.posted_date || b.date_found);

      return dateB - dateA;
    });

  const verifiedJobs = jobs.filter(
  (job) => job.source_category === "verified" || !job.source_category
);
  const socialLeads = jobs.filter(
  (job) => job.source_category && job.source_category !== "verified"
);

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <h1 style={styles.title}>Job Radar</h1>
        <p style={styles.subtitle}>
          {jobs.length} remote-friendly opportunities found from the last 14 days
        </p>
      </section>

      <JobSection title="Verified Jobs" jobs={verifiedJobs} now={now} />
      <JobSection title="Social Leads to Verify" jobs={socialLeads} now={now} />
    </main>
  );
}

function JobSection({ title, jobs, now }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>
        {title} <span style={styles.count}>({jobs.length})</span>
      </h2>

      {jobs.length === 0 ? (
        <p style={styles.empty}>No matches in this section yet.</p>
      ) : (
        <div style={styles.grid}>
          {jobs.map((job, i) => (
            <JobCard key={`${job.id || job.job_url}-${i}`} job={job} now={now} />
          ))}
        </div>
      )}
    </section>
  );
}

function JobCard({ job, now }) {
  const jobDate = new Date(job.posted_date || job.date_found);
  const daysAgo = Math.max(
    0,
    Math.floor((now - jobDate) / (1000 * 60 * 60 * 24))
  );

  const companyKnown = job.company && job.company.toLowerCase() !== "unknown";
  const locationKnown = job.location && job.location.toLowerCase() !== "unknown";
  const isVerified = job.source_category === "verified";

  return (
    <article style={styles.card}>
      <div style={styles.badges}>
        <span style={styles.badge}>{job.source || "source unknown"}</span>
        <span style={styles.badge}>
          {daysAgo === 0
            ? "posted today"
            : `posted ${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`}
        </span>
        <span style={isVerified ? styles.goodBadge : styles.warningBadge}>
          {isVerified ? "verified job" : "verify before applying"}
        </span>
      </div>

      <h3 style={styles.jobTitle}>{job.job_title}</h3>

      <p style={styles.company}>
        {companyKnown ? job.company : "Company not detected yet"}
      </p>

      <p style={styles.meta}>
        {locationKnown ? job.location : "Location not specified"}
      </p>

      <p style={styles.score}>Score: {job.score}</p>

      <p style={styles.reason}>{job.match_reason}</p>

      <a href={job.job_url} target="_blank" style={styles.button}>
        View job
      </a>
    </article>
  );
}

const styles = {
  page: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "48px 20px",
    fontFamily: "Arial, sans-serif",
    background: "#fafafa",
    color: "#111",
  },
  header: {
    marginBottom: 36,
  },
  title: {
    fontSize: 48,
    margin: 0,
    letterSpacing: "-1px",
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginTop: 10,
  },
  section: {
    marginBottom: 44,
  },
  sectionTitle: {
    fontSize: 28,
    marginBottom: 16,
  },
  count: {
    color: "#777",
    fontWeight: 400,
  },
  empty: {
    color: "#666",
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: 14,
    padding: 20,
  },
  grid: {
    display: "grid",
    gap: 18,
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },
  badges: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#f1f1f1",
    color: "#444",
  },
  goodBadge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#eaf7ef",
    color: "#1f7a3f",
  },
  warningBadge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#fff4df",
    color: "#8a5a00",
  },
  jobTitle: {
    fontSize: 26,
    lineHeight: 1.2,
    margin: "0 0 14px",
  },
  company: {
    fontSize: 18,
    fontWeight: 700,
    margin: "0 0 6px",
  },
  meta: {
    fontSize: 16,
    color: "#666",
    margin: "0 0 16px",
  },
  score: {
    fontSize: 15,
    fontWeight: 700,
    margin: "0 0 10px",
  },
  reason: {
    fontSize: 16,
    lineHeight: 1.5,
    color: "#333",
    marginBottom: 20,
  },
  button: {
    display: "inline-block",
    padding: "10px 14px",
    borderRadius: 10,
    background: "#111",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  },
};
