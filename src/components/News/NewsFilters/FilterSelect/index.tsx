import { useState, useRef, useEffect, useMemo } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
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

  // Close on outside click and escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchTerm("");
      }
    };

    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const selectedOption = useMemo(() => {
    if (!value) return undefined;
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (!normalizedSearch) return options;

    return options.filter((opt) =>
      opt.label.toLowerCase().includes(normalizedSearch),
    );
  }, [options, normalizedSearch]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => !disabled && setOpen(true)}
        className="w-full bg-white/5 backdrop-blur-md text-white
                 px-4 py-2.5 rounded-full
                 flex justify-between items-center
                 border border-white/10
hover:border-white/20
focus-within:border-purple-400/40
                 hover:bg-purple-600/20
                 transition-colors duration-200
                 cursor-text"
      >
        <div className="flex-1">
          {open ? (
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder={label}
              className="w-full bg-transparent outline-none text-white placeholder-white/50"
            />
          ) : (
            <span>{selectedOption?.label || label}</span>
          )}
        </div>

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
      </div>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className="absolute mt-2 w-full
                   bg-[#140c24]
                   border border-purple-500/30
                   rounded-2xl
                   shadow-[0_10px_40px_rgba(0,0,0,0.6)]
                   backdrop-blur-xl
                   z-50"
        >
          <div className="max-h-64 overflow-y-auto custom-scroll">
            <button
              onClick={() => {
                onChange("");
                setSearchTerm("");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5
                       text-white/90
                       hover:bg-purple-600/30
                       transition-colors"
            >
              {label}
            </button>

            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-white/60 text-sm">
                No results found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value === opt.value;

                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setSearchTerm("");
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5
            transition-all duration-200
            rounded-xl
            border border-transparent
            hover:bg-white/10
hover:border-white/20


            ${
              isSelected
                ? "bg-white/15 border-white/25 text-white font-medium"
                : "text-white/90"
            }`}
                  >
                    {opt.label}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
