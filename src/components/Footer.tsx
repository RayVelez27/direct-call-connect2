import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import plezyyLogo from "@/assets/Untitled design - 2026-03-27T091410.050.png";

const exploreLinks = [
  { label: "Discover Creators", to: "/discovery" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "FAQ", to: "/faq" },
];

const legalLinks = [
  { label: "Trust & Safety", to: "/trust-and-safety" },
  { label: "Terms of Use", to: "/terms-of-use" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Creator Terms", to: "/terms" },
];

const linkClass = "hover:text-[#4180FB] dark:hover:text-[#7AAFFD] transition-colors";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 pt-20 pb-10 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <img alt="Plezyy Logo" className="h-8 w-auto mb-6 dark:invert" src={plezyyLogo} />
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              The world's first freelance adult marketplace. Buy and sell virtual intimate experiences safely and privately.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link className={linkClass} to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link className={linkClass} to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Newsletter</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get the latest from Plezyy creators.</p>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#4180FB] focus:border-transparent outline-none"
                placeholder="Email"
                type="email"
              />
              <button className="p-2.5 bg-[#4180FB] dark:bg-[#5A96FC] text-white rounded-full hover:bg-[#3268D4] dark:hover:bg-[#7AAFFD] transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2026 Plezyy Inc. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {legalLinks.map((link) => (
              <Link key={link.to} className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#4180FB] dark:hover:text-[#7AAFFD] transition-colors" to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
