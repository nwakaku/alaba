"use client";

import Link from "@/shims/next-link";
import ConnectWalletButton from "../ConnectWalletButton";
import { useRouter } from "@/shims/next-navigation";
import { ArrowUpRight, Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

export default function Header() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Profile", href: "/profile" },
    { name: "Contact Us", href: "/contact" },
  ];

  // Simple active state detection - you can enhance this later
  const isActive = (href: string) => {
    // For now, we'll use a simple approach
    // In a real app, you'd use usePathname or similar
    return false; // This will be enhanced when the routing is properly set up
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center py-3">
        <div
          className="font-montserrat font-bold text-xl sm:text-2xl cursor-pointer"
          onClick={() => router.push("/")}
        >
          Alaba
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-18">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-md font-medium transition-colors hover:text-foreground ${
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-border hover:bg-foreground/5"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <ConnectWalletButton />
        </div>
      </div>
    </nav>
  );
}
