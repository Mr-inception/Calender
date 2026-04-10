import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
  isWeekend,
  isBefore,
  isAfter,
  format,
} from "date-fns";
import { WEEKDAYS, MONTH_COLORS } from "./types";

interface CalendarGridProps {
  currentDate: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  selecting: boolean;
  notesKeys: Set<string>;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
}

const CalendarGrid = ({
  currentDate,
  startDate,
  endDate,
  hoverDate,
  selecting,
  notesKeys,
  onDateClick,
  onDateHover,
}: CalendarGridProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const themeColor = MONTH_COLORS[currentDate.getMonth()];

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(addDays(calStart, i));
  }

  const getPreviewEnd = () => {
    if (selecting && startDate && hoverDate) return hoverDate;
    return endDate;
  };

  const isInRange = (day: Date) => {
    if (!startDate) return false;
    const end = getPreviewEnd();
    if (!end) return false;

    const rangeStart = isBefore(end, startDate) ? end : startDate;
    const rangeEnd = isAfter(end, startDate) ? end : startDate;

    return (isAfter(day, rangeStart) || isSameDay(day, rangeStart)) &&
      (isBefore(day, rangeEnd) || isSameDay(day, rangeEnd));
  };

  const isRangeStart = (day: Date) => {
    if (!startDate) return false;
    const end = getPreviewEnd();
    if (!end) return isSameDay(day, startDate);
    const rangeStart = isBefore(end, startDate) ? end : startDate;
    return isSameDay(day, rangeStart);
  };

  const isRangeEnd = (day: Date) => {
    const end = getPreviewEnd();
    if (!startDate || !end) return false;
    const rangeEnd = isAfter(end, startDate) ? end : startDate;
    return isSameDay(day, rangeEnd) && !isSameDay(startDate, end);
  };

  const hasNote = (day: Date) => notesKeys.has(format(day, "yyyy-MM-dd"));

  return (
    <div className="p-4 sm:p-6">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const inMonth = isSameMonth(day, currentDate);
          const today = isToday(day);
          const weekend = isWeekend(day);
          const inRange = isInRange(day);
          const rangeStart = isRangeStart(day);
          const rangeEnd = isRangeEnd(day);
          const noted = hasNote(day);

          return (
            <button
              key={idx}
              onClick={() => onDateClick(day)}
              onMouseEnter={() => onDateHover(day)}
              onMouseLeave={() => onDateHover(null)}
              className={`
                relative flex flex-col items-center justify-center
                h-10 sm:h-12 text-sm transition-colors duration-150
                ${!inMonth ? "text-calendar-outside" : weekend ? "text-calendar-weekend" : "text-foreground"}
                ${rangeStart ? "text-primary-foreground rounded-l-full" : ""}
                ${rangeEnd ? "text-primary-foreground rounded-r-full" : ""}
                ${!inRange ? "hover:bg-calendar-hover rounded-md" : ""}
              `}
              style={
                rangeStart || rangeEnd
                  ? { backgroundColor: themeColor }
                  : inRange
                    ? { backgroundColor: `${themeColor}33` } // Add transparency
                    : {}
              }
            >
              <span className={`relative z-10 ${today && !rangeStart && !rangeEnd ? "font-bold" : ""}`}>
                {format(day, "d")}
              </span>

              {/* Today dot */}
              {today && !rangeStart && !rangeEnd && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}

              {/* Notes dot */}
              {noted && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-calendar-notes-dot" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
