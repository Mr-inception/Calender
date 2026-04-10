export interface CalendarState {
  currentDate: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  selecting: boolean;
  notes: Record<string, string>;
}

export const MONTH_COLORS: Record<number, string> = {
  0: "#0284c7", // January - blue
  1: "#0369a1", // February - dark blue
  2: "#15803d", // March - green
  3: "#be185d", // April - pink
  4: "#0f766e", // May - teal
  5: "#4d7c0f", // June - lime/green
  6: "#eab308", // July - yellow
  7: "#ea580c", // August - orange
  8: "#b45309", // September - amber/brown
  9: "#c2410c", // October - orange/red
  10: "#4b5563", // November - gray
  11: "#1d4ed8", // December - blue
};

export const MONTH_IMAGES: Record<number, string> = {
  0: "https://picsum.photos/seed/january-landscape/800/400",
  1: "https://picsum.photos/seed/february-nature/800/400",
  2: "https://picsum.photos/seed/march-blooms/800/400",
  3: "https://picsum.photos/seed/april-scenic/800/400",
  4: "https://picsum.photos/seed/may-river/800/400",
  5: "https://picsum.photos/seed/june-meadow/800/400",
  6: "https://picsum.photos/seed/july-beach/800/400",
  7: "https://picsum.photos/seed/august-sunset/800/400",
  8: "https://picsum.photos/seed/september-fall/800/400",
  9: "https://picsum.photos/seed/october-forest/800/400",
  10: "https://picsum.photos/seed/november-mist/800/400",
  11: "https://picsum.photos/seed/december-winter/800/400",
};

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
