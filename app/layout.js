import type { ReactNode } from "react";

export const metadata = {
  title: "Job Radar",
  description: "Live job feed",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
