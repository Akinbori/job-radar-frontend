"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/opportunities`)
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Job Radar</h1>

      {jobs.length === 0 ? (
        <p>Loading jobs...</p>
      ) : (
        jobs.map((job, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <a href={job.link} target="_blank">
              Apply
            </a>
          </div>
        ))
      )}
    </div>
  );
}
