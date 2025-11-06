import React from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

interface SelectDropdownProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  icon,
  className = "",
  size = "md",
  disabled = false,
}) => {
  const sizeClasses =
    size === "sm"
      ? "pl-9 pr-8 py-1.5 text-sm"
      : size === "lg"
      ? "pl-11 pr-10 py-3 text-base"
      : "pl-10 pr-8 py-2 text-sm";

  return (
    <div className={clsx("relative", className)}>
      {icon && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}

      <select
        className={clsx(
          "appearance-none bg-white border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500",
          sizeClasses,
          disabled && "opacity-60 cursor-not-allowed"
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDown
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        size={18}
      />
    </div>
  );
};

export default SelectDropdown;
