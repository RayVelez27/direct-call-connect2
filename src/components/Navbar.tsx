import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import plezyyLogo from "@/assets/Untitled design - 2026-03-27T091410.050.png";

const navLinks = [
  { label: "Explore", href: "/discovery", matchPaths: ["/discovery"] },
  { label: "How It Works", href: "/how-it-works" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsSignedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
            {isSignedIn ? (
              <>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#4180FB] dark:hover:text-[#7AAFFD] transition-colors"
                >
                  Sign Out
                </button>
                <Link
                  to="/dashboard/creator"
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                >
                  <UserCircle className="h-6 w-6" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/sign-up"
                  className="px-5 py-2 rounded-full text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #FF9A3C, #FF7AA2, #D85BFF, #8A5CFF)" }}
                >
                  Join Now
                </Link>
                <Link
                  to="/sign-in"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#4180FB] dark:hover:text-[#7AAFFD] transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
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
          {isSignedIn ? (
            <>
              <Link
                to="/dashboard/creator"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-[#4180FB] transition-colors"
              >
                <UserCircle className="h-5 w-5" />
                Dashboard
              </Link>
              <button
                onClick={() => { handleSignOut(); setMobileOpen(false); }}
                className="block text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-[#4180FB] transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/sign-up"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-5 py-3 rounded-full text-white text-lg font-semibold transition-colors hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #FF9A3C, #FF7AA2, #D85BFF, #8A5CFF)" }}
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
            </>
          )}
        </div>
      )}
    </nav>
  );
}
