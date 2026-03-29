import { cn } from "@/lib/utils";
import horizontalLogo from "@/assets/horizontal-logo.png";
import iconLogo from "@/assets/icon-logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", variant = "dark", showText = true, className }: LogoProps) {
  const sizes = {
    sm: "h-9",
    md: "h-11",
    lg: "h-14",
  };

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex items-center", className)}>
      {showText ? (
        <img
          src={horizontalLogo}
          alt="Fondation NIYA"
          className={cn("object-contain", sizes[size])}
        />
      ) : (
        <img
          src={iconLogo}
          alt="Fondation NIYA"
          className={cn("object-contain", iconSizes[size])}
        />
      )}
    </div>
  );
}
