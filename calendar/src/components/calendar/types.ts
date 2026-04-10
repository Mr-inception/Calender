export interface CalendarState {
  currentDate: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  selecting: boolean;
  notes: Record<string, string>;
}

export const MONTH_COLORS: Record<number, string> = {
  0: "#0284c7", 
  1: "#0369a1", 
  2: "#15803d", 
  3: "#be185d", 
  4: "#0f766e", 
  5: "#4d7c0f", 
  6: "#eab308", 
  7: "#ea580c", 
  8: "#b45309", 
  9: "#c2410c", 
  10: "#4b5563", 
  11: "#1d4ed8", 
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
