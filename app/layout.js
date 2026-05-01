export const metadata = {
  title: "Job Radar",
  description: "Live job feed",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
