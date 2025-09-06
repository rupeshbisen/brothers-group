import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });
const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_APP_URL is not set");
}

export const metadata: Metadata = {
  title: "Brother Bal Ganesh Utsav Mandal",
  description:
    "Official website of Brother Bal Ganesh Utsav Mandal, Gangabagh. Join us in celebrating Ganesh Utsav with devotion and community spirit.",
  keywords:
    "Ganesh Utsav, Mandal, Gangabagh, Brother Bal Ganesh, Hindu Festival, Community, Devotion",
  authors: [{ name: "Brother Bal Ganesh Utsav Mandal" }],
  creator: "Brother Bal Ganesh Utsav Mandal",
  publisher: "Brother Bal Ganesh Utsav Mandal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Brother Bal Ganesh Utsav Mandal",
    description:
      "Official website of Brother Bal Ganesh Utsav Mandal, Gangabagh. Join us in celebrating Ganesh Utsav with devotion and community spirit.",
    url: baseUrl,
    siteName: "Brother Bal Ganesh Utsav Mandal",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Brother Bal Ganesh Utsav Mandal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brother Bal Ganesh Utsav Mandal",
    description:
      "Official website of Brother Bal Ganesh Utsav Mandal, Gangabagh. Join us in celebrating Ganesh Utsav with devotion and community spirit.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <div className="min-h-screen">
          <Navigation />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
