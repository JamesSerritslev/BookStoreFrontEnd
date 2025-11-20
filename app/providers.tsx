"use client";

import { useEffect, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    async function initMSW() {
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        const { worker } = await import("../src/mocks/browser");
        await worker.start({
          onUnhandledRequest: "bypass", // Don't warn about unhandled requests
        });
        setMswReady(true);
      } else {
        setMswReady(true);
      }
    }

    initMSW();
  }, []);

  // Don't render children until MSW is ready in dev mode
  if (!mswReady && process.env.NODE_ENV === "development") {
    return null;
  }

  return <>{children}</>;
}
