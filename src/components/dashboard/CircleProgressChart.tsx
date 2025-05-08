import { cn } from "@/lib/utils";
interface CircleProgressChartProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  title?: string;
  description?: string;
  animate?: boolean;
  className?: string;
}
const CircleProgressChart = ({
  value,
  size = 120,
  strokeWidth = 8,
  title,
  description,
  animate = true,
  className
}: CircleProgressChartProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - value / 100 * circumference;
  let strokeColor;
  if (value >= 80) strokeColor = "#22c55e"; // green
  else if (value >= 60) strokeColor = "#f97316"; // orange
  else if (value >= 30) strokeColor = "#eab308"; // yellow
  else strokeColor = "#ef4444"; // red

  return <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative" style={{
      width: size,
      height: size
    }}>
        {/* Background circle */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
          
          {/* Progress circle with animation */}
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={animate ? circumference : offset} strokeLinecap="round" className={animate ? "transition-all duration-1000 ease-out" : ""} style={animate ? {
          strokeDashoffset: offset
        } : {}} />
        </svg>
        
        {/* Centered value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-base">{value}%</span>
        </div>
      </div>
      
      {title && <div className="mt-2 text-center">
          <h3 className="font-medium text-sm">{title}</h3>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>}
    </div>;
};
export default CircleProgressChart;