"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Stars from "./Stars";

export default function PageWrapper({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Trigger animation when navigating to profile page
    if (pathname === "/profile") {
      const timer = setTimeout(() => {
        document.dispatchEvent(new Event("ANIMATE_STARS_TO_CENTER"));
      }, 100); // Small delay to ensure smooth transition
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen relative">
      <Stars />
      {children}
    </div>
  );
}
