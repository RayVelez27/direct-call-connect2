import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  Video,
  CheckCircle,
  ArrowLeft,
  BadgeCheck,
  Star,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface TimeSlot {
  time: string;
  display: string;
  available: boolean;
}

interface CreatorInfo {
  id: string;
  display_name: string;
  slug: string;
  avatar_url: string | null;
  tagline: string | null;
}

interface ServiceInfo {
  id: string;
  name: string;
  duration_minutes: number;
  base_price: number;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function generateTimeSlots(startHour: number, endHour: number, durationMinutes: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += durationMinutes) {
      if (hour + min / 60 >= endHour) break;
      const h = hour % 24;
      const ampm = h >= 12 ? "PM" : "AM";
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const displayMin = min.toString().padStart(2, "0");
      slots.push({
        time: `${h.toString().padStart(2, "0")}:${displayMin}`,
        display: `${displayHour}:${displayMin} ${ampm}`,
        available: true,
      });
    }
  }
  return slots;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function Schedule() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const creatorId = searchParams.get("creator");
  const serviceId = searchParams.get("service");

  const [user, setUser] = useState<User | null>(null);
  const [creator, setCreator] = useState<CreatorInfo | null>(null);
  const [service, setService] = useState<ServiceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Calendar state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Availability data
  const [availability, setAvailability] = useState<Record<number, { start: string; end: string }[]>>({});
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Confirmation step
  const [step, setStep] = useState<"select" | "confirm">("select");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!creatorId) return;
      setLoading(true);

      const [creatorRes, serviceRes, availRes, blockedRes] = await Promise.all([
        supabase.from("creator_profiles").select("id, display_name, slug, cover_photo, tagline").eq("id", creatorId).single(),
        serviceId
          ? supabase.from("services").select("id, name, duration_minutes, base_price").eq("id", serviceId).single()
          : Promise.resolve({ data: null }),
        supabase.from("creator_availability").select("*").eq("creator_id", creatorId).eq("is_active", true),
        supabase.from("creator_blocked_dates").select("blocked_date").eq("creator_id", creatorId),
      ]);

      if (creatorRes.data) {
        setCreator({
          ...creatorRes.data,
          avatar_url: creatorRes.data.cover_photo,
        });
      }
      if (serviceRes.data) setService(serviceRes.data);

      // Build availability map (day_of_week -> time ranges)
      if (availRes.data) {
        const map: Record<number, { start: string; end: string }[]> = {};
        for (const row of availRes.data) {
          if (!map[row.day_of_week]) map[row.day_of_week] = [];
          map[row.day_of_week].push({ start: row.start_time, end: row.end_time });
        }
        setAvailability(map);
      }

      if (blockedRes.data) {
        setBlockedDates(blockedRes.data.map((d: any) => d.blocked_date));
      }

      setLoading(false);
    }

    fetchData();
  }, [creatorId, serviceId]);

  // Fetch booked slots when date changes
  useEffect(() => {
    async function fetchBookedSlots() {
      if (!selectedDate || !creatorId) return;

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data } = await supabase
        .from("bookings")
        .select("scheduled_at, duration_minutes")
        .eq("creator_id", creatorId)
        .in("status", ["pending", "confirmed"])
        .gte("scheduled_at", startOfDay.toISOString())
        .lte("scheduled_at", endOfDay.toISOString());

      if (data) {
        setBookedSlots(data.map((b: any) => {
          const d = new Date(b.scheduled_at);
          return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
        }));
      }
    }
    fetchBookedSlots();
  }, [selectedDate, creatorId]);

  // Get available time slots for selected date
  const getTimeSlotsForDate = (): TimeSlot[] => {
    if (!selectedDate) return [];
    const dayOfWeek = selectedDate.getDay();
    const daySlots = availability[dayOfWeek];
    if (!daySlots || daySlots.length === 0) return [];

    const duration = service?.duration_minutes || 30;
    const allSlots: TimeSlot[] = [];

    for (const slot of daySlots) {
      const startHour = parseInt(slot.start.split(":")[0]);
      const endHour = parseInt(slot.end.split(":")[0]);
      const generated = generateTimeSlots(startHour, endHour, duration);
      allSlots.push(...generated);
    }

    // Mark booked slots as unavailable
    return allSlots.map((s) => ({
      ...s,
      available: !bookedSlots.includes(s.time),
    }));
  };

  const isDateAvailable = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split("T")[0];

    // Past dates
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return false;
    // Blocked dates
    if (blockedDates.includes(dateStr)) return false;
    // No availability for this day
    if (!availability[dayOfWeek] || availability[dayOfWeek].length === 0) return false;

    return true;
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please sign in to book a session");
      navigate("/sign-in");
      return;
    }
    if (!selectedDate || !selectedTime || !creatorId) return;

    setSubmitting(true);

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const scheduledAt = new Date(selectedDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    const { error } = await supabase.from("bookings").insert({
      consumer_id: user.id,
      creator_id: creatorId,
      service_id: serviceId || null,
      scheduled_at: scheduledAt.toISOString(),
      duration_minutes: service?.duration_minutes || 30,
      session_type: "video_call",
      total_amount: service?.base_price || 0,
      platform_fee: (service?.base_price || 0) * 0.2,
      creator_payout: (service?.base_price || 0) * 0.8,
      status: "pending",
    });

    setSubmitting(false);

    if (error) {
      toast.error("Failed to book session. Please try again.");
      console.error(error);
    } else {
      toast.success("Session booked! The creator will confirm shortly.");
      setStep("confirm");
    }
  };

  // Calendar rendering
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const timeSlots = getTimeSlotsForDate();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded mx-auto" />
            <div className="h-4 w-64 bg-muted rounded mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold">Creator not found</h2>
          <p className="text-muted-foreground mt-2">This creator doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/discovery")} className="mt-4">Browse Creators</Button>
        </div>
      </div>
    );
  }

  // Confirmation view
  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold">Session Requested!</h1>
          <p className="text-muted-foreground">
            Your session with <span className="font-semibold text-foreground">{creator.display_name}</span> has been submitted.
            They'll confirm your booking shortly.
          </p>
          <div className="rounded-xl border border-border bg-card p-6 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{timeSlots.find(s => s.time === selectedTime)?.display || selectedTime}</span>
            </div>
            {service && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{service.duration_minutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold text-primary">${service.base_price}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/dashboard/user")}>
              View My Bookings
            </Button>
            <Button onClick={() => navigate("/discovery")}>
              Browse More Creators
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
            {creator.avatar_url ? (
              <img src={creator.avatar_url} alt={creator.display_name} className="h-full w-full object-cover" />
            ) : (
              creator.display_name?.charAt(0)?.toUpperCase() || "?"
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{creator.display_name}</h1>
              <BadgeCheck className="h-5 w-5 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">{creator.tagline || "Book a session"}</p>
          </div>
        </div>

        {service && (
          <div className="rounded-xl border border-border bg-card p-4 mb-8 flex flex-wrap items-center gap-4">
            <Badge variant="secondary" className="gap-1">
              <Video className="h-3 w-3" />
              {service.name}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {service.duration_minutes} min
            </span>
            <span className="text-sm font-bold text-primary ml-auto">${service.base_price}</span>
          </div>
        )}

        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Select a Date & Time
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="rounded-xl border border-border bg-card p-6">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-semibold">
                {MONTHS[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for offset */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(currentYear, currentMonth, day);
                const available = isDateAvailable(date);
                const isSelected =
                  selectedDate?.getDate() === day &&
                  selectedDate?.getMonth() === currentMonth &&
                  selectedDate?.getFullYear() === currentYear;
                const isToday =
                  today.getDate() === day &&
                  today.getMonth() === currentMonth &&
                  today.getFullYear() === currentYear;

                return (
                  <button
                    key={day}
                    disabled={!available}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : available
                        ? "hover:bg-primary/10 hover:text-primary text-foreground"
                        : "text-muted-foreground/30 cursor-not-allowed"
                    } ${isToday && !isSelected ? "ring-1 ring-primary/50" : ""}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {Object.keys(availability).length === 0 && (
              <p className="text-sm text-muted-foreground text-center mt-4">
                This creator hasn't set their availability yet.
              </p>
            )}
          </div>

          {/* Time Slots */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">
              {selectedDate
                ? selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                : "Select a date"}
            </h3>

            {!selectedDate ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarDays className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">
                  Pick a date from the calendar to see available times.
                </p>
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">
                  No available times on this date.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[320px] overflow-y-auto pr-1">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        selectedTime === slot.time
                          ? "border-primary bg-primary text-primary-foreground"
                          : slot.available
                          ? "border-border hover:border-primary/50 hover:bg-primary/5 text-foreground"
                          : "border-border/50 text-muted-foreground/40 cursor-not-allowed bg-muted/30"
                      }`}
                    >
                      {slot.display}
                    </button>
                  ))}
                </div>

                {selectedTime && (
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Selected time</p>
                        <p className="font-semibold">
                          {timeSlots.find((s) => s.time === selectedTime)?.display}
                        </p>
                      </div>
                      {service && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-xl font-bold text-primary">${service.base_price}</p>
                        </div>
                      )}
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleBooking}
                      disabled={submitting}
                    >
                      {submitting ? "Booking..." : "Confirm Booking"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      The creator will review and confirm your request.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
