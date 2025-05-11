
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader
      className={cn(
        "animate-spin text-cyber-orange",
        sizeClasses[size],
        className
      )}
    />
  );
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-md z-10">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="lg" className="text-cyber-orange" />
        <p className="text-sm text-cyber-orange font-medium">Loading...</p>
      </div>
    </div>
  );
}
