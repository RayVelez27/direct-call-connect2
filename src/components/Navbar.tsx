import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import plezyyLogo from "@/assets/Untitled design - 2026-03-15T061848.986.png";

const navLinks = [
  { label: "Explore", href: "/discovery", matchPaths: ["/discovery"] },
  { label: "How It Works", href: "/how-it-works" },
];

export default function Navbar() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img alt="Plezyy Logo" className="h-10 w-auto dark:invert" src={plezyyLogo} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = link.matchPaths
                ? link.matchPaths.includes(location.pathname)
                : location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#4180FB] dark:text-[#7AAFFD] font-bold"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#4180FB] dark:hover:text-[#7AAFFD]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/sign-up"
              className="px-5 py-2 rounded-full bg-[#4180FB] dark:bg-[#5A96FC] text-white text-sm font-semibold hover:bg-[#3268D4] dark:hover:bg-[#7AAFFD] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Join Now
            </Link>
            <Link
              to="/sign-in"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#4180FB] dark:hover:text-[#7AAFFD] transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={toggleDark}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-700 dark:text-gray-300"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-6 space-y-5">
          {navLinks.map((link) => {
            const isActive = link.matchPaths
              ? link.matchPaths.includes(location.pathname)
              : location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block text-lg font-medium transition-colors ${
                  isActive
                    ? "text-[#4180FB] dark:text-[#7AAFFD] font-bold"
                    : "text-gray-700 dark:text-gray-300 hover:text-[#4180FB]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/sign-up"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center px-5 py-3 rounded-full bg-[#4180FB] dark:bg-[#5A96FC] text-white text-lg font-semibold hover:bg-[#3268D4] transition-colors"
          >
            Join Now
          </Link>
          <Link
            to="/sign-in"
            onClick={() => setMobileOpen(false)}
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-[#4180FB] transition-colors"
          >
            Sign In
          </Link>
          <button
            onClick={() => { toggleDark(); setMobileOpen(false); }}
            className="flex items-center gap-2 text-lg text-gray-700 dark:text-gray-300"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      )}
    </nav>
  );
}
