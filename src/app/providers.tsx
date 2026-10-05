"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import Layout from "@/components/Layout";
import { Toaster } from "sonner";
import { Tooltip } from "react-tooltip";

// Replaces next/router routeChangeStart/Complete events from _app.tsx:
// start the bar when an internal link is clicked, finish it on arrival.
function ProgressHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("/") && !href.startsWith("//")) {
        NProgress.start();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <Toaster
        toastOptions={{
          className: "sooner-toast-desktop",
        }}
        position="bottom-right"
      />
      <Toaster
        toastOptions={{
          className: "sooner-toast-mobile",
        }}
        position="top-center"
      />
      <Tooltip id="tooltip" className="react-tooltip" />
      <Suspense>
        <ProgressHandler />
      </Suspense>
      {children}
    </Layout>
  );
}
