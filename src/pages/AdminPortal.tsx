import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  LineChart,
  Users,
  Star,
  Heart,
  Film,
  MessageSquare,
  AlertTriangle,
  Globe,
  DollarSign,
  Send,
  Megaphone,
  Settings,
  Trophy,
  Search,
  Bell,
  LogOut,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import plezyyLogo from "@/assets/Untitled design - 2026-03-27T091410.050.png";

type PageId =
  | "dashboard"
  | "analytics"
  | "users"
  | "creators"
  | "fans"
  | "content"
  | "messages"
  | "reports"
  | "ip"
  | "finance"
  | "payouts"
  | "announcements"
  | "config"
  | "performance"
  | "audit";

type StatusKind =
  | "active"
  | "suspended"
  | "banned"
  | "pending"
  | "flagged"
  | "approved"
  | "paid"
  | "held"
  | "refunded"
  | "creator"
  | "fan"
  | "high"
  | "medium"
  | "low";

const statusStyles: Record<StatusKind, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  paid: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  suspended: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  held: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  flagged: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  banned: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  refunded: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  pending: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  creator: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  fan: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

function StatusPill({ kind, children }: { kind: StatusKind; children: React.ReactNode }) {
  return (
    <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusStyles[kind]}`}>
      {children}
    </span>
  );
}

function Avatar({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#EBF1FF] dark:bg-[#4180FB]/20 text-[#1E4FBF] dark:text-[#A8C4FF] text-[13px] font-bold ${className}`}
    >
      {initials}
    </span>
  );
}

function StatCard({
  label,
  value,
  change,
  changeKind,
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: string;
  changeKind?: "up" | "down" | "neutral";
  icon?: React.ElementType;
}) {
  const changeColor =
    changeKind === "up"
      ? "text-green-600 dark:text-green-400"
      : changeKind === "down"
      ? "text-red-600 dark:text-red-400"
      : "text-gray-500 dark:text-gray-400";
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 relative">
      {Icon && (
        <Icon className="absolute top-4 right-4 w-5 h-5 text-gray-300 dark:text-gray-600" />
      )}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      {change && <div className={`text-xs mt-1 ${changeColor}`}>{change}</div>}
    </div>
  );
}

function TableCard({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-5">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

const tableHeadCls =
  "px-3.5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800";
const tableCellCls =
  "px-3.5 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800/60";

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}

function SmallBtn({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "red" | "green";
}) {
  const base =
    "text-[11px] px-2.5 py-1 rounded-full border whitespace-nowrap transition-colors";
  const styles =
    variant === "red"
      ? "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-red-500 hover:text-white hover:border-red-500"
      : variant === "green"
      ? "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-green-600 hover:text-white hover:border-green-600"
      : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-[#4180FB] hover:text-white hover:border-[#4180FB]";
  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

function PeriodTabs({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`text-xs px-3.5 py-1 rounded-full border transition-colors ${
            active === o
              ? "bg-[#4180FB] text-white border-[#4180FB]"
              : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function BarChart({
  data,
  color = "#4180FB",
  height = 100,
}: {
  data: { label: string; value: string; pct: number }[];
  color?: string;
  height?: number;
}) {
  return (
    <div className="relative pt-5 pb-6">
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#1E4FBF] dark:text-[#A8C4FF] whitespace-nowrap">
              {d.value}
            </div>
            <div
              className="rounded-t-md transition-opacity hover:opacity-100 opacity-80"
              style={{ height: `${d.pct}%`, background: color }}
            />
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 whitespace-nowrap">
              {d.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutList({
  rows,
}: {
  rows: { label: string; pct: number; color: string }[];
}) {
  return (
    <div className="flex flex-col gap-2.5 mt-2">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: r.color }} />
          <span className="text-sm text-gray-500 dark:text-gray-400 flex-1 truncate">{r.label}</span>
          <span className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full flex-1 max-w-[160px] overflow-hidden">
            <span
              className="h-full block rounded-full"
              style={{ width: `${r.pct}%`, background: r.color }}
            />
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white w-10 text-right">{r.pct}%</span>
        </div>
      ))}
    </div>
  );
}

// ──────────── PAGE COMPONENTS ────────────

function DashboardPage() {
  const [period, setPeriod] = useState("Week");
  return (
    <div>
      <PageHeader title="Welcome back, Joseph" subtitle="Here's everything happening on Plezyy right now." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        <StatCard label="Total users" value="24,810" change="↑ 142 today" changeKind="up" icon={Users} />
        <StatCard label="Active creators" value="3,204" change="↑ 38 this week" changeKind="up" icon={Star} />
        <StatCard label="Revenue today" value="$8,420" change="↑ 12% vs yesterday" changeKind="up" icon={DollarSign} />
        <StatCard label="Open reports" value="12" change="↑ 4 new today" changeKind="down" icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Revenue this week</h3>
          <PeriodTabs options={["Week", "Month", "Year"]} active={period} onChange={setPeriod} />
          <BarChart
            data={[
              { label: "Mon", value: "$5.2k", pct: 55 },
              { label: "Tue", value: "$6.7k", pct: 70 },
              { label: "Wed", value: "$4.6k", pct: 48 },
              { label: "Thu", value: "$7.8k", pct: 82 },
              { label: "Fri", value: "$8.6k", pct: 90 },
              { label: "Sat", value: "$9.5k", pct: 100 },
              { label: "Sun", value: "$8.4k", pct: 88 },
            ]}
          />
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Revenue by content type</h3>
          <DonutList
            rows={[
              { label: "Custom videos", pct: 68, color: "#4180FB" },
              { label: "Live chat", pct: 18, color: "#1E4FBF" },
              { label: "Photo sets", pct: 9, color: "#16a34a" },
              { label: "Other", pct: 5, color: "#f59e0b" },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard label="Orders today" value="841" change="↑ 8% vs avg" changeKind="up" />
        <StatCard label="Transactions (month)" value="18,402" change="↑ 21% MoM" changeKind="up" />
        <StatCard label="Banned today" value="3" change="0 appeals" />
        <StatCard label="Active countries" value="47" change="↑ 2 new this week" changeKind="up" />
      </div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Platform-wide performance metrics." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        <StatCard label="Total GMV (all time)" value="$1.24M" change="↑ Growing" changeKind="up" />
        <StatCard label="Avg order value" value="$42.80" change="↑ $3.20 MoM" changeKind="up" />
        <StatCard label="Platform take rate" value="20%" change="$248k earned" />
        <StatCard label="Repeat buyer rate" value="61%" change="↑ 4% MoM" changeKind="up" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">New signups per day (last 7 days)</h3>
          <BarChart
            color="#1E4FBF"
            height={80}
            data={[
              { label: "Mon", value: "120", pct: 60 },
              { label: "Tue", value: "148", pct: 75 },
              { label: "Wed", value: "98", pct: 50 },
              { label: "Thu", value: "181", pct: 90 },
              { label: "Fri", value: "202", pct: 100 },
              { label: "Sat", value: "171", pct: 85 },
              { label: "Sun", value: "138", pct: 70 },
            ]}
          />
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Top countries by revenue</h3>
          <DonutList
            rows={[
              { label: "🇺🇸 USA", pct: 52, color: "#1E4FBF" },
              { label: "🇬🇧 UK", pct: 18, color: "#16a34a" },
              { label: "🇨🇦 Canada", pct: 12, color: "#f59e0b" },
              { label: "🇦🇺 Australia", pct: 9, color: "#4180FB" },
              { label: "🌍 Other", pct: 9, color: "#9ca3af" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

interface UserRow {
  initials: string;
  name: string;
  email: string;
  role: "Creator" | "Fan";
  joined: string;
  status: "Active" | "Suspended" | "Banned";
}
const allUsers: UserRow[] = [
  { initials: "AR", name: "Alexis Rivera", email: "alexis@email.com", role: "Creator", joined: "Jan 12, 2025", status: "Active" },
  { initials: "JM", name: "Jordan Mills", email: "jordan@email.com", role: "Fan", joined: "Feb 3, 2025", status: "Active" },
  { initials: "MK", name: "Mike Karr", email: "mike@email.com", role: "Fan", joined: "Mar 7, 2025", status: "Suspended" },
  { initials: "YN", name: "Yuki Naka", email: "yuki@email.com", role: "Creator", joined: "Mar 19, 2025", status: "Active" },
  { initials: "ST", name: "Sofia Torres", email: "sofia@email.com", role: "Creator", joined: "Apr 1, 2025", status: "Banned" },
];

function UsersPage({
  onPasswordChange,
  onDelete,
}: {
  onPasswordChange: (name: string) => void;
  onDelete: (name: string) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = allUsers.filter(
    (u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div>
      <PageHeader title="All Users" subtitle="View, edit, suspend, or permanently delete any user account." />
      <TableCard
        title="User accounts (24,810 total)"
        actions={
          <>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email…"
              className="h-8 w-48 rounded-full text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-8 text-xs"
              onClick={() => toast.success("Export CSV downloaded")}
            >
              Export CSV
            </Button>
          </>
        }
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={tableHeadCls}>User</th>
              <th className={tableHeadCls}>Email</th>
              <th className={tableHeadCls}>Password</th>
              <th className={tableHeadCls}>Role</th>
              <th className={tableHeadCls}>Joined</th>
              <th className={tableHeadCls}>Status</th>
              <th className={tableHeadCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className={tableCellCls}>
                  <div className="flex items-center gap-2">
                    <Avatar initials={u.initials} />
                    <span className="font-semibold text-gray-900 dark:text-white">{u.name}</span>
                  </div>
                </td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{u.email}</td>
                <td className={tableCellCls}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-500">••••••••</span>
                    <SmallBtn onClick={() => onPasswordChange(u.name)}>Change</SmallBtn>
                  </div>
                </td>
                <td className={tableCellCls}>
                  <StatusPill kind={u.role === "Creator" ? "creator" : "fan"}>{u.role}</StatusPill>
                </td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{u.joined}</td>
                <td className={tableCellCls}>
                  <StatusPill
                    kind={u.status === "Active" ? "active" : u.status === "Suspended" ? "suspended" : "banned"}
                  >
                    {u.status}
                  </StatusPill>
                </td>
                <td className={tableCellCls}>
                  <div className="flex gap-1.5 flex-wrap">
                    {u.status === "Active" && (
                      <>
                        <SmallBtn onClick={() => toast.info(`Viewing ${u.name} profile`)}>View</SmallBtn>
                        <SmallBtn onClick={() => toast.success(`${u.name} suspended`)}>Suspend</SmallBtn>
                      </>
                    )}
                    {u.status === "Suspended" && (
                      <SmallBtn variant="green" onClick={() => toast.success(`${u.name} reinstated`)}>
                        Reinstate
                      </SmallBtn>
                    )}
                    {u.status === "Banned" && (
                      <SmallBtn variant="green" onClick={() => toast.success(`${u.name} unbanned`)}>
                        Unban
                      </SmallBtn>
                    )}
                    <SmallBtn variant="red" onClick={() => onDelete(u.name)}>
                      Delete
                    </SmallBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}

function CreatorsPage() {
  const creators = [
    { initials: "AR", name: "Alexis Rivera", ip: "104.28.41.12", email: "alexis@email.com", revenue: "$4,820", orders: 312, rating: "4.9", verified: "approved" as StatusKind, verifiedLabel: "Verified" },
    { initials: "JM", name: "Jordan M.", ip: "198.51.100.22", email: "jordan@email.com", revenue: "$2,140", orders: 198, rating: "4.8", verified: "approved" as StatusKind, verifiedLabel: "Verified" },
    { initials: "LV", name: "Luna V.", ip: "203.0.113.45", email: "luna@email.com", revenue: "$540", orders: 54, rating: "4.5", verified: "pending" as StatusKind, verifiedLabel: "Pending" },
  ];
  return (
    <div>
      <PageHeader title="Creator Management" subtitle="Manage verification, visibility, and creator performance." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        <StatCard label="Total creators" value="3,204" />
        <StatCard label="Pending verification" value="47" change="Needs review" changeKind="down" />
        <StatCard label="Avg creator rating" value="4.7 ★" />
        <StatCard label="Creators earning $1k+/mo" value="812" />
      </div>
      <TableCard title="Creator accounts">
        <table className="w-full">
          <thead>
            <tr>
              <th className={tableHeadCls}>Creator</th>
              <th className={tableHeadCls}>IP Address</th>
              <th className={tableHeadCls}>Email</th>
              <th className={tableHeadCls}>Revenue (MTD)</th>
              <th className={tableHeadCls}>Orders</th>
              <th className={tableHeadCls}>Rating</th>
              <th className={tableHeadCls}>Verified</th>
              <th className={tableHeadCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {creators.map((c) => (
              <tr key={c.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className={tableCellCls}>
                  <div className="flex items-center gap-2">
                    <Avatar initials={c.initials} />
                    <span className="font-semibold text-gray-900 dark:text-white">{c.name}</span>
                  </div>
                </td>
                <td className={`${tableCellCls} font-mono text-xs text-gray-500`}>{c.ip}</td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{c.email}</td>
                <td className={`${tableCellCls} font-bold text-gray-900 dark:text-white`}>{c.revenue}</td>
                <td className={tableCellCls}>{c.orders}</td>
                <td className={tableCellCls}>★ {c.rating}</td>
                <td className={tableCellCls}>
                  <StatusPill kind={c.verified}>{c.verifiedLabel}</StatusPill>
                </td>
                <td className={tableCellCls}>
                  <div className="flex gap-1.5 flex-wrap">
                    {c.verifiedLabel === "Pending" ? (
                      <>
                        <SmallBtn variant="green" onClick={() => toast.success(`${c.name} verified`)}>Approve</SmallBtn>
                        <SmallBtn variant="red" onClick={() => toast.error(`${c.name} rejected`)}>Reject</SmallBtn>
                      </>
                    ) : (
                      <>
                        <SmallBtn onClick={() => toast.info(`Viewing ${c.name}`)}>View</SmallBtn>
                        <SmallBtn variant="red" onClick={() => toast.success(`${c.name} suspended`)}>Suspend</SmallBtn>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}

function FansPage() {
  const fans = [
    { initials: "MK", name: "Mike K.", email: "mike@email.com", ip: "192.168.1.44", spent: "$1,240", joined: "Feb 2025", status: "active" as StatusKind, statusLabel: "Active" },
    { initials: "RD", name: "Ryan D.", email: "ryan@email.com", ip: "10.0.0.88", spent: "$320", joined: "Mar 2025", status: "flagged" as StatusKind, statusLabel: "Flagged" },
  ];
  return (
    <div>
      <PageHeader title="Fan Accounts" subtitle="Monitor fan activity, spending, and reported behavior." />
      <TableCard
        title="Fan accounts"
        actions={<Input placeholder="Search fans…" className="h-8 w-48 rounded-full text-sm" />}
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={tableHeadCls}>Fan</th>
              <th className={tableHeadCls}>Email</th>
              <th className={tableHeadCls}>IP Address</th>
              <th className={tableHeadCls}>Total Spent</th>
              <th className={tableHeadCls}>Joined</th>
              <th className={tableHeadCls}>Status</th>
              <th className={tableHeadCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fans.map((f) => (
              <tr key={f.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className={tableCellCls}>
                  <div className="flex items-center gap-2">
                    <Avatar initials={f.initials} />
                    <span className="font-semibold text-gray-900 dark:text-white">{f.name}</span>
                  </div>
                </td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{f.email}</td>
                <td className={`${tableCellCls} font-mono text-xs text-gray-500`}>{f.ip}</td>
                <td className={`${tableCellCls} font-bold text-gray-900 dark:text-white`}>{f.spent}</td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{f.joined}</td>
                <td className={tableCellCls}>
                  <StatusPill kind={f.status}>{f.statusLabel}</StatusPill>
                </td>
                <td className={tableCellCls}>
                  <div className="flex gap-1.5">
                    <SmallBtn>{f.statusLabel === "Flagged" ? "Review" : "View"}</SmallBtn>
                    <SmallBtn variant="red">{f.statusLabel === "Flagged" ? "Ban" : "Suspend"}</SmallBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}

function ContentPage() {
  const items = [
    { initials: "AR", name: "Alexis R.", type: "Video", reason: "Possible TOS violation", reporter: "AI auto-flag", date: "Today" },
    { initials: "ST", name: "Sofia T.", type: "Photo", reason: "User report", reporter: "fan@email.com", date: "Yesterday" },
    { initials: "LV", name: "Luna V.", type: "Post text", reason: "Spam / solicitation", reporter: "2 users", date: "Apr 19" },
  ];
  return (
    <div>
      <PageHeader title="Content Moderation" subtitle="Review flagged posts, videos, and profile content before or after publishing." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        <StatCard label="Flagged items" value="7" change="Needs review" changeKind="down" />
        <StatCard label="Approved today" value="42" />
        <StatCard label="Removed today" value="5" />
        <StatCard label="Auto-flagged (AI)" value="3" />
      </div>
      <TableCard title="Flagged content queue">
        <table className="w-full">
          <thead>
            <tr>
              <th className={tableHeadCls}>Creator</th>
              <th className={tableHeadCls}>Content type</th>
              <th className={tableHeadCls}>Reason flagged</th>
              <th className={tableHeadCls}>Reported by</th>
              <th className={tableHeadCls}>Date</th>
              <th className={tableHeadCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.name + it.type} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className={tableCellCls}>
                  <div className="flex items-center gap-2">
                    <Avatar initials={it.initials} />
                    <span className="font-semibold text-gray-900 dark:text-white">{it.name}</span>
                  </div>
                </td>
                <td className={tableCellCls}>{it.type}</td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{it.reason}</td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{it.reporter}</td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{it.date}</td>
                <td className={tableCellCls}>
                  <div className="flex gap-1.5 flex-wrap">
                    <SmallBtn onClick={() => toast.info("Opening content preview")}>Preview</SmallBtn>
                    <SmallBtn variant="green" onClick={() => toast.success("Content approved")}>Approve</SmallBtn>
                    <SmallBtn variant="red" onClick={() => toast.success("Content removed")}>Remove</SmallBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}

function MessagesPage() {
  const messages = [
    { initials: "AR", meta: "Alexis Rivera → Mike K. · Today 2:14pm", body: "Hey! Your order is ready, I'll send the link now 🌹", flagged: false },
    { initials: "RD", meta: "Ryan D. → Jordan M. · Today 11:32am", body: "Can we do this off-platform? I'll pay you directly...", flagged: true },
    { initials: "YN", meta: "Yuki N. → Sofia T. · Yesterday 8:44pm", body: "Loved your latest post! Can you do a custom voice note for me?", flagged: false },
    { initials: "MK", meta: "Mike K. → Alexis R. · Apr 18 5:01pm", body: "That was amazing, ordering again for sure. Thank you!", flagged: false },
  ];
  return (
    <div>
      <PageHeader title="Message Monitoring" subtitle="Read all platform messages. Flagged messages are highlighted." />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent messages</h3>
          <Input placeholder="Search messages…" className="h-8 w-48 rounded-full text-sm" />
        </div>
        <div className="px-5 py-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className="flex gap-3 py-3 border-b border-gray-100 dark:border-gray-800/60 last:border-b-0"
            >
              <Avatar initials={m.initials} className="w-9 h-9 mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                  {m.meta}
                  {m.flagged && (
                    <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      FLAGGED
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-100">{m.body}</div>
                {m.flagged && (
                  <div className="mt-2 flex gap-1.5">
                    <SmallBtn variant="red" onClick={() => toast.success("Message removed + user warned")}>
                      Remove &amp; warn user
                    </SmallBtn>
                    <SmallBtn onClick={() => toast.info("Dismissed")}>Dismiss</SmallBtn>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportsPage() {
  const reports = [
    { reporter: "fan001@email.com", target: "Sofia Torres", reason: "Harassment", date: "Today", priority: "high" as StatusKind, priorityLabel: "High" },
    { reporter: "fan204@email.com", target: "Mike Karr", reason: "Attempted off-platform payment", date: "Yesterday", priority: "medium" as StatusKind, priorityLabel: "Medium" },
    { reporter: "fan512@email.com", target: "Luna V.", reason: "Spam messages", date: "Apr 18", priority: "low" as StatusKind, priorityLabel: "Low" },
  ];
  return (
    <div>
      <PageHeader title="User Reports" subtitle="All reports submitted by users against creators or other fans." />
      <TableCard title="Open reports (12)">
        <table className="w-full">
          <thead>
            <tr>
              <th className={tableHeadCls}>Reporter</th>
              <th className={tableHeadCls}>Reported user</th>
              <th className={tableHeadCls}>Reason</th>
              <th className={tableHeadCls}>Date</th>
              <th className={tableHeadCls}>Priority</th>
              <th className={tableHeadCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.target + r.reason} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{r.reporter}</td>
                <td className={`${tableCellCls} font-bold text-gray-900 dark:text-white`}>{r.target}</td>
                <td className={tableCellCls}>{r.reason}</td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{r.date}</td>
                <td className={tableCellCls}>
                  <StatusPill kind={r.priority}>{r.priorityLabel}</StatusPill>
                </td>
                <td className={tableCellCls}>
                  <div className="flex gap-1.5 flex-wrap">
                    {r.priorityLabel === "High" && (
                      <SmallBtn variant="red" onClick={() => toast.success(`${r.target} banned`)}>Ban user</SmallBtn>
                    )}
                    {r.priorityLabel === "Medium" && (
                      <>
                        <SmallBtn onClick={() => toast.success(`Warning sent to ${r.target}`)}>Warn</SmallBtn>
                        <SmallBtn variant="red">Suspend</SmallBtn>
                      </>
                    )}
                    {r.priorityLabel === "Low" && <SmallBtn>Review</SmallBtn>}
                    <SmallBtn onClick={() => toast.info("Dismissed")}>Dismiss</SmallBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}

function IpPage() {
  const [ip, setIp] = useState("");
  const blocked = [
    { ip: "203.0.113.99", user: "banned_user@email.com", reason: "Chargeback fraud", date: "Apr 10, 2025" },
    { ip: "198.51.100.77", user: "spammer@email.com", reason: "Mass spam messages", date: "Apr 14, 2025" },
    { ip: "10.20.30.40", user: "Unknown", reason: "Multiple failed login attempts", date: "Apr 20, 2025" },
  ];
  const creatorIps = [
    { name: "Alexis Rivera", ip: "104.28.41.12", country: "🇺🇸 USA", lastActive: "Today 3:22pm" },
    { name: "Jordan M.", ip: "198.51.100.22", country: "🇬🇧 UK", lastActive: "Today 1:40pm" },
    { name: "Yuki Naka", ip: "203.0.113.45", country: "🇯🇵 Japan", lastActive: "Yesterday" },
  ];
  return (
    <div>
      <PageHeader title="IP Address Management" subtitle="View creator IP addresses and block suspicious or abusive IPs." />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-5">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Block an IP address</h3>
        <div className="flex gap-2 mb-2">
          <Input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Enter IP address (e.g. 192.168.1.1)"
            className="rounded-full"
          />
          <Button
            className="rounded-full bg-red-600 hover:bg-red-700"
            onClick={() => {
              if (!ip.trim()) return toast.error("Please enter an IP address");
              toast.success(`IP ${ip} has been blocked`);
              setIp("");
            }}
          >
            Block IP
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Blocked IPs cannot access Plezyy from any account or device.
        </p>
      </div>
      <TableCard
        title="Currently blocked IPs"
        actions={
          <Button variant="outline" size="sm" className="rounded-full h-8 text-xs" onClick={() => toast.success("IP log exported")}>
            Export
          </Button>
        }
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={tableHeadCls}>IP Address</th>
              <th className={tableHeadCls}>Linked user</th>
              <th className={tableHeadCls}>Reason</th>
              <th className={tableHeadCls}>Blocked on</th>
              <th className={tableHeadCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blocked.map((b) => (
              <tr key={b.ip} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className={`${tableCellCls} font-mono text-xs`}>{b.ip}</td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{b.user}</td>
                <td className={tableCellCls}>{b.reason}</td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{b.date}</td>
                <td className={tableCellCls}>
                  <SmallBtn variant="green" onClick={() => toast.success("IP unblocked")}>Unblock</SmallBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
      <TableCard
        title="Creator IP log"
        actions={<Input placeholder="Search by name…" className="h-8 w-48 rounded-full text-sm" />}
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={tableHeadCls}>Creator</th>
              <th className={tableHeadCls}>Last known IP</th>
              <th className={tableHeadCls}>Country</th>
              <th className={tableHeadCls}>Last active</th>
              <th className={tableHeadCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {creatorIps.map((c) => (
              <tr key={c.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className={`${tableCellCls} font-bold text-gray-900 dark:text-white`}>{c.name}</td>
                <td className={`${tableCellCls} font-mono text-xs`}>{c.ip}</td>
                <td className={tableCellCls}>{c.country}</td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{c.lastActive}</td>
                <td className={tableCellCls}>
                  <SmallBtn variant="red" onClick={() => toast.success(`IP ${c.ip} blocked`)}>Block IP</SmallBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}

function FinancePage() {
  const [period, setPeriod] = useState("Today");
  const [query, setQuery] = useState("");
  const allTxns = [
    { id: "#TXN-88201", fan: "mike@email.com", creator: "Alexis R.", amount: "$49", cut: "$9.80", type: "Custom video", status: "paid" as StatusKind, statusLabel: "Paid", date: "Today 2:12pm" },
    { id: "#TXN-88199", fan: "ryan@email.com", creator: "Jordan M.", amount: "$25", cut: "$5.00", type: "Live chat", status: "paid" as StatusKind, statusLabel: "Paid", date: "Today 11:04am" },
    { id: "#TXN-88195", fan: "fan512@email.com", creator: "Yuki N.", amount: "$40", cut: "$8.00", type: "Photo set", status: "held" as StatusKind, statusLabel: "Held", date: "Today 9:30am" },
    { id: "#TXN-88190", fan: "fan204@email.com", creator: "Sofia T.", amount: "$120", cut: "$24.00", type: "Premium video", status: "refunded" as StatusKind, statusLabel: "Refunded", date: "Yesterday" },
  ];
  const q = query.trim().toLowerCase();
  const txns = q
    ? allTxns.filter((t) =>
        [t.id, t.fan, t.creator, t.type, t.statusLabel, t.amount].some((v) => v.toLowerCase().includes(q))
      )
    : allTxns;
  return (
    <div>
      <PageHeader title="Financial Reports" subtitle="All revenue, transactions, refunds, and platform earnings." />
      <PeriodTabs
        options={["Today", "This week", "This month", "This year", "All time"]}
        active={period}
        onChange={setPeriod}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        <StatCard label="Gross transaction volume" value="$8,420" change="Today" />
        <StatCard label="Platform revenue (20%)" value="$1,684" change="↑ 12% vs yesterday" changeKind="up" />
        <StatCard label="Refunds issued" value="$120" change="3 refunds" changeKind="down" />
        <StatCard label="Pending payouts" value="$24,810" change="To creators" />
      </div>
      <div className="relative mb-3 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transactions by ID, fan, creator, type…"
          className="pl-9"
        />
      </div>
      <TableCard
        title="Recent transactions"
        actions={
          <Button variant="outline" size="sm" className="rounded-full h-8 text-xs" onClick={() => toast.success("Finance report exported")}>
            Export CSV
          </Button>
        }
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={tableHeadCls}>Transaction ID</th>
              <th className={tableHeadCls}>Fan</th>
              <th className={tableHeadCls}>Creator</th>
              <th className={tableHeadCls}>Amount</th>
              <th className={tableHeadCls}>Platform cut</th>
              <th className={tableHeadCls}>Type</th>
              <th className={tableHeadCls}>Status</th>
              <th className={tableHeadCls}>Date</th>
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className={`${tableCellCls} font-mono text-xs`}>{t.id}</td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{t.fan}</td>
                <td className={`${tableCellCls} font-bold text-gray-900 dark:text-white`}>{t.creator}</td>
                <td className={`${tableCellCls} font-bold text-gray-900 dark:text-white`}>{t.amount}</td>
                <td className={tableCellCls}>{t.cut}</td>
                <td className={tableCellCls}>{t.type}</td>
                <td className={tableCellCls}>
                  <StatusPill kind={t.status}>{t.statusLabel}</StatusPill>
                </td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}

function PayoutsPage() {
  const payouts = [
    { name: "Alexis Rivera", email: "alexis@email.com", amount: "$3,856", method: "CCBill", status: "held" as StatusKind, statusLabel: "Pending", paid: false },
    { name: "Jordan M.", email: "jordan@email.com", amount: "$1,712", method: "Paxum", status: "held" as StatusKind, statusLabel: "Pending", paid: false },
    { name: "Yuki Naka", email: "yuki@email.com", amount: "$432", method: "Paxum", status: "paid" as StatusKind, statusLabel: "Paid", paid: true },
  ];
  return (
    <div>
      <PageHeader title="Creator Payouts" subtitle="Approve, hold, or release creator earnings." />
      <TableCard
        title="Pending payouts"
        actions={
          <Button
            size="sm"
            className="rounded-full h-8 text-xs bg-green-600 hover:bg-green-700"
            onClick={() => toast.success("All pending payouts approved")}
          >
            Approve all
          </Button>
        }
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={tableHeadCls}>Creator</th>
              <th className={tableHeadCls}>Email</th>
              <th className={tableHeadCls}>Amount owed</th>
              <th className={tableHeadCls}>Payment method</th>
              <th className={tableHeadCls}>Status</th>
              <th className={tableHeadCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className={`${tableCellCls} font-bold text-gray-900 dark:text-white`}>{p.name}</td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{p.email}</td>
                <td className={`${tableCellCls} font-bold text-gray-900 dark:text-white`}>{p.amount}</td>
                <td className={tableCellCls}>{p.method}</td>
                <td className={tableCellCls}>
                  <StatusPill kind={p.status}>{p.statusLabel}</StatusPill>
                </td>
                <td className={tableCellCls}>
                  {p.paid ? (
                    <SmallBtn onClick={() => toast.success("Receipt downloaded")}>Receipt</SmallBtn>
                  ) : (
                    <div className="flex gap-1.5">
                      <SmallBtn variant="green" onClick={() => toast.success("Payout approved")}>Approve</SmallBtn>
                      <SmallBtn variant="red" onClick={() => toast.info("Payout held")}>Hold</SmallBtn>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}

function AnnouncementsPage() {
  const [target, setTarget] = useState("Everyone");
  const [text, setText] = useState("");
  const [recipient, setRecipient] = useState("");
  const targets = ["Everyone", "Creators only", "Fans only", "Suspended users", "Specific user"];
  const isDirect = target === "Specific user";
  const userSuggestions = [
    { name: "Alexis Rivera", email: "alexis@email.com" },
    { name: "Jordan M.", email: "jordan@email.com" },
    { name: "Yuki Naka", email: "yuki@email.com" },
    { name: "Sofia Torres", email: "sofia@email.com" },
    { name: "Mike (fan)", email: "mike@email.com" },
    { name: "Ryan (fan)", email: "ryan@email.com" },
  ];
  const matchingUsers = recipient
    ? userSuggestions.filter(
        (u) =>
          u.name.toLowerCase().includes(recipient.toLowerCase()) ||
          u.email.toLowerCase().includes(recipient.toLowerCase())
      )
    : [];
  const handleSend = () => {
    if (isDirect) {
      if (!recipient.trim()) {
        toast.error("Enter a user (name or email) to message.");
        return;
      }
      toast.success(`Message sent to ${recipient}`);
    } else {
      toast.success(`Announcement sent to ${target}`);
    }
  };
  const past = [
    { msg: "🎉 Welcome to Plezyy! Explore thousands of creators.", to: "Everyone", date: "Apr 1, 2025", opened: "82%" },
    { msg: "📢 New payout schedule effective May 1st.", to: "Creators", date: "Apr 15, 2025", opened: "94%" },
    { msg: "🔒 Updated Terms of Service — please review.", to: "Everyone", date: "Apr 18, 2025", opened: "71%" },
    { msg: "Hi Sofia — please verify your ID by Friday.", to: "sofia@email.com", date: "Apr 22, 2025", opened: "100%" },
  ];
  return (
    <div>
      <PageHeader title="Announcements" subtitle="Send messages to all users, segments, or message a specific user directly." />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-5">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          {isDirect ? "Direct message a user" : "Send an announcement"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2.5">Who should receive this?</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {targets.map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`text-xs px-3.5 py-1 rounded-full border transition-colors ${
                target === t
                  ? "bg-[#4180FB] text-white border-[#4180FB]"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {isDirect && (
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Search by name or email…"
              className="pl-9"
            />
            {recipient && matchingUsers.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-md max-h-48 overflow-y-auto">
                {matchingUsers.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => setRecipient(u.email)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                    <span className="text-gray-500">{u.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isDirect
              ? "Write a direct message to this user…"
              : "Write your announcement here… (e.g. New features, maintenance window, policy updates)"
          }
          className="min-h-[90px]"
        />
        <div className="flex gap-2.5 mt-3 items-center flex-wrap">
          <Button
            className="rounded-full bg-[#4180FB] hover:bg-[#3268D4]"
            onClick={handleSend}
          >
            <Send className="w-4 h-4 mr-1.5" />
            {isDirect ? "Send message" : "Send now"}
          </Button>
          {!isDirect && (
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => toast.success("Announcement scheduled")}
            >
              Schedule for later
            </Button>
          )}
          <span className="text-xs text-gray-400 ml-auto">
            {isDirect ? "Delivered as a direct message + email" : "Push notification + in-app banner"}
          </span>
        </div>
      </div>
      <TableCard title="Past announcements">
        <table className="w-full">
          <thead>
            <tr>
              <th className={tableHeadCls}>Message</th>
              <th className={tableHeadCls}>Sent to</th>
              <th className={tableHeadCls}>Date</th>
              <th className={tableHeadCls}>Opened by</th>
            </tr>
          </thead>
          <tbody>
            {past.map((p) => (
              <tr key={p.msg} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className={tableCellCls}>{p.msg}</td>
                <td className={tableCellCls}>{p.to}</td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{p.date}</td>
                <td className={tableCellCls}>{p.opened}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}

function ConfigPage() {
  const initialToggles = {
    maintenance: false,
    registration: true,
    creatorApps: true,
    ageGate: true,
    aiFlagging: true,
    referrals: true,
    comments: false,
    liveChat: true,
  };
  const [toggles, setToggles] = useState(initialToggles);
  const setToggle = (k: keyof typeof initialToggles) => (v: boolean) =>
    setToggles((t) => ({ ...t, [k]: v }));

  return (
    <div>
      <PageHeader title="Platform Configuration" subtitle="Control all platform-wide settings and rules." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Commission &amp; fees</h3>
          {[
            { label: "Platform fee (%)", value: "20" },
            { label: "Min payout threshold", value: "$50" },
            { label: "Payout frequency", value: "Weekly" },
            { label: "Refund window (days)", value: "3" },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between py-2 text-sm border-b border-gray-100 dark:border-gray-800/60 last:border-b-0"
            >
              <span className="text-gray-500 dark:text-gray-400">{r.label}</span>
              <Input defaultValue={r.value} className="w-24 h-7 text-right text-sm" />
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Account rules</h3>
          {[
            { label: "Min creator age", value: "18" },
            { label: "Max gigs per creator", value: "20" },
            { label: "Profile approval required", value: "Yes" },
            { label: "ID verification required", value: "Yes" },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between py-2 text-sm border-b border-gray-100 dark:border-gray-800/60 last:border-b-0"
            >
              <span className="text-gray-500 dark:text-gray-400">{r.label}</span>
              <Input defaultValue={r.value} className="w-24 h-7 text-right text-sm" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Platform feature toggles</h3>
        {[
          { k: "maintenance" as const, title: "Maintenance mode", body: "Take the site offline for updates. Shows a maintenance page to all visitors." },
          { k: "registration" as const, title: "New user registration", body: "Allow new fans and creators to sign up." },
          { k: "creatorApps" as const, title: "Creator applications open", body: "Allow new creators to apply for accounts." },
          { k: "ageGate" as const, title: "Age verification gate", body: "Require DOB verification before accessing the platform." },
          { k: "aiFlagging" as const, title: "AI content auto-flagging", body: "Automatically flag potentially violating content for review." },
          { k: "referrals" as const, title: "Creator referral program", body: "Allow creators to earn from referring other creators." },
          { k: "comments" as const, title: "Fan commenting on posts", body: "Let fans comment on creator posts (currently disabled)." },
          { k: "liveChat" as const, title: "Live chat feature", body: "Enable real-time live chat service bookings." },
        ].map((t) => (
          <div
            key={t.k}
            className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 dark:border-gray-800/60 last:border-b-0"
          >
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.body}</p>
            </div>
            <Switch checked={toggles[t.k]} onCheckedChange={setToggle(t.k)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PerformancePage() {
  const creators = [
    { rank: "🥇 1", color: "text-amber-500", initials: "AR", name: "Alexis Rivera", revenue: "$4,820", orders: 312, rating: "4.9", top: "Custom videos" },
    { rank: "🥈 2", color: "text-gray-400", initials: "JM", name: "Jordan M.", revenue: "$2,140", orders: 198, rating: "4.8", top: "Live chat" },
    { rank: "🥉 3", color: "text-orange-700", initials: "YN", name: "Yuki Naka", revenue: "$1,880", orders: 230, rating: "4.9", top: "ASMR / Voice" },
    { rank: "4", color: "", initials: "ST", name: "Sofia Torres", revenue: "$1,240", orders: 541, rating: "4.7", top: "Shoutouts" },
    { rank: "5", color: "", initials: "MK", name: "Mia K.", revenue: "$980", orders: 87, rating: "5.0", top: "Coaching" },
  ];
  const gigs = [
    { rank: "🥇 1", type: "Custom Videos", orders: "8,420", rev: "$371k", avg: "$44" },
    { rank: "🥈 2", type: "Live Chat", orders: "4,210", rev: "$84k", avg: "$20" },
    { rank: "🥉 3", type: "Photo Sets", orders: "2,840", rev: "$71k", avg: "$25" },
    { rank: "4", type: "Shoutouts", orders: "1,920", rev: "$19k", avg: "$10" },
    { rank: "5", type: "Voice Notes", orders: "1,440", rev: "$22k", avg: "$15" },
  ];
  const regions = [
    { rank: "🥇 1", country: "🇺🇸 United States", users: "12,410", rev: "$641k", top: "Alexis Rivera" },
    { rank: "🥈 2", country: "🇬🇧 United Kingdom", users: "4,200", rev: "$221k", top: "Jordan M." },
    { rank: "🥉 3", country: "🇨🇦 Canada", users: "2,840", rev: "$148k", top: "Mia K." },
    { rank: "4", country: "🇦🇺 Australia", users: "1,920", rev: "$110k", top: "Luna V." },
    { rank: "5", country: "🇧🇷 Brazil", users: "1,440", rev: "$74k", top: "Sofia Torres" },
  ];
  const spenders = [
    { rank: "🥇 1", color: "text-amber-500", initials: "MK", name: "Michael Kim", email: "mike@email.com", spent: "$3,420", orders: 64, fav: "Custom videos" },
    { rank: "🥈 2", color: "text-gray-400", initials: "RP", name: "Ryan P.", email: "ryan@email.com", spent: "$2,180", orders: 41, fav: "Live chat" },
    { rank: "🥉 3", color: "text-orange-700", initials: "DC", name: "Daniel C.", email: "fan204@email.com", spent: "$1,940", orders: 27, fav: "Premium video" },
    { rank: "4", color: "", initials: "JL", name: "Jenna L.", email: "fan512@email.com", spent: "$1,205", orders: 33, fav: "Photo set" },
    { rank: "5", color: "", initials: "TB", name: "Tom B.", email: "tom@email.com", spent: "$880", orders: 19, fav: "Shoutouts" },
  ];

  return (
    <div>
      <PageHeader title="Best Performers" subtitle="Top creators, gigs, regions, and spenders driving platform activity." />
      <Tabs defaultValue="creators">
        <TabsList className="mb-4">
          <TabsTrigger value="creators">Top creators</TabsTrigger>
          <TabsTrigger value="gigs">Top gigs</TabsTrigger>
          <TabsTrigger value="regions">Top regions</TabsTrigger>
          <TabsTrigger value="spenders">Top spenders</TabsTrigger>
        </TabsList>
        <TabsContent value="creators">
          <TableCard title="">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={tableHeadCls}>Rank</th>
                  <th className={tableHeadCls}>Creator</th>
                  <th className={tableHeadCls}>Revenue (MTD)</th>
                  <th className={tableHeadCls}>Orders</th>
                  <th className={tableHeadCls}>Rating</th>
                  <th className={tableHeadCls}>Top service</th>
                </tr>
              </thead>
              <tbody>
                {creators.map((c) => (
                  <tr key={c.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className={tableCellCls}>
                      <span className={`font-bold ${c.color}`}>{c.rank}</span>
                    </td>
                    <td className={tableCellCls}>
                      <div className="flex items-center gap-2">
                        <Avatar initials={c.initials} />
                        <span className="font-bold text-gray-900 dark:text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className={`${tableCellCls} font-bold text-green-600`}>{c.revenue}</td>
                    <td className={tableCellCls}>{c.orders}</td>
                    <td className={tableCellCls}>★ {c.rating}</td>
                    <td className={tableCellCls}>{c.top}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </TabsContent>
        <TabsContent value="gigs">
          <TableCard title="">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={tableHeadCls}>Rank</th>
                  <th className={tableHeadCls}>Gig type</th>
                  <th className={tableHeadCls}>Total orders</th>
                  <th className={tableHeadCls}>Revenue</th>
                  <th className={tableHeadCls}>Avg price</th>
                </tr>
              </thead>
              <tbody>
                {gigs.map((g) => (
                  <tr key={g.type} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className={tableCellCls}>{g.rank}</td>
                    <td className={`${tableCellCls} font-bold text-gray-900 dark:text-white`}>{g.type}</td>
                    <td className={tableCellCls}>{g.orders}</td>
                    <td className={`${tableCellCls} font-bold text-gray-900 dark:text-white`}>{g.rev}</td>
                    <td className={tableCellCls}>{g.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </TabsContent>
        <TabsContent value="regions">
          <TableCard title="">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={tableHeadCls}>Rank</th>
                  <th className={tableHeadCls}>Country</th>
                  <th className={tableHeadCls}>Users</th>
                  <th className={tableHeadCls}>Revenue</th>
                  <th className={tableHeadCls}>Top creator</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((r) => (
                  <tr key={r.country} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className={tableCellCls}>{r.rank}</td>
                    <td className={tableCellCls}>{r.country}</td>
                    <td className={tableCellCls}>{r.users}</td>
                    <td className={`${tableCellCls} font-bold text-gray-900 dark:text-white`}>{r.rev}</td>
                    <td className={tableCellCls}>{r.top}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </TabsContent>
        <TabsContent value="spenders">
          <TableCard title="">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={tableHeadCls}>Rank</th>
                  <th className={tableHeadCls}>Member</th>
                  <th className={tableHeadCls}>Email</th>
                  <th className={tableHeadCls}>Total spent (MTD)</th>
                  <th className={tableHeadCls}>Orders</th>
                  <th className={tableHeadCls}>Favorite category</th>
                </tr>
              </thead>
              <tbody>
                {spenders.map((s) => (
                  <tr key={s.email} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className={tableCellCls}>
                      <span className={`font-bold ${s.color}`}>{s.rank}</span>
                    </td>
                    <td className={tableCellCls}>
                      <div className="flex items-center gap-2">
                        <Avatar initials={s.initials} />
                        <span className="font-bold text-gray-900 dark:text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{s.email}</td>
                    <td className={`${tableCellCls} font-bold text-green-600`}>{s.spent}</td>
                    <td className={tableCellCls}>{s.orders}</td>
                    <td className={tableCellCls}>{s.fav}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AuditPage() {
  const rows = [
    { admin: "Joseph (Owner)", action: "User banned", kind: "banned" as StatusKind, target: "Sofia Torres", ip: "72.44.10.18", time: "Today 3:02pm" },
    { admin: "Joseph (Owner)", action: "Content approved", kind: "approved" as StatusKind, target: "Post #4821", ip: "72.44.10.18", time: "Today 1:44pm" },
    { admin: "Joseph (Owner)", action: "IP blocked", kind: "flagged" as StatusKind, target: "203.0.113.99", ip: "72.44.10.18", time: "Apr 20, 11:02am" },
    { admin: "Joseph (Owner)", action: "Password changed", kind: "pending" as StatusKind, target: "mike@email.com", ip: "72.44.10.18", time: "Apr 19, 4:30pm" },
    { admin: "Joseph (Owner)", action: "Payout approved", kind: "approved" as StatusKind, target: "Alexis Rivera", ip: "72.44.10.18", time: "Apr 18, 9:10am" },
  ];
  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Every admin action is recorded here for accountability and security." />
      <TableCard
        title="Admin action history"
        actions={
          <Button variant="outline" size="sm" className="rounded-full h-8 text-xs" onClick={() => toast.success("Audit log exported")}>
            Export
          </Button>
        }
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={tableHeadCls}>Admin</th>
              <th className={tableHeadCls}>Action</th>
              <th className={tableHeadCls}>Target</th>
              <th className={tableHeadCls}>IP</th>
              <th className={tableHeadCls}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className={`${tableCellCls} font-bold text-gray-900 dark:text-white`}>{r.admin}</td>
                <td className={tableCellCls}>
                  <StatusPill kind={r.kind}>{r.action}</StatusPill>
                </td>
                <td className={tableCellCls}>{r.target}</td>
                <td className={`${tableCellCls} font-mono text-xs`}>{r.ip}</td>
                <td className={`${tableCellCls} text-gray-500 dark:text-gray-400`}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}

// ──────────── SIDEBAR NAV ────────────

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "analytics", label: "Analytics", icon: LineChart },
    ],
  },
  {
    label: "People",
    items: [
      { id: "users", label: "All Users", icon: Users, badge: 3 },
      { id: "creators", label: "Creators", icon: Star },
      { id: "fans", label: "Fans", icon: Heart },
    ],
  },
  {
    label: "Content & Safety",
    items: [
      { id: "content", label: "Content Moderation", icon: Film, badge: 7 },
      { id: "messages", label: "Messages", icon: MessageSquare },
      { id: "reports", label: "Reports", icon: AlertTriangle, badge: 12 },
      { id: "ip", label: "IP Management", icon: Globe },
    ],
  },
  {
    label: "Money",
    items: [
      { id: "finance", label: "Financial Reports", icon: DollarSign },
      { id: "payouts", label: "Payouts", icon: Send },
    ],
  },
  {
    label: "Platform",
    items: [
      { id: "announcements", label: "Announcements", icon: Megaphone },
      { id: "config", label: "Platform Config", icon: Settings },
      { id: "performance", label: "Best Performers", icon: Trophy },
      { id: "audit", label: "Audit Log", icon: Search },
    ],
  },
];

// ──────────── MAIN PAGE ────────────

type ModalState =
  | { kind: "none" }
  | { kind: "password"; target: string }
  | { kind: "delete"; target: string };

export default function AdminPortal() {
  const [active, setActive] = useState<PageId>("dashboard");
  const [time, setTime] = useState("");
  const [modal, setModal] = useState<ModalState>({ kind: "none" });
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handlePasswordChange = (target: string) => setModal({ kind: "password", target });
  const handleDelete = (target: string) => {
    setDeleteConfirm("");
    setModal({ kind: "delete", target });
  };
  const closeModal = () => setModal({ kind: "none" });
  const confirmModal = () => {
    if (modal.kind === "password") toast.success(`Password updated for ${modal.target}`);
    if (modal.kind === "delete") toast.success(`${modal.target} permanently deleted`);
    closeModal();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 h-14 bg-gray-950 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img alt="Plezyy" className="h-8 w-auto invert" src={plezyyLogo} />
          <span className="text-[10px] font-bold bg-[#4180FB] text-white px-2.5 py-0.5 rounded-full tracking-wider">
            ADMIN PORTAL
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 tabular-nums">{time}</span>
          <button
            onClick={() => toast.info("No new critical alerts")}
            className="relative text-gray-400 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-gray-950" />
          </button>
          <button
            onClick={() => toast.info("Logged in as Joseph (Owner)")}
            className="w-8 h-8 rounded-full bg-[#4180FB] text-white text-sm font-bold flex items-center justify-center"
          >
            J
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-56 bg-gray-950 flex flex-col flex-shrink-0 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 pt-4 pb-1.5">
                {section.label}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`w-full text-left flex items-center gap-2.5 px-4 py-2 mx-2 my-0.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-[#4180FB]/20 text-white font-semibold"
                        : "text-gray-400 hover:bg-[#4180FB]/10 hover:text-white"
                    }`}
                    style={{ width: "calc(100% - 1rem)" }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          <div className="mt-auto p-4 border-t border-gray-800">
            <button
              onClick={() => toast.info("Logging out…")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {active === "dashboard" && <DashboardPage />}
          {active === "analytics" && <AnalyticsPage />}
          {active === "users" && <UsersPage onPasswordChange={handlePasswordChange} onDelete={handleDelete} />}
          {active === "creators" && <CreatorsPage />}
          {active === "fans" && <FansPage />}
          {active === "content" && <ContentPage />}
          {active === "messages" && <MessagesPage />}
          {active === "reports" && <ReportsPage />}
          {active === "ip" && <IpPage />}
          {active === "finance" && <FinancePage />}
          {active === "payouts" && <PayoutsPage />}
          {active === "announcements" && <AnnouncementsPage />}
          {active === "config" && <ConfigPage />}
          {active === "performance" && <PerformancePage />}
          {active === "audit" && <AuditPage />}
        </main>
      </div>

      {/* MODALS */}
      <Dialog open={modal.kind === "password"} onOpenChange={(o) => !o && closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Change password — {modal.kind === "password" ? modal.target : ""}
            </DialogTitle>
            <DialogDescription>This will immediately update their login password.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">New password</label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Confirm password</label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={closeModal}>
              Cancel
            </Button>
            <Button className="rounded-full bg-[#4180FB] hover:bg-[#3268D4]" onClick={confirmModal}>
              Save password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal.kind === "delete"} onOpenChange={(o) => !o && closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Permanently delete {modal.kind === "delete" ? modal.target : ""}?
            </DialogTitle>
            <DialogDescription>
              This action CANNOT be undone. The profile, all content, messages, and earnings history will be erased forever.
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Type DELETE to confirm</label>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              className="rounded-full bg-red-600 hover:bg-red-700"
              disabled={deleteConfirm !== "DELETE"}
              onClick={confirmModal}
            >
              Permanently delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
