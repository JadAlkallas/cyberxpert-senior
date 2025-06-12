
// Utility classes for dropdown menus to ensure proper backgrounds and z-index
export const dropdownMenuClasses = {
  content: "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  item: "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  separator: "-mx-1 my-1 h-px bg-muted",
  label: "px-2 py-1.5 text-sm font-semibold",
  shortcut: "ml-auto text-xs tracking-widest opacity-60"
};

// Ensure dropdowns are not transparent
export const ensureDropdownBackground = (className?: string) => {
  const baseClasses = "bg-background border-border";
  return className ? `${baseClasses} ${className}` : baseClasses;
};
