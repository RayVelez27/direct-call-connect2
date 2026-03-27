import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useConversations } from "@/contexts/ConversationsContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  MessageSquare,
  Receipt,
  UserCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Search,
  Clock,
  Star,
  Eye,
  Compass,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Send,
  Paperclip,
  MoreHorizontal,
  ExternalLink,
  MapPin,
  Video,
  Calendar,
} from "lucide-react";
import plezyyLogo from "@/assets/Untitled design - 2026-03-27T091410.050.png";

const navItemsDef = [
  { label: "Overview", icon: LayoutDashboard, id: "overview" },
  { label: "Bookings", icon: CalendarDays, id: "bookings" },
  { label: "Favorites", icon: Heart, id: "favorites" },
  { label: "Messages", icon: MessageSquare, id: "messages" },
  { label: "Transactions", icon: Receipt, id: "transactions" },
  { label: "Account", icon: UserCircle, id: "account" },
  { label: "Settings", icon: Settings, id: "settings" },
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favorites } = useFavorites();
  const { conversations, unreadCount } = useConversations();

  const navItems = navItemsDef.map((item) => ({
    ...item,
    badge: item.id === "messages" ? unreadCount : item.id === "favorites" ? favorites.length : undefined,
  }));

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

  const initials = user.email?.slice(0, 2).toUpperCase() ?? "US";

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
                  {item.badge ? (
                    <Badge variant="secondary" className="h-5 min-w-5 flex items-center justify-center text-xs px-1.5">
                      {item.badge}
                    </Badge>
                  ) : null}
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
                <p className="text-xs text-muted-foreground">Viewer</p>
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
            <Link to="/discovery">
              <Button size="sm" variant="outline" className="gap-2">
                <Compass className="h-4 w-4" />
                <span className="hidden sm:inline">Discover</span>
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 capitalize">
                  Viewer
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-semibold">Viewer</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/creator")}>Creator</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeTab === "overview" && <OverviewTab user={user} />}
          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "favorites" && <FavoritesTab />}
          {activeTab === "messages" && <MessagesTab user={user} />}
          {activeTab === "transactions" && <TransactionsTab />}
          {activeTab === "account" && <AccountTab user={user} />}
          {activeTab === "settings" && <SettingsTab user={user} />}
        </main>
      </div>
    </div>
  );
}

/* ─── OVERVIEW TAB ─── */
function OverviewTab({ user }: { user: User }) {
  const { favorites } = useFavorites();
  const { conversations, unreadCount } = useConversations();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="text-muted-foreground mt-1">Here's a summary of your activity.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Bookings" value="0" sub="Upcoming" />
        <StatCard icon={Heart} label="Favorites" value={String(favorites.length)} sub="Saved creators" />
        <StatCard icon={MessageSquare} label="Messages" value={String(unreadCount)} sub={`${conversations.length} conversation${conversations.length !== 1 ? "s" : ""}`} />
        <StatCard icon={Receipt} label="Spent" value="$0.00" sub="This month" />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            icon={Compass}
            title="Discover Creators"
            description="Browse verified creators and find someone you'd like to connect with."
            linkTo="/discovery"
            buttonLabel="Explore"
          />
          <ActionCard
            icon={CalendarDays}
            title="My Bookings"
            description="View your upcoming sessions and past booking history."
            linkTo="#bookings"
            buttonLabel="View Bookings"
          />
          <ActionCard
            icon={CreditCard}
            title="Payment Methods"
            description="Add or manage your payment methods for seamless bookings."
            linkTo="#settings"
            buttonLabel="Manage"
          />
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Recent Activity</h3>
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Clock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No recent activity yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Your bookings, messages, and transactions will show up here.</p>
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
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1 flex-1">{description}</p>
      <Link to={linkTo}>
        <Button variant="outline" size="sm" className="mt-4 w-full">
          {buttonLabel}
        </Button>
      </Link>
    </div>
  );
}

/* ─── BOOKINGS TAB ─── */
function BookingsTab() {
  const [filter, setFilter] = useState<"upcoming" | "past" | "cancelled">("upcoming");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Bookings</h2>
        <p className="text-muted-foreground mt-1">Manage your sessions with creators.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["upcoming", "past", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <CalendarDays className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-base font-semibold text-foreground">No {filter} bookings</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {filter === "upcoming"
            ? "When you book a session with a creator, it will appear here."
            : filter === "past"
            ? "Your completed sessions will be listed here."
            : "Cancelled bookings will show up here."}
        </p>
        {filter === "upcoming" && (
          <Link to="/discovery">
            <Button className="mt-4" size="sm">Browse Creators</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

/* ─── FAVORITES TAB ─── */
function FavoritesTab() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Favorites</h2>
        <p className="text-muted-foreground mt-1">Creators you've saved for later.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-foreground">No favorites yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Browse creators and tap the heart icon to save them here.
          </p>
          <Link to="/discovery">
            <Button className="mt-4" size="sm">Discover Creators</Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((creator) => (
            <div key={creator.id} className="rounded-xl border border-border bg-card overflow-hidden group">
              {creator.images?.[0] ? (
                <div className="relative h-40 overflow-hidden">
                  <img src={creator.images[0]} alt={creator.name} className="w-full h-full object-cover" />
                  {creator.online && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold">Online</span>
                  )}
                </div>
              ) : (
                <div className="h-40 bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{creator.initials}</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{creator.name}</h3>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{creator.tagline}</p>
                  </div>
                  <button
                    onClick={() => removeFavorite(creator.id)}
                    className="shrink-0 p-1.5 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">{creator.location}</span>
                  <span className="text-sm font-bold text-foreground">{creator.price}<span className="text-xs text-muted-foreground font-normal">/{creator.per}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MESSAGES TAB ─── */
function MessagesTab({ user }: { user: User }) {
  const { conversations, addMessage } = useConversations();
  const [selectedConvoId, setSelectedConvoId] = useState<number | null>(null);
  const [msgInput, setMsgInput] = useState("");

  const selectedConvo = conversations.find((c) => c.creatorId === selectedConvoId);

  const handleSend = () => {
    if (!msgInput.trim() || !selectedConvoId) return;
    addMessage(selectedConvoId, msgInput.trim(), true);
    setMsgInput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Messages</h2>
        <p className="text-muted-foreground mt-1">Conversations with creators.</p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ height: "calc(100vh - 260px)", minHeight: 400 }}>
        <div className="flex h-full">
          {/* Conversation list */}
          <div className="w-80 border-r border-border flex flex-col shrink-0">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-9 h-9 rounded-lg" />
              </div>
            </div>
            {conversations.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No conversations yet</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {conversations.map((convo) => (
                  <button
                    key={convo.creatorId}
                    onClick={() => setSelectedConvoId(convo.creatorId)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors text-left ${
                      selectedConvoId === convo.creatorId ? "bg-accent" : ""
                    }`}
                  >
                    <div className="relative shrink-0">
                      {convo.creatorImage ? (
                        <img src={convo.creatorImage} alt={convo.creatorName} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{convo.creatorInitials}</span>
                        </div>
                      )}
                      {convo.creatorOnline && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{convo.creatorName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {convo.messages.length > 0 ? convo.messages[convo.messages.length - 1].content : "No messages yet"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat area */}
          {selectedConvo ? (
            <div className="flex-1 flex flex-col">
              {/* Chat header */}
              <div className="flex items-center gap-3 p-4 border-b border-border shrink-0">
                {selectedConvo.creatorImage ? (
                  <img src={selectedConvo.creatorImage} alt={selectedConvo.creatorName} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{selectedConvo.creatorInitials}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">{selectedConvo.creatorName}</p>
                  <p className="text-xs text-muted-foreground">{selectedConvo.creatorOnline ? "Online" : "Offline"}</p>
                </div>
              </div>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedConvo.messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <p className="text-sm text-muted-foreground">Send a message to start the conversation.</p>
                  </div>
                ) : (
                  selectedConvo.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.fromUser ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-3.5 py-2 rounded-2xl text-sm ${
                        msg.fromUser
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Input */}
              <div className="p-3 border-t border-border shrink-0">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    className="h-10 rounded-lg flex-1"
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                  />
                  <Button size="sm" onClick={handleSend} disabled={!msgInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <Send className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-foreground">No conversation selected</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a conversation or start chatting with a creator.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── TRANSACTIONS TAB ─── */
function TransactionsTab() {
  const [filter, setFilter] = useState<"all" | "completed" | "pending" | "refunded">("all");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
        <p className="text-muted-foreground mt-1">Your payment history and receipts.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Total Spent</span>
          <p className="text-2xl font-bold text-foreground mt-1">$0.00</p>
          <p className="text-xs text-muted-foreground">All time</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">This Month</span>
          <p className="text-2xl font-bold text-foreground mt-1">$0.00</p>
          <p className="text-xs text-muted-foreground">Current period</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Pending</span>
          <p className="text-2xl font-bold text-foreground mt-1">$0.00</p>
          <p className="text-xs text-muted-foreground">In progress</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "completed", "pending", "refunded"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <Receipt className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-base font-semibold text-foreground">No transactions yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          When you make a booking or purchase, your transaction history will appear here.
        </p>
      </div>
    </div>
  );
}

/* ─── ACCOUNT TAB ─── */
function AccountTab({ user }: { user: User }) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Account</h2>
        <p className="text-muted-foreground mt-1">Manage your personal information.</p>
      </div>

      {/* Profile info */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
              {user.email?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Member since {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
          </div>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accName">Display Name</Label>
            <Input id="accName" placeholder="Your name" className="h-10 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accEmail">Email</Label>
            <Input id="accEmail" value={user.email ?? ""} disabled className="h-10 rounded-lg" />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button size="sm">Save Changes</Button>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Security</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Password</p>
            <p className="text-xs text-muted-foreground">Last changed: Never</p>
          </div>
          <Button variant="outline" size="sm">Change Password</Button>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
          </div>
          <Button variant="outline" size="sm">Enable</Button>
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
        <p className="text-muted-foreground mt-1">Manage your preferences.</p>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </h3>
        {[
          { label: "Booking confirmations", desc: "Get notified when a booking is confirmed" },
          { label: "Messages", desc: "Notifications for new messages from creators" },
          { label: "Promotions", desc: "Special offers and new creator announcements" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>
        ))}
      </div>

      {/* Payment methods */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Methods
        </h3>
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <CreditCard className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No payment methods added yet.</p>
          <Button variant="outline" size="sm" className="mt-3">Add Payment Method</Button>
        </div>
      </div>

      {/* Privacy */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Privacy
        </h3>
        {[
          { label: "Profile visibility", desc: "Allow creators to see your profile information" },
          { label: "Online status", desc: "Show when you're active on the platform" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-destructive/30 bg-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Delete Account</p>
            <p className="text-xs text-muted-foreground">Permanently delete your account and all data.</p>
          </div>
          <Button variant="destructive" size="sm">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
