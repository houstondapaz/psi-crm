"use client";

import { useEffect, useId, useRef, useState } from "react";
import { searchAddresses } from "@/lib/photon-geocoding";
import { Input } from "@/components/ui/input";
import { t } from "@/lib/i18n";

type AddressInputProps = {
  id: string;
  name?: string;
  defaultValue?: string;
};

export function AddressInput({ id, name = "address", defaultValue = "" }: AddressInputProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{ label: string }[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [suggestions]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = window.setTimeout(() => {
      void searchAddresses(trimmed).then((results) => {
        setSuggestions(results);
        setLoading(false);
      });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [value]);

  function selectSuggestion(label: string) {
    setValue(label);
    setOpen(false);
    setSuggestions([]);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (suggestions.length === 0) {
        return;
      }
      setOpen(true);
      setActiveIndex((index) => (index + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (suggestions.length === 0) {
        return;
      }
      setOpen(true);
      setActiveIndex((index) => (index - 1 + suggestions.length) % suggestions.length);
      return;
    }

    if (event.key === "Enter" && open && suggestions.length > 0) {
      event.preventDefault();
      const suggestion = suggestions[activeIndex];
      if (suggestion) {
        selectSuggestion(suggestion.label);
      }
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const showDropdown = open && (loading || suggestions.length > 0);

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        name={name}
        value={value}
        autoComplete="street-address"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-autocomplete="list"
        onChange={(event) => {
          setValue(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {loading && (
            <li className="px-3 py-2 text-sm text-gray-500">{t("common.searching")}</li>
          )}
          {!loading &&
            suggestions.map((suggestion, index) => (
              <li key={suggestion.label} role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  className={`block w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 ${
                    index === activeIndex ? "bg-gray-50" : ""
                  }`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectSuggestion(suggestion.label)}
                >
                  {suggestion.label}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
