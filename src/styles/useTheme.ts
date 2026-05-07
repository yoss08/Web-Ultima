import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    // If no theme is stored, default to dark mode
    return storedTheme === 'light' ? false : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return { isDark, setIsDark };
}