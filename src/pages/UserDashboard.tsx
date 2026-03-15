import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { ChevronDown } from "lucide-react";
import plezyyLogo from "@/assets/plezyy-logo.jpeg";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/sign-in");
        return;
      }
      setUser(data.user);
    });
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Link to="/">
            <img alt="Plezyy Logo" className="h-10 w-auto dark:invert" src={plezyyLogo} />
          </Link>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  Viewer
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-semibold">
                  Viewer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/creator")}>
                  Creator
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">{user.email}</p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground">Browse Creators</h3>
            <p className="mt-1 text-sm text-muted-foreground">Discover and connect with verified creators.</p>
            <Link to="/explore">
              <Button className="mt-4" variant="outline" size="sm">Explore</Button>
            </Link>
          </div>
          <div className="rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground">My Bookings</h3>
            <p className="mt-1 text-sm text-muted-foreground">View your upcoming and past sessions.</p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground">Favorites</h3>
            <p className="mt-1 text-sm text-muted-foreground">Creators you've saved for later.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
