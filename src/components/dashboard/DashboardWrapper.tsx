import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";

export function DashboardWrapper() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return <DashboardLayout isDark={isDark} setIsDark={setIsDark} />;
}
