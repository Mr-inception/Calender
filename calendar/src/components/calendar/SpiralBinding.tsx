const SpiralBinding = () => {
  const spirals = Array.from({ length: 13 }, (_, i) => i);

  return (
    <div className="relative h-6 flex items-center justify-center gap-[calc(100%/14)] px-8 z-10">
      {spirals.map((i) => (
        <div key={i} className="relative">
          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40 bg-background shadow-sm" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-muted-foreground/30 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default SpiralBinding;
