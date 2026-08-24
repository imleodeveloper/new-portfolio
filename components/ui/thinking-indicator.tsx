interface ThinkingIndicatorProps {
  label?: string;
}

export function ThinkingIndicator({ label = "Pensando..." }: ThinkingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 py-2">
      <div className="flex items-center gap-1">
        <span
          className="w-2 h-2 bg-muted rounded-full animate-bounce-dot"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="w-2 h-2 bg-muted rounded-full animate-bounce-dot"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="w-2 h-2 bg-muted rounded-full animate-bounce-dot"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
      <span className="text-xs text-muted italic">{label}</span>
    </div>
  );
}
