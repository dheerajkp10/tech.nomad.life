import { useState, useRef, useEffect } from "react";
import { searchTickers } from "../../api/market";
import type { SearchResult } from "../../types";

interface Props {
  onSelect: (ticker: string) => void;
  placeholder?: string;
}

export default function TickerSearch({ onSelect, placeholder = "Search ticker..." }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    if (value.length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchTickers(value);
        setResults(data.slice(0, 8));
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelect = (ticker: string) => {
    setQuery(ticker);
    setOpen(false);
    onSelect(ticker);
  };

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <input
        type="text"
        className="input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && query.trim()) {
            handleSelect(query.trim().toUpperCase());
          }
        }}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {results.map((r) => (
            <button
              key={r.symbol}
              className="w-full text-left px-4 py-2.5 hover:bg-gray-800 flex items-center justify-between text-sm"
              onClick={() => handleSelect(r.symbol)}
            >
              <div>
                <span className="font-semibold text-gray-100">{r.symbol}</span>
                <span className="text-gray-400 ml-2 text-xs truncate max-w-[180px] inline-block align-middle">
                  {r.name}
                </span>
              </div>
              <span className="text-xs text-gray-600">{r.exchange}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
