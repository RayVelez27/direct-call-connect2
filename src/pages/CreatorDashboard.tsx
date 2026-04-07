import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  DollarSign,
  MessageSquare,
  UserCircle,
  ShieldCheck,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  Clock,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Search,
  Filter,
  MoreHorizontal,
  Send,
  Paperclip,
  Upload,
  Camera,
  FileText,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Lock,
  Globe,
  Palette,
  Trash2,
  CheckCircle2,
  AlertCircle,
  CircleDot,
  Ban,
  Heart,
} from "lucide-react";
import plezyyLogo from "@/assets/Untitled design - 2026-03-27T091410.050.png";
import { RichTextEditor, RichTextChat } from "@/components/ui/rich-text-editor";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, id: "overview" },
  { label: "Services", icon: Briefcase, id: "services" },
  { label: "Bookings", icon: CalendarDays, id: "bookings" },
  { label: "Content", icon: Upload, id: "content" },
  { label: "Earnings", icon: DollarSign, id: "earnings" },
  { label: "Messages", icon: MessageSquare, id: "messages", badge: 3 },
  { label: "Profile", icon: UserCircle, id: "profile" },
  { label: "Verification", icon: ShieldCheck, id: "verification" },
  { label: "Settings", icon: Settings, id: "settings" },
];

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"creator" | "viewer">("creator");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        navigate("/sign-in");
        return;
      }
      setUser(data.user);
      // Try to get avatar from user metadata (OAuth) or profiles table
      const metaAvatar = data.user.user_metadata?.avatar_url;
      if (metaAvatar) {
        setAvatarUrl(metaAvatar);
      } else {
        const { data: profile } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", data.user.id)
          .single();
        if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
      }
    });
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  const initials = user.email?.slice(0, 2).toUpperCase() ?? "CR";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "w-[72px]" : "w-64"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          {!sidebarCollapsed && (
            <Link to="/">
              <img alt="Plezyy Logo" className="h-8 w-auto dark:invert" src={plezyyLogo} />
            </Link>
          )}
          <button
            onClick={() => {
              setSidebarCollapsed(!sidebarCollapsed);
              setMobileMenuOpen(false);
            }}
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hidden lg:block"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="h-5 min-w-5 flex items-center justify-center text-xs px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-border p-3 shrink-0">
          {sidebarCollapsed ? (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center p-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">Creator</p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Service</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                  <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-border hover:ring-primary transition-all">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile" />}
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Creator</p>
                </div>
                <DropdownMenuItem onClick={() => setViewMode("creator")} className={viewMode === "creator" ? "font-semibold" : ""}>
                  <UserCircle className="h-4 w-4 mr-2" />
                  Creator Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setViewMode("viewer"); navigate("/dashboard/user"); }}>
                  <Eye className="h-4 w-4 mr-2" />
                  Member Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeTab === "overview" && <OverviewTab user={user} />}
          {activeTab === "services" && <ServicesTab />}
          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "content" && <ContentTab />}
          {activeTab === "earnings" && <EarningsTab />}
          {activeTab === "messages" && <MessagesTab user={user} />}
          {activeTab === "profile" && <ProfileTab user={user} />}
          {activeTab === "verification" && <VerificationTab />}
          {activeTab === "settings" && <SettingsTab user={user} />}
        </main>
      </div>
    </div>
  );
}

function OverviewTab({ user }: { user: User }) {
  const [stats, setStats] = useState({
    earnings: 0,
    bookings: 0,
    profileViews: 0,
    rating: 0,
    totalReviews: 0,
    likes: 0,
    completedBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        // Get creator profile id
        const { data: cp } = await supabase
          .from("creator_profiles")
          .select("id, average_rating, total_reviews, completion_rate")
          .eq("user_id", user.id)
          .single();

        if (!cp) { setLoading(false); return; }

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

        // Parallel queries
        const [earningsRes, bookingsRes, activeBookingsRes, viewsRes, likesRes] = await Promise.all([
          // Earnings this month
          supabase
            .from("transactions")
            .select("amount")
            .eq("creator_id", cp.id)
            .eq("type", "booking_payment")
            .eq("status", "completed")
            .gte("created_at", monthStart),
          // Completed bookings
          supabase
            .from("bookings")
            .select("id", { count: "exact", head: true })
            .eq("creator_id", cp.id)
            .eq("status", "completed"),
          // Active bookings
          supabase
            .from("bookings")
            .select("id", { count: "exact", head: true })
            .eq("creator_id", cp.id)
            .in("status", ["pending", "confirmed"]),
          // Profile views last 7 days
          supabase
            .from("profile_views")
            .select("id", { count: "exact", head: true })
            .eq("profile_id", cp.id)
            .gte("viewed_at", weekAgo),
          // Likes (favorites received)
          supabase
            .from("favorites")
            .select("id", { count: "exact", head: true })
            .eq("creator_id", cp.id),
        ]);

        const totalEarnings = (earningsRes.data ?? []).reduce((sum, t) => sum + Number(t.amount), 0);

        setStats({
          earnings: totalEarnings,
          bookings: activeBookingsRes.count ?? 0,
          profileViews: viewsRes.count ?? 0,
          rating: Number(cp.average_rating) || 0,
          totalReviews: cp.total_reviews ?? 0,
          likes: likesRes.count ?? 0,
          completedBookings: bookingsRes.count ?? 0,
        });
      } catch (err) {
        console.error("Failed to load creator stats:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="text-muted-foreground mt-1">Here's what's happening with your account today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Earnings" value={loading ? "..." : `$${stats.earnings.toFixed(2)}`} sub="This month" />
        <StatCard icon={CalendarDays} label="Bookings" value={loading ? "..." : String(stats.bookings)} sub="Active" />
        <StatCard icon={Eye} label="Profile Views" value={loading ? "..." : String(stats.profileViews)} sub="Last 7 days" />
        <StatCard icon={Star} label="Rating" value={loading ? "..." : stats.totalReviews > 0 ? stats.rating.toFixed(1) : "--"} sub={stats.totalReviews > 0 ? `${stats.totalReviews} review${stats.totalReviews !== 1 ? "s" : ""}` : "No reviews yet"} />
      </div>

      {/* Additional analytics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Heart} label="Likes" value={loading ? "..." : String(stats.likes)} sub="Total favorites" />
        <StatCard icon={CheckCircle2} label="Completed" value={loading ? "..." : String(stats.completedBookings)} sub="All-time bookings" />
        <StatCard icon={TrendingUp} label="Completion Rate" value={loading ? "..." : `${stats.completedBookings > 0 ? Math.round((stats.completedBookings / (stats.completedBookings + stats.bookings)) * 100) : 0}%`} sub="Booking success" />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            icon={Briefcase}
            title="Create a Service"
            description="List your first service to start getting bookings."
            linkTo="/create-service"
            buttonLabel="Create"
          />
          <ActionCard
            icon={UserCircle}
            title="Set Up Profile"
            description="Add your bio, tagline, categories, and photos."
            linkTo="/onboarding"
            buttonLabel="Edit Profile"
          />
          <ActionCard
            icon={ShieldCheck}
            title="Get Verified"
            description="Complete identity verification to build trust."
            linkTo="/onboarding-identity"
            buttonLabel="Start Verification"
          />
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Recent Activity</h3>
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Clock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No recent activity yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Your bookings, messages, and earnings will show up here.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground/60" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
  linkTo,
  buttonLabel,
}: {
  icon: any;
  title: string;
  description: string;
  linkTo: string;
  buttonLabel: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col">
      <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-3">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1 flex-1">{description}</p>
      <Link to={linkTo}>
        <Button variant="outline" size="sm" className="mt-4 w-full">
          {buttonLabel}
        </Button>
      </Link>
    </div>
  );
}

/* ─── SERVICES TAB ─── */
function ServicesTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Services</h2>
          <p className="text-muted-foreground mt-1">Manage your service listings and pricing.</p>
        </div>
        <Link to="/create-service">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search services..." className="pl-9 h-10 rounded-lg" />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active (0)</TabsTrigger>
          <TabsTrigger value="draft">Drafts (0)</TabsTrigger>
          <TabsTrigger value="paused">Paused (0)</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <EmptyState
            icon={Briefcase}
            title="No active services"
            description="Create your first service to start receiving bookings from members."
            actionLabel="Create Service"
            actionTo="/create-service"
          />
        </TabsContent>
        <TabsContent value="draft" className="mt-4">
          <EmptyState icon={FileText} title="No drafts" description="Services you save as draft will appear here." />
        </TabsContent>
        <TabsContent value="paused" className="mt-4">
          <EmptyState icon={Ban} title="No paused services" description="Paused services are hidden from members but can be reactivated." />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── BOOKINGS TAB ─── */
function BookingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Bookings</h2>
        <p className="text-muted-foreground mt-1">View and manage your sessions.</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <EmptyState
            icon={CalendarDays}
            title="No upcoming bookings"
            description="When members book your services, upcoming sessions will appear here."
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <EmptyState icon={Clock} title="No pending requests" description="Booking requests waiting for your confirmation show up here." />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <EmptyState icon={CheckCircle2} title="No completed sessions" description="Your session history will be listed here." />
        </TabsContent>
        <TabsContent value="cancelled" className="mt-4">
          <EmptyState icon={Ban} title="No cancellations" description="Cancelled bookings show up here." />
        </TabsContent>
      </Tabs>

      {/* Table skeleton for when data exists */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8 text-sm">
                No bookings to display yet.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ─── CONTENT TAB ─── */
function ContentTab() {
  const [files, setFiles] = useState<{ name: string; type: string; size: string; preview: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const acceptedTypes = "image/png,image/jpeg,image/gif,image/webp,video/mp4,video/quicktime,video/webm";

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles = Array.from(incoming).map((f) => ({
      name: f.name,
      type: f.type.startsWith("video") ? "video" : f.type === "image/gif" ? "gif" : "image",
      size: formatSize(f.size),
      preview: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Content</h2>
          <p className="text-muted-foreground mt-1">Upload images, GIFs, and videos for your profile gallery.</p>
        </div>
        {files.length > 0 && (
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Publish All
          </Button>
        )}
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
        className={`relative rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <input
          type="file"
          accept={acceptedTypes}
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Drag & drop files here</h3>
          <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
          <div className="flex items-center gap-3 mt-4">
            <Badge variant="secondary" className="gap-1.5">
              <Camera className="h-3 w-3" />
              Images
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              <CircleDot className="h-3 w-3" />
              GIFs
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              <Eye className="h-3 w-3" />
              Videos
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-3">PNG, JPG, GIF, WEBP, MP4, MOV, WEBM — Max 50MB per file</p>
        </div>
      </div>

      {/* Uploaded files grid */}
      {files.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Uploads ({files.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, i) => (
              <div key={i} className="group relative rounded-xl border border-border bg-card overflow-hidden">
                <div className="aspect-square bg-muted relative">
                  {file.type === "video" ? (
                    <video src={file.preview} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                  )}
                  {/* Type badge */}
                  <Badge className="absolute top-2 left-2 text-xs capitalize">{file.type}</Badge>
                  {/* Remove button */}
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty gallery state */}
      {files.length === 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Your Gallery</h3>
          <EmptyState
            icon={Camera}
            title="No content uploaded"
            description="Upload photos, GIFs, and videos to showcase on your creator profile. High-quality content helps attract more members."
          />
        </div>
      )}
    </div>
  );
}

/* ─── EARNINGS TAB ─── */
function EarningsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Earnings</h2>
        <p className="text-muted-foreground mt-1">Track your revenue and payouts.</p>
      </div>

      {/* Earnings summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Earnings" value="$0.00" sub="All time" />
        <StatCard icon={TrendingUp} label="This Month" value="$0.00" sub="Feb 2026" />
        <StatCard icon={ArrowUpRight} label="Pending Payout" value="$0.00" sub="Next payout: --" />
        <StatCard icon={ArrowDownRight} label="Platform Fees" value="$0.00" sub="All time" />
      </div>

      {/* Payout method */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Payout Method</h3>
              <p className="text-xs text-muted-foreground">No payout method configured</p>
            </div>
          </div>
          <Link to="/onboarding-payouts">
            <Button variant="outline" size="sm">Set Up</Button>
          </Link>
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Transaction History</h3>
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8 text-sm">
                  No transactions yet. Earnings from bookings will appear here.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

/* ─── MESSAGES TAB ─── */
function MessagesTab({ user }: { user: User }) {
  const [selectedConvo, setSelectedConvo] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Messages</h2>
        <p className="text-muted-foreground mt-1">Chat with members who've booked or enquired.</p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden flex" style={{ height: "calc(100vh - 240px)", minHeight: 400 }}>
        {/* Conversation list */}
        <div className="w-80 border-r border-border flex flex-col shrink-0 hidden sm:flex">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9 h-9 rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Messages from members will show up here.</p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedConvo === null ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="rounded-full bg-muted p-4 mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <h3 className="font-semibold text-foreground">Your messages</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Select a conversation from the list or wait for members to reach out after booking.
              </p>
            </div>
          ) : null}

          {/* Message input - always visible */}
          <div className="border-t border-border p-3">
            <RichTextChat
              onSend={(html) => setMessageText(html)}
              placeholder="Type a message..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PROFILE TAB ─── */
function ProfileTab({ user }: { user: User }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [visibility, setVisibility] = useState(false);

  const categoryOptions = ["Video Calls", "Live Shows", "Custom Content", "Girlfriend Experience", "Roleplay", "Fetish", "Sexting", "Date Companion"];

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from("creator_profiles")
        .select("display_name, slug, tagline, bio, categories, visibility")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Failed to load profile:", error);
      }
      if (data) {
        setDisplayName(data.display_name ?? "");
        setSlug(data.slug ?? "");
        setTagline(data.tagline ?? "");
        setBio(data.bio ?? "");
        setSelectedCategories(data.categories ?? []);
        setVisibility(data.visibility === "public");
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user.id]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("creator_profiles").upsert(
      {
        user_id: user.id,
        display_name: displayName.trim(),
        slug: slug.trim(),
        tagline: tagline.trim() || null,
        bio: bio.trim() || null,
        categories: selectedCategories,
        visibility: visibility ? "public" : "members_only",
      },
      { onConflict: "user_id" }
    );
    setSaving(false);
    if (error) {
      console.error("Profile save error:", error);
      toast.error("Failed to save profile.");
    } else {
      toast.success("Profile saved!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Profile</h2>
        <p className="text-muted-foreground mt-1">Manage how members see you on Plezyy.</p>
      </div>

      {/* Avatar & cover */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Photos</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {displayName ? displayName.slice(0, 2).toUpperCase() : user.email?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-foreground shadow">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Photo
            </Button>
            <p className="text-xs text-muted-foreground mt-2">JPG, PNG. Max 5MB.</p>
          </div>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Cover Photo</Label>
          <div className="h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
            <div className="text-center">
              <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Click to upload a cover photo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic info */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" placeholder="Your display name" className="h-10 rounded-lg" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Profile URL</Label>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-1">plezyy.com/</span>
              <Input id="slug" placeholder="your-name" className="h-10 rounded-lg flex-1" value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" placeholder="I WILL..." maxLength={80} className="h-10 rounded-lg" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          <p className="text-xs text-muted-foreground">Max 80 characters</p>
        </div>
        <div className="space-y-2">
          <Label>Bio</Label>
          <RichTextEditor
            value={bio}
            onChange={setBio}
            placeholder="Tell members about yourself..."
            maxLength={500}
            minHeight="100px"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Categories</h3>
        <p className="text-xs text-muted-foreground">Select at least 3 categories that describe your services.</p>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                selectedCategories.includes(cat)
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
          <button className="px-3 py-1.5 rounded-full border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            + More
          </button>
        </div>
      </div>

      {/* Visibility */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Profile Visibility</h3>
            <p className="text-xs text-muted-foreground mt-0.5">When public, anyone can find and view your profile.</p>
          </div>
          <Switch checked={visibility} onCheckedChange={setVisibility} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="px-8" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}

/* ─── VERIFICATION TAB ─── */
function VerificationTab() {
  const steps = [
    {
      icon: UserCircle,
      title: "Identity Verification",
      description: "Upload a government-issued ID to confirm your identity.",
      status: "incomplete" as const,
    },
    {
      icon: FileText,
      title: "Address Verification",
      description: "Provide your residential address for compliance.",
      status: "incomplete" as const,
    },
    {
      icon: CreditCard,
      title: "Payout Setup",
      description: "Connect Stripe or add bank details to receive payouts.",
      status: "incomplete" as const,
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Verification</h2>
        <p className="text-muted-foreground mt-1">Complete these steps to start receiving bookings.</p>
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Verification Progress</h3>
          <span className="text-sm font-bold text-primary">0 / 3 completed</span>
        </div>
        <Progress value={0} className="h-2" />
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
            <div className={`p-2.5 rounded-lg shrink-0 ${step.status === "incomplete" ? "bg-muted" : "bg-green-100"}`}>
              <step.icon className={`h-5 w-5 ${step.status === "incomplete" ? "text-muted-foreground" : "text-green-600"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                <Badge variant="secondary" className="text-xs">
                  {step.status === "incomplete" ? "Required" : "Complete"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
            </div>
            <Link to={i < 2 ? "/onboarding-identity" : "/onboarding-payouts"}>
              <Button variant="outline" size="sm">
                {step.status === "incomplete" ? "Start" : "View"}
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Trust info */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-foreground">Why verification matters</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Verified creators earn 3x more bookings on average. Members trust verified profiles,
              and your verified badge shows on your public profile. All documents are encrypted and
              handled securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SETTINGS TAB ─── */
function SettingsTab({ user }: { user: User }) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account preferences.</p>
      </div>

      {/* Account */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Account
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input value={user.email ?? ""} disabled className="h-10 rounded-lg bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="flex items-center gap-3">
              <Input value="••••••••••" disabled className="h-10 rounded-lg bg-muted flex-1" type="password" />
              <Button variant="outline" size="sm">Change</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </h3>
        <div className="space-y-3">
          {[
            { label: "New booking requests", description: "Get notified when a member books your service.", default: true },
            { label: "New messages", description: "Notifications for incoming messages.", default: true },
            { label: "Payout updates", description: "When payouts are processed or fail.", default: true },
            { label: "Marketing emails", description: "Tips, feature updates, and promotions.", default: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Switch defaultChecked={item.default} />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Privacy
        </h3>
        <div className="space-y-3">
          {[
            { label: "Show online status", description: "Let members see when you're online.", default: true },
            { label: "Show response time", description: "Display your average response time on your profile.", default: true },
            { label: "Allow profile indexing", description: "Let search engines index your public profile.", default: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Switch defaultChecked={item.default} />
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-destructive/30 bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-destructive flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Danger Zone
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Delete Account</p>
            <p className="text-xs text-muted-foreground">Permanently delete your account and all associated data. This cannot be undone.</p>
          </div>
          <Button variant="destructive" size="sm">Delete</Button>
        </div>
      </div>
    </div>
  );
}

/* ─── SHARED COMPONENTS ─── */
function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}: {
  icon: any;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-10 text-center">
      <div className="rounded-full bg-muted p-3 w-fit mx-auto mb-3">
        <Icon className="h-6 w-6 text-muted-foreground/60" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo}>
          <Button className="mt-4" size="sm">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
