import { useState, useRef, useEffect, useMemo, useId } from "react";

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
  const [justSelected, setJustSelected] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  /* ---------------- Scroll to Blog Section ---------------- */

  const scrollToBlogSection = () => {
    const blogSection = document.getElementById("blog-section");
    if (!blogSection) return;

    blogSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ---------------- Close on Escape & Outside Click ---------------- */

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchTerm("");
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
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

  /* ---------------- Reset search when value changes ---------------- */

  useEffect(() => {
    setSearchTerm("");
  }, [value]);

  /* ---------------- Filtering ---------------- */

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (!normalizedSearch) return options;

    return options.filter((opt) =>
      opt.label.toLowerCase().includes(normalizedSearch),
    );
  }, [options, normalizedSearch]);

  /* ---------------- Selection Handler ---------------- */

  const handleSelect = (newValue: string) => {
    if (newValue !== value) {
      onChange(newValue);
      setJustSelected(true);

      // Smooth scroll after route/filter update
      setTimeout(() => {
        scrollToBlogSection();
        setJustSelected(false);
      }, 150);
    }

    setOpen(false);
  };

  /* ---------------- Component ---------------- */

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        tabIndex={0}
        onClick={() => !disabled && setOpen(true)}
        className={`w-full bg-white/5 backdrop-blur-md text-white
                   px-4 py-2.5 rounded-full
                   flex justify-between items-center
                   border
                   transition-all duration-200
                   cursor-text
                   ${
                     justSelected
                       ? "border-purple-400/50 ring-2 ring-purple-500/30"
                       : "border-white/10 hover:border-white/20 focus-within:border-purple-400/40"
                   }
                   hover:bg-purple-600/10`}
      >
        <div className="flex-1 min-w-0">
          {open ? (
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder={label}
              className="w-full bg-transparent outline-none
                         text-white placeholder-white/50"
            />
          ) : (
            <span
              className={
                selectedOption ? "text-white font-medium" : "text-white/60"
              }
            >
              {selectedOption?.label || label}
            </span>
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
          id={listboxId}
          role="listbox"
          className="absolute mt-2 w-full
                     bg-[#140c24]
                     border border-white/10
                     rounded-2xl
                     shadow-xl
                     backdrop-blur-xl
                     z-50
                     animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="max-h-64 overflow-y-auto custom-scroll p-1">
            {/* Reset Option */}
            <button
              role="option"
              aria-selected={!value}
              onClick={() => handleSelect("")}
              className="w-full text-left px-4 py-2.5 rounded-xl
                         border border-transparent
                         text-white/90
                         transition-all duration-200
                         hover:bg-white/10
                         hover:border-white/20"
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
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-4 py-2.5
                                rounded-xl
                                border border-transparent
                                transition-all duration-200
                                hover:bg-white/10
                                hover:border-white/20
                                ${
                                  isSelected
                                    ? "bg-white/15 border-white/20 text-white font-medium"
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
