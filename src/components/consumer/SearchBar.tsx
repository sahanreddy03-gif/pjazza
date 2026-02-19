"use client";

/**
 * SearchBar — text input with magnifying glass icon
 */

import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        aria-hidden
      >
        <SearchIcon />
      </span>
      <input
        type="search"
        placeholder="Search anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-apple bg-white py-3.5 pl-11 pr-4 text-[15px] text-ink placeholder:text-ink-muted shadow-card border-0 focus:outline-none focus:ring-2 focus:ring-ink/20 transition-shadow"
      />
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
