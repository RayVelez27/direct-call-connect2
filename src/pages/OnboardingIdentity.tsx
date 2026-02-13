import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Shield, ChevronLeft, ChevronRight, Upload, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import plezyyLogo from "@/assets/plezyy-logo.jpeg";

const steps = [
  { icon: "person", label: "Identity" },
  { icon: "location", label: "Address" },
  { icon: "bank", label: "Bank Details" },
  { icon: "verified", label: "Review" },
];

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: { day: number; currentMonth: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, currentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, currentMonth: true });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, currentMonth: false });
  }

  return days;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function OnboardingIdentity() {
  const [calendarMonth, setCalendarMonth] = useState(0); // January
  const [calendarYear, setCalendarYear] = useState(1990);
  const [selectedDate, setSelectedDate] = useState<{ day: number; month: number; year: number } | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calendarDays = getCalendarDays(calendarYear, calendarMonth);

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img alt="Plezyy Logo" className="h-8 w-auto dark:invert" src={plezyyLogo} />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Need help?
            </a>
            <Button variant="outline" size="sm" className="rounded-lg font-semibold">
              Save & Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Title & Progress */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Creator Onboarding</h1>
          <p className="text-sm text-muted-foreground mt-1">Step 1 of 4</p>
          <Progress value={25} className="mt-4 h-2 max-w-md mx-auto" />
        </div>

        {/* Steps */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-8 flex-wrap">
          {steps.map((step, i) => (
            <div
              key={step.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.label.slice(0, 3)}</span>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
          <Shield className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            Your data is encrypted and used only for identity verification in compliance with global financial standards.
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">Identity & Verification</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Please provide your legal information as it appears on official government-issued documents. This helps us verify your identity and ensure secure payments.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Full Legal Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Legal Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder=""
                className="h-12 rounded-xl"
              />
              <p className="text-xs text-muted-foreground">Include middle names if applicable.</p>
            </div>

            {/* Date of Birth - Custom Calendar */}
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <div className="border border-border rounded-xl p-4">
                {/* Month/Year Nav */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1 rounded-lg hover:bg-accent transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                  </button>
                  <span className="text-sm font-semibold text-foreground">
                    {monthNames[calendarMonth]} {calendarYear}
                  </span>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1 rounded-lg hover:bg-accent transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {daysOfWeek.map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((d, i) => {
                    const isSelected =
                      selectedDate?.day === d.day &&
                      selectedDate?.month === calendarMonth &&
                      selectedDate?.year === calendarYear &&
                      d.currentMonth;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          d.currentMonth &&
                          setSelectedDate({ day: d.day, month: calendarMonth, year: calendarYear })
                        }
                        className={`h-9 w-full rounded-lg text-sm transition-colors ${
                          !d.currentMonth
                            ? "text-muted-foreground/40"
                            : isSelected
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-foreground hover:bg-accent"
                        }`}
                      >
                        {d.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Government ID Upload */}
            <div className="space-y-2">
              <Label>Government ID</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                {uploadedFile ? (
                  <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground">Upload your ID document</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Drag & drop or click to upload. We accept Passport, Driver's License or National ID.
                    </p>
                  </>
                )}
                <div className="flex justify-center gap-2 mt-3">
                  {["JPG", "PNG", "PDF"].map((fmt) => (
                    <span
                      key={fmt}
                      className="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4">
              <Button variant="ghost" className="gap-2 text-muted-foreground" asChild>
                <Link to="/sign-up">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
              <Button className="rounded-xl font-semibold px-6">
                Continue to Address
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <p className="text-center text-xs text-muted-foreground">
          © 2024 Plezyy Inc. All rights reserved. Identity verification powered by secure encryption.
        </p>
      </footer>
    </div>
  );
}
