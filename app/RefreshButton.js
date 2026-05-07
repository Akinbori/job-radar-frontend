"use client";

import { useState } from "react";
import Controls from "./Controls";

export default function JobBoard({ jobs, now }) {
  const [filters, setFilters] = useState({
    minScore: 0,
    days: 14,
  });

  const nowDate = new Date(now);

  const filtered = jobs.filter((job) => {
    const jobDate = new Date(job.posted_date || job.date_found);
    const diffDays = (nowDate - jobDate) / (1000 * 60 * 60 * 24);

    if (job.score < filters.minScore) return false;
    if (diffDays > filters.days) return false;

    return true;
  });

  const verifiedJobs = filtered.filter(
    (job) => job.source_category === "verified" || !job.source_category
  );

  const socialLeads = filtered.filter(
    (job) => job.source_category && job.source_category !== "verified"
  );

  return (
    <>
      <Controls onChange={setFilters} />

      <JobSection title="Verified Jobs" jobs={verifiedJobs} now={nowDate} />
      <JobSection title="Social Leads to Verify" jobs={socialLeads} now={nowDate} />
    </>
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

      {job.contact_name && job.contact_name !== "unknown" && (
        <p style={styles.contact}>
          Contact: {job.contact_name}
          {job.contact_title && job.contact_title !== "unknown"
            ? ` — ${job.contact_title}`
            : ""}
        </p>
      )}

      <a href={job.job_url} target="_blank" rel="noreferrer" style={styles.button}>
        View job
      </a>
    </article>
  );
}

const styles = {
  section: {
    marginTop: 44,
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
    marginBottom: 16,
  },
  contact: {
    fontSize: 15,
    color: "#444",
    marginBottom: 18,
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
