import type { Metadata } from "next";
import { Jost, Rubik } from "next/font/google";
import { LightboxProvider } from "@/components/lightbox";
import { person } from "@/content/site";
import "./globals.css";

/** Geometric light body, matching the portfolio's text setting. */
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

/** Heavy rounded caps, matching the portfolio's display type. */
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${person.name} - ${person.role}`,
  description: person.intro,
  openGraph: {
    title: `${person.name} - ${person.role}`,
    description: person.intro,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${jost.variable} ${rubik.variable} antialiased`}>
        <LightboxProvider>{children}</LightboxProvider>
      </body>
    </html>
  );
}
