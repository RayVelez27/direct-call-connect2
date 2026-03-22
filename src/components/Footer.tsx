import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import plezyyLogo from "@/assets/Untitled design - 2026-03-15T061848.986.png";

const companyLinks = ["About Us", "Careers", "Press", "Contact"];
const resourceLinks = ["Help Center", "Creator Stories", "Creator Blog", "Pricing"];

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
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a className="hover:text-[#4180FB] dark:hover:text-[#7AAFFD] transition-colors" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              {resourceLinks.map((link) => (
                <li key={link}>
                  <a className="hover:text-[#4180FB] dark:hover:text-[#7AAFFD] transition-colors" href="#">
                    {link}
                  </a>
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
          <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2025 Plezyy Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#4180FB] dark:hover:text-[#7AAFFD] transition-colors" to="/trust-and-safety">
              Trust &amp; Safety
            </Link>
            <Link className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#4180FB] dark:hover:text-[#7AAFFD] transition-colors" to="/terms">
              Terms &amp; Policies
            </Link>
            <a className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#4180FB] dark:hover:text-[#7AAFFD] transition-colors" href="#">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
