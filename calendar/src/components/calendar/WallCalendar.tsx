import { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  addMonths,
  subMonths,
  isSameDay,
  isBefore,
  isAfter,
  format,
  startOfMonth,
} from "date-fns";
import SpiralBinding from "./SpiralBinding";
import HeroPanel from "./HeroPanel";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell, Timer } from "lucide-react";

const NOTES_STORAGE_KEY = "wall-calendar-notes";

const loadNotes = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveNotes = (notes: Record<string, string>) => {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
};

const WallCalendar = () => {
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>(loadNotes);
  const [alarms, setAlarms] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem("wall-calendar-alarms") || "{}");
    } catch {
      return {};
    }
  });
  const [timers, setTimers] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem("wall-calendar-timers") || "{}");
    } catch {
      return {};
    }
  });
  const noteKey = useMemo(() => {
    if (startDate && endDate) {
      const s = isBefore(endDate, startDate) ? endDate : startDate;
      const e = isAfter(endDate, startDate) ? endDate : startDate;
      return `${format(s, "yyyy-MM-dd")}_${format(e, "yyyy-MM-dd")}`;
    }
    if (startDate) {
      return format(startDate, "yyyy-MM-dd");
    }
    return format(currentDate, "yyyy-MM");
  }, [startDate, endDate, currentDate]);

  const noteValue = notes[noteKey] || "";

  const handleNoteChange = useCallback(
    (value: string) => {
      setNotes((prev) => {
        const next = { ...prev };
        if (value) {
          next[noteKey] = value;
        } else {
          delete next[noteKey];
        }
        saveNotes(next);
        return next;
      });
    },
    [noteKey]
  );

  const handleAlarmChange = useCallback(
    (value: string) => {
      setAlarms((prev) => {
        const next = { ...prev };
        if (value) {
          next[noteKey] = value;
          toast.success(`Alarm set for ${value}`);
        } else {
          delete next[noteKey];
          toast.info("Alarm cleared");
        }
        localStorage.setItem("wall-calendar-alarms", JSON.stringify(next));
        return next;
      });
    },
    [noteKey]
  );

  const handleTimerChange = useCallback(
    (value: string) => {
      setTimers((prev) => {
        const next = { ...prev };
        if (value) {
          next[noteKey] = value;
          toast.success(`Timer set for ${value} minutes`);
        } else {
          delete next[noteKey];
          toast.info("Timer cleared");
        }
        localStorage.setItem("wall-calendar-timers", JSON.stringify(next));
        return next;
      });
    },
    [noteKey]
  );
  const notesKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const key of Object.keys(notes)) {
      if (!notes[key]) continue;
      if (key.includes("_")) {
        const [start] = key.split("_");
        keys.add(start);
      } else if (key.length === 10) {
        keys.add(key);
      }
    }
    return keys;
  }, [notes]);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentStringTime = format(now, "HH:mm");
      const todayKey = format(now, "yyyy-MM-dd");
      if (alarms[todayKey] === currentStringTime) {
        toast(`⏰ Reminder for ${todayKey}`, {
          description: "Your scheduled alarm is ringing!",
          action: {
            label: "Dismiss",
            onClick: () => console.log("Alarm dismissed"),
          },
          duration: 10000,
        });
        setAlarms((prev) => {
          const next = { ...prev };
          delete next[todayKey];
          localStorage.setItem("wall-calendar-alarms", JSON.stringify(next));
          return next;
        });
      }
    }, 60000); 

    return () => clearInterval(interval);
  }, [alarms]);

  const handleDateClick = useCallback(
    (day: Date) => {
      if (!selecting && !startDate) {
        setStartDate(day);
        setEndDate(null);
        setSelecting(true);
      } else if (selecting && startDate) {
        if (isSameDay(day, startDate)) {
          setEndDate(day);
          setSelecting(false);
          setTaskDialogOpen(true);
        } else {
          setEndDate(day);
          setSelecting(false);
          setTaskDialogOpen(true);
        }
      } else {
        setStartDate(day);
        setEndDate(null);
        setSelecting(true);
      }
    },
    [selecting, startDate]
  );

  const handleDeleteNote = useCallback((keyToDel: string) => {
    setNotes(prev => {
      const next = { ...prev };
      delete next[keyToDel];
      saveNotes(next);
      return next;
    });
  }, []);

  const handlePrev = () => setCurrentDate((d) => subMonths(d, 1));
  const handleNext = () => setCurrentDate((d) => addMonths(d, 1));
  const handleToday = () => setCurrentDate(startOfMonth(new Date()));
  const displayStart = useMemo(() => {
    if (!startDate || !endDate) return startDate;
    return isBefore(endDate, startDate) ? endDate : startDate;
  }, [startDate, endDate]);

  const displayEnd = useMemo(() => {
    if (!startDate || !endDate) return endDate;
    return isAfter(endDate, startDate) ? endDate : startDate;
  }, [startDate, endDate]);

  return (
    <div className="max-w-6xl mx-auto my-4 sm:my-8">
      <SpiralBinding />
      <div className="bg-card rounded-b-xl shadow-xl overflow-hidden border border-border">
        <HeroPanel
          currentDate={currentDate}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
        />
        <div className="flex flex-col lg:flex-row min-h-[400px]">
          <div className="lg:w-1/3 lg:border-r border-border flex flex-col">
            <NotesPanel
              currentDate={currentDate}
              notes={notes}
              onDeleteNote={handleDeleteNote}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <CalendarGrid
              currentDate={currentDate}
              startDate={startDate}
              endDate={endDate}
              hoverDate={hoverDate}
              selecting={selecting}
              notesKeys={notesKeys}
              onDateClick={handleDateClick}
              onDateHover={setHoverDate}
            />
          </div>
        </div>
      </div>

      {}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-serif-display text-xl">
              Add Note for {displayStart && displayEnd && !isSameDay(displayStart, displayEnd)
                ? `${format(displayStart, "MMM d")} - ${format(displayEnd, "MMM d")}`
                : displayStart ? format(displayStart, "MMM d") : "Selected Date"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <textarea
              value={noteValue}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="Write your task or notes here..."
              className="w-full flex-1 min-h-[120px] resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ruled-paper"
            />

            <div className="flex flex-col gap-3 pt-3 border-t border-border mt-2">
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground font-medium">
                  <Bell className="w-4 h-4" />
                  Set Alarm:
                </label>
                <input
                  type="time"
                  value={alarms[noteKey] || ""}
                  onChange={(e) => handleAlarmChange(e.target.value)}
                  className="bg-transparent border border-input rounded px-2 py-1 text-foreground focus:ring-2 focus:ring-ring "
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground font-medium">
                  <Timer className="w-4 h-4" />
                  Timer (mins):
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="e.g. 15"
                  value={timers[noteKey] || ""}
                  onChange={(e) => handleTimerChange(e.target.value)}
                  className="bg-transparent border border-input rounded px-2 py-1 w-24 text-foreground focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <button
              onClick={() => setTaskDialogOpen(false)}
              className="mt-2 w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WallCalendar;
