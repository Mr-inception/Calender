import { useState, useRef } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, ImagePlus, RefreshCw } from "lucide-react";
import { MONTH_IMAGES } from "./types";
import { toast } from "sonner";

interface HeroPanelProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const CUSTOM_IMAGES_KEY = "wall-calendar-custom-images";

const HeroPanel = ({ currentDate, onPrev, onNext, onToday }: HeroPanelProps) => {
  const [customImages, setCustomImages] = useState<Record<number, string>>(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_IMAGES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const monthIndex = currentDate.getMonth();
  const imageUrl = customImages[monthIndex] || MONTH_IMAGES[monthIndex];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large. Please use an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomImages((prev) => {
        const next = { ...prev, [monthIndex]: dataUrl };
        localStorage.setItem(CUSTOM_IMAGES_KEY, JSON.stringify(next));
        return next;
      });
      toast.success("Month image updated!");
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleResetImage = () => {
    setCustomImages((prev) => {
      const next = { ...prev };
      delete next[monthIndex];
      localStorage.setItem(CUSTOM_IMAGES_KEY, JSON.stringify(next));
      return next;
    });
    toast.success("Restored default image");
  };

  return (
    <div className="group relative w-full h-64 sm:h-80 lg:h-[400px] overflow-hidden bg-muted">
      <img
        key={imageUrl}
        src={imageUrl}
        alt={`${format(currentDate, "MMMM")} landscape`}
        className="absolute inset-0 w-full h-full object-cover animate-fade-in"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />

      {}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
        {customImages[monthIndex] && (
          <button
            onClick={handleResetImage}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
            title="Restore default picture"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
          title="Change month picture"
        >
          <ImagePlus className="w-5 h-5" />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex justify-between items-end">
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={onPrev}
            className="p-2 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground backdrop-blur-sm transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onToday}
            className="px-4 py-1.5 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground text-sm font-medium backdrop-blur-sm transition-colors"
          >
            Today
          </button>
          <button
            onClick={onNext}
            className="p-2 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground backdrop-blur-sm transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-right relative z-10">
          <p className="text-primary-foreground/90 text-lg sm:text-xl font-medium tracking-[0.2em] mb-1">
            {format(currentDate, "yyyy")}
          </p>
          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground drop-shadow-md uppercase tracking-wide">
            {format(currentDate, "MMMM")}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HeroPanel;
