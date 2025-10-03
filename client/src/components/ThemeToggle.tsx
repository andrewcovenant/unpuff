import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: savedTheme === "dark" ? Style.Dark : Style.Light });
      StatusBar.setBackgroundColor({ 
        color: savedTheme === "dark" ? '#0B0F14' : '#FFFFFF' 
      });
    }
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setStyle({ style: newTheme === "dark" ? Style.Dark : Style.Light });
      await StatusBar.setBackgroundColor({ 
        color: newTheme === "dark" ? '#0B0F14' : '#FFFFFF' 
      });
    }
    
    console.log('Theme toggled to:', newTheme);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}