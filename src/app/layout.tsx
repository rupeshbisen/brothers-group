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
  // Structured Data - Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Brother Bal Ganesh Utsav Mandal",
    alternateName: "Brothers Bal Ganesh Mandal",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Official website of Brother Bal Ganesh Utsav Mandal, Gangabagh. Join us in celebrating Ganesh Utsav with devotion and community spirit.",
    foundingDate: "2015",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gangabagh, Pardi",
      addressLocality: "Nagpur",
      addressRegion: "Maharashtra",
      postalCode: "440035",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-84088-89448",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi", "mr"],
    },
    sameAs: [
      "https://www.instagram.com/brothers_bal_ganesh_mandal?igsh=aGp6ODBwZWN6emhs",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only absolute left-2 top-2 bg-orange-700 text-white px-4 py-2 rounded z-50"
        >
          Skip to main content
        </a>
        <div className="min-h-screen">
          <Navigation />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
