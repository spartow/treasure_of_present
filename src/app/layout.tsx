import type { Metadata } from "next";
import "./globals.css";
import ChatBot from "@/components/ChatBot";

// Note: For Persian fonts, we'll use system fonts and Google Fonts via CSS
// Vazirmatn is a beautiful modern Persian font

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://parvizshahbazi.com'),
  title: {
    default: "گنج حضور - Ganj e Hozour | پرویز شهبازی",
    template: "%s | گنج حضور"
  },
  description: "برنامه‌های تصویری و صوتی گنج حضور با اجرای پرویز شهبازی - مجموعه‌ای از برنامه‌های معنوی و عرفانی",
  keywords: ["گنج حضور", "پرویز شهبازی", "Parviz Shahbazi", "Ganj e Hozour", "عرفان", "معنویت", "مولوی"],
  authors: [{ name: "Parviz Shahbazi" }],
  creator: "Parviz Shahbazi",
  publisher: "Ganj e Hozour",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    alternateLocale: ["en_US"],
    url: "https://parvizshahbazi.com",
    siteName: "گنج حضور - Ganj e Hozour",
    title: "گنج حضور - Ganj e Hozour | پرویز شهبازی",
    description: "برنامه‌های تصویری و صوتی گنج حضور با اجرای پرویز شهبازی",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "گنج حضور - Ganj e Hozour",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "گنج حضور - Ganj e Hozour",
    description: "برنامه‌های تصویری و صوتی گنج حضور با اجرای پرویز شهبازی",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-site-verification",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-vazir antialiased bg-gray-50 dark:bg-gray-900">
        <ChatBot />
        {children}
      </body>
    </html>
  );
}
