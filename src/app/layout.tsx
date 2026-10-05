import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "@/styles/globals.scss";
import "@/styles/checkbox.scss";
import "react-tooltip/dist/react-tooltip.css";
import "@/styles/nprogress.scss";
import "react-loading-skeleton/dist/skeleton.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Rive",
  description: "Your Personal Streaming Oasis",
  keywords:
    "movie, streaming, tv, rive, stream. movie app, tv shows, movie download",
  verification: {
    google: "J0QUeScQSxufPJqGTaszgnI35U2jN98vVWSOkVR4HrI",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/images/logo512.png",
    shortcut: "/images/logo512.png",
    apple: "/images/logo512.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rive",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-tap-highlight": "no",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f7fe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
