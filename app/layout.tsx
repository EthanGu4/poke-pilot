import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PokéPilot",
  description: "build your own custom pokemon team!",
};

export default function RootLayout({ 
  children 
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui" }}>
        {children}
      </body>
    </html>
  );
}