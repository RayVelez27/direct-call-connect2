import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Flag,
  DollarSign,
  Settings,
  Search,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Eye,
  Ban,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  UserX,
  FileText,
  Image,
  Video,
  MessageSquare,
  CreditCard,
  Activity,
  Globe,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import plezyyLogo from "@/assets/plezyy-logo.jpeg";

const adminNav = [
  { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { label: "Users", icon: Users, id: "users" },
  { label: "Verifications", icon: ShieldCheck, id: "verifications", badge: 12 },
  { label: "Reports", icon: Flag, id: "reports", badge: 5 },
  { label: "Transactions", icon: DollarSign, id: "transactions" },
  { label: "Content", icon: Image, id: "content" },
  { label: "Platform", icon: Settings, id: "platform" },
];

// Mock data
const mockUsers = [
  { id: 1, name: "Valentina S.", email: "val@example.com", role: "creator", status: "active", joined: "Jan 12, 2025", revenue: "$4,230", verified: true },
  { id: 2, name: "Mike R.", email: "mike@example.com", role: "consumer", status: "active", joined: "Feb 3, 2025", revenue: "$0", verified: false },
  { id: 3, name: "Sophia L.", email: "sophia@example.com", role: "creator", status: "active", joined: "Mar 8, 2025", revenue: "$1,890", verified: true },
  { id: 4, name: "Tyler J.", email: "tyler@example.com", role: "consumer", status: "suspended", joined: "Jan 20, 2025", revenue: "$0", verified: false },
  { id: 5, name: "Luna M.", email: "luna@example.com", role: "creator", status: "active", joined: "Apr 1, 2025", revenue: "$3,100", verified: true },
  { id: 6, name: "David K.", email: "david@example.com", role: "consumer", status: "active", joined: "Feb 15, 2025", revenue: "$0", verified: false },
  { id: 7, name: "Aria N.", email: "aria@example.com", role: "creator", status: "pending", joined: "Feb 18, 2026", revenue: "$0", verified: false },
  { id: 8, name: "Jake P.", email: "jake@example.com", role: "consumer", status: "active", joined: "Jan 5, 2026", revenue: "$0", verified: false },
];

const mockVerifications = [
  { id: 1, name: "Aria N.", submitted: "Feb 18, 2026", type: "Passport", status: "pending" },
  { id: 2, name: "Carmen B.", submitted: "Feb 17, 2026", type: "Driver's License", status: "pending" },
  { id: 3, name: "Jade W.", submitted: "Feb 16, 2026", type: "National ID", status: "pending" },
  { id: 4, name: "Mia T.", submitted: "Feb 16, 2026", type: "Passport", status: "pending" },
  { id: 5, name: "Valentina S.", submitted: "Jan 10, 2025", type: "Passport", status: "approved" },
  { id: 6, name: "Sophia L.", submitted: "Mar 5, 2025", type: "Driver's License", status: "approved" },
  { id: 7, name: "Luna M.", submitted: "Mar 28, 2025", type: "National ID", status: "approved" },
  { id: 8, name: "Zara F.", submitted: "Feb 14, 2026", type: "Passport", status: "rejected" },
];

const mockReports = [
  { id: 1, reporter: "Mike R.", reported: "Unknown User", reason: "Fake profile", status: "open", date: "Feb 19, 2026", priority: "high" },
  { id: 2, reporter: "Tyler J.", reported: "Sophia L.", reason: "Misleading service description", status: "open", date: "Feb 18, 2026", priority: "medium" },
  { id: 3, reporter: "David K.", reported: "Luna M.", reason: "No-show on session", status: "investigating", date: "Feb 17, 2026", priority: "high" },
  { id: 4, reporter: "Jake P.", reported: "Carmen B.", reason: "Inappropriate content in preview", status: "open", date: "Feb 16, 2026", priority: "low" },
  { id: 5, reporter: "Aria N.", reported: "Mike R.", reason: "Harassment in messages", status: "resolved", date: "Feb 10, 2026", priority: "high" },
];

const mockTransactions = [
  { id: "TXN-001", consumer: "Mike R.", creator: "Valentina S.", amount: "$55.00", fee: "$5.50", status: "completed", date: "Feb 19, 2026" },
  { id: "TXN-002", consumer: "David K.", creator: "Sophia L.", amount: "$99.00", fee: "$9.90", status: "completed", date: "Feb 18, 2026" },
  { id: "TXN-003", consumer: "Jake P.", creator: "Luna M.", amount: "$25.00", fee: "$2.50", status: "pending", date: "Feb 18, 2026" },
  { id: "TXN-004", consumer: "Tyler J.", creator: "Valentina S.", amount: "$55.00", fee: "$5.50", status: "refunded", date: "Feb 17, 2026" },
  { id: "TXN-005", consumer: "Mike R.", creator: "Luna M.", amount: "$99.00", fee: "$9.90", status: "completed", date: "Feb 16, 2026" },
  { id: "TXN-006", consumer: "David K.", creator: "Valentina S.", amount: "$25.00", fee: "$2.50", status: "completed", date: "Feb 15, 2026" },
];

const mockContent = [
  { id: 1, creator: "Valentina S.", type: "video", title: "Preview clip", status: "approved", flagged: false, date: "Feb 18, 2026" },
  { id: 2, creator: "Sophia L.", type: "image", title: "Profile photo set", status: "approved", flagged: false, date: "Feb 17, 2026" },
  { id: 3, creator: "Luna M.", type: "video", title: "Intro video", status: "pending", flagged: false, date: "Feb 18, 2026" },
  { id: 4, creator: "Carmen B.", type: "image", title: "Gallery upload", status: "pending", flagged: true, date: "Feb 17, 2026" },
  { id: 5, creator: "Aria N.", type: "image", title: "Cover photo", status: "pending", flagged: false, date: "Feb 18, 2026" },
  { id: 6, creator: "Jade W.", type: "gif", title: "Teaser animation", status: "rejected", flagged: true, date: "Feb 16, 2026" },
];

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "w-[72px]" : "w-60"
        }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <img alt="Plezyy" className="h-7 w-auto dark:invert" src={plezyyLogo} />
              <Badge variant="destructive" className="text-[9px] h-4 px-1.5">ADMIN</Badge>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {adminNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant={activeTab === item.id ? "secondary" : "destructive"} className="h-5 min-w-5 flex items-center justify-center text-[10px] px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Admin user */}
        <div className="border-t border-border p-3 shrink-0">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-destructive/10 text-destructive text-xs font-bold">AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">Admin</p>
                <p className="text-[10px] text-muted-foreground">Super Admin</p>
              </div>
              <button className="p-1 rounded text-muted-foreground hover:text-foreground">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-destructive/10 text-destructive text-xs font-bold">AD</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-5 shrink-0">
          <h1 className="text-sm font-semibold text-foreground capitalize">{activeTab}</h1>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8 h-8 w-56 rounded-lg text-sm" />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-accent text-muted-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 overflow-y-auto">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "verifications" && <VerificationsTab />}
          {activeTab === "reports" && <ReportsTab />}
          {activeTab === "transactions" && <TransactionsTab />}
          {activeTab === "content" && <ContentModerationTab />}
          {activeTab === "platform" && <PlatformTab />}
        </main>
      </div>
    </div>
  );
}

/* ═══ DASHBOARD ═══ */
function DashboardTab() {
  const stats = [
    { label: "Total Users", value: "1,247", change: "+12%", trend: "up", icon: Users },
    { label: "Active Creators", value: "186", change: "+8%", trend: "up", icon: UserCheck },
    { label: "Revenue (MTD)", value: "$34,520", change: "+23%", trend: "up", icon: DollarSign },
    { label: "Active Sessions", value: "14", change: "-3%", trend: "down", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">Platform overview and key metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              <div className="p-1.5 rounded-lg bg-secondary">
                <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {s.trend === "up" ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-xs font-semibold ${s.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {s.change}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts placeholder + action items */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue chart placeholder */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Overview</h3>
          <div className="h-48 flex items-end gap-2 px-4">
            {[35, 50, 42, 68, 55, 72, 80, 65, 90, 78, 85, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary/80 hover:bg-primary transition-colors"
                  style={{ height: `${h * 1.8}px` }}
                />
                <span className="text-[9px] text-muted-foreground">
                  {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action items */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Needs Attention</h3>
          <div className="space-y-3">
            {[
              { icon: ShieldCheck, text: "12 pending verifications", color: "text-yellow-500", bg: "bg-yellow-500/10" },
              { icon: Flag, text: "5 open reports", color: "text-red-500", bg: "bg-red-500/10" },
              { icon: Image, text: "3 flagged content items", color: "text-orange-500", bg: "bg-orange-500/10" },
              { icon: CreditCard, text: "1 failed payout", color: "text-red-500", bg: "bg-red-500/10" },
              { icon: UserX, text: "2 suspended accounts", color: "text-muted-foreground", bg: "bg-secondary" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors">
                <div className={`p-1.5 rounded-md ${item.bg}`}>
                  <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                </div>
                <span className="text-sm text-foreground flex-1">{item.text}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { time: "2 min ago", text: "New creator signup: Aria N.", type: "user" },
            { time: "15 min ago", text: "Verification submitted: Carmen B.", type: "verification" },
            { time: "32 min ago", text: "Report filed: Fake profile (by Mike R.)", type: "report" },
            { time: "1 hr ago", text: "Transaction completed: $99.00 (David K. → Sophia L.)", type: "transaction" },
            { time: "2 hrs ago", text: "Content flagged: Gallery upload by Carmen B.", type: "content" },
            { time: "3 hrs ago", text: "Payout processed: $1,200 to Valentina S.", type: "payout" },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[10px] text-muted-foreground font-medium w-16 pt-0.5 shrink-0">{a.time}</span>
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span className="text-sm text-foreground">{a.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ USERS ═══ */
function UsersTab() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-foreground">Users</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-8 h-8 w-56 rounded-lg text-sm" />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" className="text-xs">All ({mockUsers.length})</TabsTrigger>
          <TabsTrigger value="creators" className="text-xs">Creators ({mockUsers.filter(u => u.role === "creator").length})</TabsTrigger>
          <TabsTrigger value="consumers" className="text-xs">Members ({mockUsers.filter(u => u.role === "consumer").length})</TabsTrigger>
          <TabsTrigger value="suspended" className="text-xs">Suspended (1)</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">User</TableHead>
              <TableHead className="text-xs">Role</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Verified</TableHead>
              <TableHead className="text-xs">Joined</TableHead>
              <TableHead className="text-xs text-right">Revenue</TableHead>
              <TableHead className="text-xs w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px] capitalize">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell>
                  {user.verified ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground/40" />
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{user.joined}</TableCell>
                <TableCell className="text-xs text-right font-medium">{user.revenue}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded hover:bg-accent"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-xs">View Profile</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">Edit User</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs text-destructive">Suspend</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ═══ VERIFICATIONS ═══ */
function VerificationsTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Verifications</h2>
          <p className="text-sm text-muted-foreground">Review creator identity documents.</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-yellow-500" /> 4 pending</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> 3 approved</span>
          <span className="flex items-center gap-1.5"><XCircle className="h-3.5 w-3.5 text-red-500" /> 1 rejected</span>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Creator</TableHead>
              <TableHead className="text-xs">Document Type</TableHead>
              <TableHead className="text-xs">Submitted</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs w-48">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVerifications.map((v) => (
              <TableRow key={v.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                        {v.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{v.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{v.type}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{v.submitted}</TableCell>
                <TableCell><StatusBadge status={v.status} /></TableCell>
                <TableCell>
                  {v.status === "pending" ? (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                        <Eye className="h-3 w-3" /> Review
                      </Button>
                      <Button size="sm" className="h-7 text-xs gap-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-3 w-3" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="h-7 text-xs gap-1">
                        <XCircle className="h-3 w-3" /> Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ═══ REPORTS ═══ */
function ReportsTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Reports</h2>
          <p className="text-sm text-muted-foreground">User-submitted reports and flagged issues.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Reporter</TableHead>
              <TableHead className="text-xs">Reported User</TableHead>
              <TableHead className="text-xs">Reason</TableHead>
              <TableHead className="text-xs">Priority</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReports.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-sm font-medium">{r.reporter}</TableCell>
                <TableCell className="text-sm">{r.reported}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-48 truncate">{r.reason}</TableCell>
                <TableCell>
                  <Badge
                    variant={r.priority === "high" ? "destructive" : "secondary"}
                    className={`text-[10px] capitalize ${r.priority === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-0" : ""}`}
                  >
                    {r.priority}
                  </Badge>
                </TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded hover:bg-accent"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-xs">View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">Mark Investigating</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">Resolve</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs text-destructive">Ban Reported User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ═══ TRANSACTIONS ═══ */
function TransactionsTab() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Transactions</h2>
          <p className="text-sm text-muted-foreground">All platform payments and payouts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground">Total Volume (MTD)</span>
          <p className="text-xl font-bold text-foreground mt-1">$34,520</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground">Platform Fees (MTD)</span>
          <p className="text-xl font-bold text-foreground mt-1">$3,452</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground">Refunds (MTD)</span>
          <p className="text-xl font-bold text-foreground mt-1">$55.00</p>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">ID</TableHead>
              <TableHead className="text-xs">Consumer</TableHead>
              <TableHead className="text-xs">Creator</TableHead>
              <TableHead className="text-xs text-right">Amount</TableHead>
              <TableHead className="text-xs text-right">Fee</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-xs font-mono text-muted-foreground">{t.id}</TableCell>
                <TableCell className="text-sm">{t.consumer}</TableCell>
                <TableCell className="text-sm">{t.creator}</TableCell>
                <TableCell className="text-sm text-right font-medium">{t.amount}</TableCell>
                <TableCell className="text-xs text-right text-muted-foreground">{t.fee}</TableCell>
                <TableCell><StatusBadge status={t.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ═══ CONTENT MODERATION ═══ */
function ContentModerationTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Content Moderation</h2>
          <p className="text-sm text-muted-foreground">Review uploaded media from creators.</p>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="text-xs">Pending Review (3)</TabsTrigger>
          <TabsTrigger value="flagged" className="text-xs">Flagged (2)</TabsTrigger>
          <TabsTrigger value="approved" className="text-xs">Approved</TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockContent.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-secondary to-muted flex items-center justify-center relative">
              {item.type === "video" ? (
                <Video className="h-8 w-8 text-muted-foreground/40" />
              ) : item.type === "gif" ? (
                <FileText className="h-8 w-8 text-muted-foreground/40" />
              ) : (
                <Image className="h-8 w-8 text-muted-foreground/40" />
              )}
              <Badge className="absolute top-2 left-2 text-[10px] capitalize">{item.type}</Badge>
              {item.flagged && (
                <Badge variant="destructive" className="absolute top-2 right-2 text-[10px] gap-1">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  Flagged
                </Badge>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <StatusBadge status={item.status} />
              </div>
              <p className="text-xs text-muted-foreground mb-3">By {item.creator} &middot; {item.date}</p>
              {item.status === "pending" && (
                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700">Approve</Button>
                  <Button size="sm" variant="destructive" className="flex-1 h-7 text-xs">Reject</Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ PLATFORM SETTINGS ═══ */
function PlatformTab() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-foreground">Platform Settings</h2>
        <p className="text-sm text-muted-foreground">Global configuration for the Plezyy marketplace.</p>
      </div>

      {/* Fees */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Commission & Fees
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Platform Fee (%)</label>
            <Input defaultValue="10" className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Minimum Payout ($)</label>
            <Input defaultValue="50" className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Payout Frequency</label>
            <Input defaultValue="Weekly" className="h-9 rounded-lg text-sm" disabled />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Stripe Connected</label>
            <Input defaultValue="Yes — Live Mode" className="h-9 rounded-lg text-sm" disabled />
          </div>
        </div>
      </div>

      {/* Content rules */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          Content & Moderation
        </h3>
        <div className="space-y-3">
          {[
            { label: "Auto-flag explicit thumbnails", description: "AI scans uploads and auto-flags potentially explicit preview images.", default: true },
            { label: "Require verification before publishing", description: "Creators must be verified before their services go live.", default: true },
            { label: "Allow unverified profiles to be listed", description: "Show unverified profiles in search results with a warning badge.", default: false },
            { label: "Enable content reporting", description: "Members can report services, profiles, or messages.", default: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1.5">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Switch defaultChecked={item.default} />
            </div>
          ))}
        </div>
      </div>

      {/* Limits */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Platform Limits
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Max upload size (MB)</label>
            <Input defaultValue="50" className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Max services per creator</label>
            <Input defaultValue="20" className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Max gallery items</label>
            <Input defaultValue="50" className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Session timeout (min)</label>
            <Input defaultValue="120" className="h-9 rounded-lg text-sm" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="px-8">Save Settings</Button>
      </div>
    </div>
  );
}

/* ═══ SHARED ═══ */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { class: string; icon: any }> = {
    active: { class: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400", icon: CheckCircle2 },
    approved: { class: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400", icon: CheckCircle2 },
    completed: { class: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400", icon: CheckCircle2 },
    resolved: { class: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400", icon: CheckCircle2 },
    pending: { class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400", icon: Clock },
    investigating: { class: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400", icon: Eye },
    open: { class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400", icon: AlertTriangle },
    suspended: { class: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400", icon: Ban },
    rejected: { class: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400", icon: XCircle },
    refunded: { class: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400", icon: RefreshCw },
  };
  const c = config[status] ?? config.pending;
  return (
    <Badge variant="secondary" className={`text-[10px] capitalize border-0 gap-1 ${c.class}`}>
      <c.icon className="h-2.5 w-2.5" />
      {status}
    </Badge>
  );
}
