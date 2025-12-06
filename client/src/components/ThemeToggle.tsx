'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200/50 dark:bg-gray-800/50 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 backdrop-blur-md border border-purple-200/50 dark:border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 dark:hover:from-purple-500/40 dark:hover:to-pink-500/40 transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl"
      aria-label="Toggle theme"
    >
      <Sun 
        className={`w-5 h-5 text-purple-600 dark:text-purple-400 absolute transition-all duration-300 group-hover:scale-110 ${
          theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
        }`}
      />
      <Moon 
        className={`w-5 h-5 text-purple-600 dark:text-purple-400 absolute transition-all duration-300 group-hover:scale-110 ${
          theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
        }`}
      />
    </button>
  );
}
