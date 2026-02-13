import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Moon, Sun, Menu, X, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import plezyyLogo from "@/assets/plezyy-logo.jpeg";
import CategoriesModal from "@/components/CategoriesModal";

const navLinks = [
  { label: "Explore", href: "#" },
  { label: "Become a Creator", href: "/onboarding" },
  { label: "How it Works", href: "/how-it-works" },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img alt="Plezyy Logo" className="h-10 w-auto dark:invert" src={plezyyLogo} />
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setCategoriesOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <LayoutGrid className="h-4 w-4" />
              Categories
            </button>
            <Link to="/sign-in">
              <Button variant="ghost" className="text-sm font-semibold">
                Log In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button className="rounded-full text-sm font-semibold">Sign Up</Button>
            </Link>
            <button
              onClick={toggleDark}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => setCategoriesOpen(true)}
                    className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                  >
                    <LayoutGrid className="h-5 w-5" />
                    Categories
                  </button>
                  <Link to="/sign-in">
                    <Button variant="ghost" className="justify-start text-lg font-semibold">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/sign-up">
                    <Button className="rounded-full text-lg font-semibold">Sign Up</Button>
                  </Link>
                  <button
                    onClick={toggleDark}
                    className="flex items-center gap-2 text-lg"
                  >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <CategoriesModal open={categoriesOpen} onClose={() => setCategoriesOpen(false)} />
    </nav>
  );
}
