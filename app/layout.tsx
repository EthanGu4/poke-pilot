import type { Metadata } from "next";
import { Baloo_2 } from 'next/font/google'
import "./globals.css";


const baloo = Baloo_2({ weight: ['400','700'], subsets: ['latin'] })

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
    <html lang="en" className={baloo.className}>
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}