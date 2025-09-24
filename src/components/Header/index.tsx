"use client";

import Link from "@/shims/next-link";
import ConnectWalletButton from "../ConnectWalletButton";
import { useRouter } from "@/shims/next-navigation";
import { ArrowUpRight, Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

export default function Header() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-10 py-4 border-b border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className="font-montserrat font-bold text-2xl cursor-pointer"
        onClick={() => router.push("/")}
      >
        Alaba
      </div>
      <div className="flex items-center gap-5">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-foreground/5"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        

        <ConnectWalletButton />
      </div>
    </nav>
  );
}
