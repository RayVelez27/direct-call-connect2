import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  Copy,
  X,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    TIME_OPTIONS.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  }
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export default function CreatorScheduleTab({ user }: { user: User }) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    async function load() {
      // Get creator profile ID
      const { data: profile } = await supabase
        .from("creator_profiles")
        .select("id, slug")
        .eq("user_id", user.id)
        .single();

      if (!profile) {
        setLoading(false);
        return;
      }

      setCreatorId(profile.id);
      setShareLink(`${window.location.origin}/schedule?creator=${profile.id}`);

      // Load availability
      const { data: avail } = await supabase
        .from("creator_availability")
        .select("*")
        .eq("creator_id", profile.id)
        .order("day_of_week")
        .order("start_time");

      if (avail) setSlots(avail);

      // Load blocked dates
      const { data: blocked } = await supabase
        .from("creator_blocked_dates")
        .select("*")
        .eq("creator_id", profile.id)
        .order("blocked_date");

      if (blocked) setBlockedDates(blocked);

      setLoading(false);
    }
    load();
  }, [user.id]);

  const addSlot = (dayOfWeek: number) => {
    setSlots([
      ...slots,
      {
        day_of_week: dayOfWeek,
        start_time: "09:00",
        end_time: "17:00",
        is_active: true,
      },
    ]);
  };

  const updateSlot = (index: number, field: keyof AvailabilitySlot, value: any) => {
    const updated = [...slots];
    (updated[index] as any)[field] = value;
    setSlots(updated);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const copyToAllDays = (sourceDay: number) => {
    const sourceDaySlots = slots.filter((s) => s.day_of_week === sourceDay);
    if (sourceDaySlots.length === 0) return;

    const otherDaySlots = slots.filter((s) => s.day_of_week === sourceDay);
    const newSlots: AvailabilitySlot[] = [...otherDaySlots];

    for (let day = 0; day < 7; day++) {
      if (day === sourceDay) continue;
      for (const sourceSlot of sourceDaySlots) {
        newSlots.push({
          day_of_week: day,
          start_time: sourceSlot.start_time,
          end_time: sourceSlot.end_time,
          is_active: true,
        });
      }
    }

    setSlots(newSlots);
    toast.success("Copied availability to all days");
  };

  const saveAvailability = async () => {
    if (!creatorId) return;
    setSaving(true);

    // Delete existing and re-insert
    await supabase.from("creator_availability").delete().eq("creator_id", creatorId);

    if (slots.length > 0) {
      const { error } = await supabase.from("creator_availability").insert(
        slots.map((s) => ({
          creator_id: creatorId,
          day_of_week: s.day_of_week,
          start_time: s.start_time,
          end_time: s.end_time,
          is_active: s.is_active,
        }))
      );

      if (error) {
        toast.error("Failed to save availability");
        console.error(error);
        setSaving(false);
        return;
      }
    }

    toast.success("Availability saved!");
    setSaving(false);
  };

  const addBlockedDate = async () => {
    if (!creatorId || !newBlockedDate) return;

    const { data, error } = await supabase
      .from("creator_blocked_dates")
      .insert({ creator_id: creatorId, blocked_date: newBlockedDate })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add blocked date");
    } else if (data) {
      setBlockedDates([...blockedDates, data]);
      setNewBlockedDate("");
      toast.success("Date blocked");
    }
  };

  const removeBlockedDate = async (id: string) => {
    await supabase.from("creator_blocked_dates").delete().eq("id", id);
    setBlockedDates(blockedDates.filter((d) => d.id !== id));
    toast.success("Date unblocked");
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Scheduling link copied!");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Schedule & Availability</h2>
          <p className="text-muted-foreground mt-1">Set your available hours so members can book sessions with you.</p>
        </div>
        <Button onClick={saveAvailability} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Share Link */}
      {shareLink && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-medium mb-2">Your scheduling link</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={shareLink}
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted text-sm text-muted-foreground"
            />
            <Button variant="outline" size="sm" onClick={copyShareLink}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
        </div>
      )}

      {/* Weekly Availability */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Weekly Hours
        </h3>

        <div className="space-y-3">
          {DAYS.map((day, dayIndex) => {
            const daySlots = slots.filter((s) => s.day_of_week === dayIndex);
            const hasSlots = daySlots.length > 0;

            return (
              <div
                key={day}
                className={`rounded-xl border p-4 transition-colors ${
                  hasSlots ? "border-border bg-card" : "border-border/50 bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold w-24 ${hasSlots ? "text-foreground" : "text-muted-foreground"}`}>
                      {day}
                    </span>
                    {!hasSlots && (
                      <span className="text-xs text-muted-foreground">Unavailable</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {hasSlots && dayIndex === slots.find(s => s.day_of_week === dayIndex)?.day_of_week && (
                      <button
                        onClick={() => copyToAllDays(dayIndex)}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                        title="Copy to all days"
                      >
                        <Copy className="h-3 w-3" />
                        Copy to all
                      </button>
                    )}
                    <button
                      onClick={() => addSlot(dayIndex)}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {daySlots.length > 0 && (
                  <div className="space-y-2">
                    {daySlots.map((slot) => {
                      const globalIndex = slots.indexOf(slot);
                      return (
                        <div key={globalIndex} className="flex items-center gap-2 flex-wrap">
                          <select
                            value={slot.start_time}
                            onChange={(e) => updateSlot(globalIndex, "start_time", e.target.value)}
                            className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
                          >
                            {TIME_OPTIONS.map((t) => (
                              <option key={t} value={t}>{formatTime(t)}</option>
                            ))}
                          </select>
                          <span className="text-muted-foreground text-sm">to</span>
                          <select
                            value={slot.end_time}
                            onChange={(e) => updateSlot(globalIndex, "end_time", e.target.value)}
                            className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
                          >
                            {TIME_OPTIONS.map((t) => (
                              <option key={t} value={t}>{formatTime(t)}</option>
                            ))}
                          </select>
                          <Switch
                            checked={slot.is_active}
                            onCheckedChange={(v) => updateSlot(globalIndex, "is_active", v)}
                          />
                          <button
                            onClick={() => removeSlot(globalIndex)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Blocked Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Blocked Dates
        </h3>
        <p className="text-sm text-muted-foreground">
          Mark specific dates when you're unavailable (vacations, days off, etc.)
        </p>

        <div className="flex gap-2">
          <input
            type="date"
            value={newBlockedDate}
            onChange={(e) => setNewBlockedDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
            min={new Date().toISOString().split("T")[0]}
          />
          <Button variant="outline" size="sm" onClick={addBlockedDate} disabled={!newBlockedDate}>
            <Plus className="h-4 w-4 mr-1" />
            Block Date
          </Button>
        </div>

        {blockedDates.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blockedDates.map((bd) => (
              <Badge key={bd.id} variant="secondary" className="gap-1 pr-1">
                {new Date(bd.blocked_date + "T00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                <button
                  onClick={() => removeBlockedDate(bd.id)}
                  className="ml-1 p-0.5 rounded hover:bg-destructive/20 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
