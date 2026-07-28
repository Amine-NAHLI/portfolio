"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { silentSignOutAdmin } from "@/app/admin/(protected)/actions";

export function AdminAutoLogout() {
  const pathname = usePathname();
  // Initialize with the current path status so we know if we started in admin
  const wasAdmin = useRef(pathname?.startsWith("/admin") ?? false);

  useEffect(() => {
    if (!pathname) return;
    const isAdminRoute = pathname.startsWith("/admin");
    
    if (wasAdmin.current && !isAdminRoute) {
      // User just left the admin area (e.g., navigated to /fr)
      silentSignOutAdmin();
    }
    
    wasAdmin.current = isAdminRoute;
  }, [pathname]);

  return null;
}
