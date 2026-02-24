import { useState, useRef, useEffect } from "react";

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="w-full bg-white/5 backdrop-blur-md text-white
                 px-4 py-2.5 rounded-full
                 flex justify-between items-center
                 border border-transparent
                 hover:bg-purple-600/20
                 hover:border-purple-400
                 focus:outline-none focus:ring-2 focus:ring-purple-400
                 transition-all duration-200
                 disabled:opacity-50"
      >
        <span>{value || label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          className="absolute mt-2 min-w-full w-max
                   bg-[#140c24]
                   border border-purple-500/30
                   rounded-2xl
                   shadow-[0_10px_40px_rgba(0,0,0,0.6)]
                   backdrop-blur-xl
                   z-50"
        >
          <div className="max-h-64 overflow-y-auto custom-scroll">
            {/* Default Option */}
            <button
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-left px-4 py-2.5 whitespace-nowrap
                       text-white/90
                       transition-transform duration-150 ease-out
                       transform
                       hover:scale-[1.02]
                       active:scale-[0.98]"
            >
              {label}
            </button>

            {options.map((opt) => {
              const isSelected = value === opt;

              return (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`text-left px-4 py-2.5 whitespace-nowrap
                  transition-transform duration-150 ease-out
                  transform
                  hover:scale-[1.02]
                  active:scale-[0.98]
                  ${isSelected ? "text-white font-semibold" : "text-white/90"}
                `}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
