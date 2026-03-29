import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconContainerProps {
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function IconContainer({ 
  icon: Icon, 
  variant = "secondary", 
  size = "md",
  className 
}: IconContainerProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-9 w-9",
  };

  const variantClasses = {
    primary: "from-primary to-primary/80 text-primary-foreground shadow-[0_8px_30px_-6px_hsl(var(--primary)/0.4)]",
    secondary: "from-secondary to-secondary/80 text-secondary-foreground shadow-[0_4px_20px_-4px_hsl(var(--secondary)/0.3)]",
    accent: "from-accent to-accent/80 text-accent-foreground shadow-[0_4px_20px_-4px_hsl(var(--accent)/0.3)]",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center bg-gradient-to-br transition-all duration-300",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={{
        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      }}
    >
      {/* Inner glow effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 opacity-60"
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      />
      <Icon className={cn(iconSizes[size], "relative z-10 drop-shadow-sm")} strokeWidth={1.75} />
    </div>
  );
}
