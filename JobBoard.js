"use client";

import { useState } from "react";
import Controls from "./Controls";

export default function JobBoard({ jobs, now }) {
  const [filters, setFilters] = useState({
    minScore: 0,
    days: 14,
  });

  const filtered = jobs.filter((job) => {
    const jobDate = new Date(job.posted_date || job.date_found);
    const diffDays = (now - jobDate) / (1000 * 60 * 60 * 24);

    if (job.score < filters.minScore) return false;
    if (diffDays > filters.days) return false;

    return true;
  });

  const verified = filtered.filter(
    (job) => job.source_category === "verified" || !job.source_category
  );

  const social = filtered.filter(
    (job) => job.source_category && job.source_category !== "verified"
  );

  return (
    <>
      <Controls onChange={setFilters} />

      <Section title="Verified Jobs" jobs={verified} now={now} />
      <Section title="Social Leads to Verify" jobs={social} now={now} />
    </>
  );
}

function Section({ title, jobs, now }) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2>
        {title} ({jobs.length})
      </h2>

      {jobs.map((job, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <strong>{job.job_title}</strong>
          <div>{job.company}</div>
          <div>Score: {job.score}</div>
        </div>
      ))}
    </section>
  );
}
