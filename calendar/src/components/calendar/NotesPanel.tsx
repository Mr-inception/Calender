import { format, differenceInDays, isSameMonth } from "date-fns";
import { Bell, Timer } from "lucide-react";

interface NotesPanelProps {
  currentDate: Date;
  notes: Record<string, string>;
  onDeleteNote: (key: string) => void;
}

const NotesPanel = ({
  currentDate,
  notes,
  onDeleteNote,
}: NotesPanelProps) => {
  // Filter notes to only those belonging to the current month view
  // Keys are format yyyy-MM-dd or yyyy-MM-dd_yyyy-MM-dd
  const monthlyTasks = Object.entries(notes).filter(([key, value]) => {
    if (!value) return false;
    const keyMonth = key.substring(0, 7); // yyyy-MM
    return keyMonth === format(currentDate, "yyyy-MM");
  }).sort();

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col border-t lg:border-t-0 border-border">
      <h3 className="font-serif-display text-lg font-semibold text-foreground mb-4">
        {format(currentDate, "MMMM yyyy")} Tasks
      </h3>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {monthlyTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No tasks or notes for this month.</p>
        ) : (
          monthlyTasks.map(([key, value]) => {
            // format standard dates
            let label = key;
            if (key.includes("_")) {
              const [s, e] = key.split("_");
              const start = format(new Date(s), "MMM d");
              const end = format(new Date(e), "MMM d");
              label = start === end ? start : `${start} – ${end}`;
            } else if (key.length === 10) {
              label = format(new Date(key), "MMM d");
            }

            return (
              <div key={key} className="p-3 rounded-lg border border-border bg-background/50 relative group">
                <span className="text-xs font-bold text-calendar-range mb-1 block uppercase tracking-wider">
                  {label}
                </span>
                <p className="text-sm text-foreground whitespace-pre-wrap">{value}</p>
                <button
                  onClick={() => onDeleteNote(key)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotesPanel;
