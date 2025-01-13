import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Michael Lourenço || Personal Portfolio",
  description:
    "Site profissional de Michael Lourenço. Freelancer FullStack, AWS, GCP, NodeJS, Python, PHP,VueJS, React, criação de sites, mail marketing, SEO para seus sites e sistemas em geral.",
  keywords:
    "Michael Lourenço, FullStack, AWS, GCP, NodeJS, Python, PHP,VueJS, React",
  openGraph: {
    title: "Michael Lourenço - criação e desenvolvimento",
    description:
      "Site profissional de Michael Lourenço. Freelancer FullStack, AWS, GCP, NodeJS, Python, PHP,VueJS, React, criação de sites, mail marketing, SEO para seus sites e sistemas em geral.",
    url: "https://michaellourenco.com",
    siteName: "michaellourenco",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    title: "Michael Lourenço - criação e desenvolvimento",
    creator: "@michaellourenco",
    site: "https://michaellourenco.com",
    card: "summary_large_image",
  },
  robots: "index, follow",
  authors: [{ name: "Michael Lourenço", url: "https://michaellourenco.com" }],
  appleWebApp: true,
  applicationName: "Michael Lourenço",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
