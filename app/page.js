import RefreshButton from "./RefreshButton";
import JobBoard from "./JobBoard";

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/opportunities`, {
    cache: "no-store",
  });

  const data = await res.json();
  const rawJobs = Array.isArray(data?.opportunities)
    ? data.opportunities
    : Array.isArray(data)
    ? data
    : [];

  const now = new Date();

  const jobs = rawJobs
    .filter((job) => {
      const url = String(job?.job_url || "");
      return url && !url.includes("example.com");
    })
    .filter((job) => {
      const dateStr = job?.posted_date || job?.date_found;
      if (!dateStr) return false;

      const jobDate = new Date(dateStr);
      if (Number.isNaN(jobDate.getTime())) return false;

      const diffDays = (now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24);

      if (!job?.posted_date) {
        return diffDays <= 7;
      }

      return diffDays <= 14;
    })
    .filter((job, index, arr) => {
      const key = `${job?.company || "unknown"}-${job?.job_title || "untitled"}-${job?.job_url || ""}`.toLowerCase();

      return (
        arr.findIndex((item) => {
          const itemKey = `${item?.company || "unknown"}-${item?.job_title || "untitled"}-${item?.job_url || ""}`.toLowerCase();
          return itemKey === key;
        }) === index
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a?.posted_date || a?.date_found).getTime();
      const dateB = new Date(b?.posted_date || b?.date_found).getTime();

      return dateB - dateA;
    });

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <h1 style={styles.title}>Job Radar</h1>
        <p style={styles.subtitle}>
          {jobs.length} remote-friendly opportunities found from the last 14 days
        </p>
        <RefreshButton />
      </section>

      <JobBoard jobs={jobs} now={now.toISOString()} />
    </main>
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
};
