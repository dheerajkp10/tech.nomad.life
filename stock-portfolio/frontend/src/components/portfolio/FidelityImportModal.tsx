import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importFidelityCsv, type ImportResult } from "../../api/importCsv";

interface Props {
  onClose: () => void;
}

export default function FidelityImportModal({ onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"replace" | "merge">("replace");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => importFidelityCsv(file!, mode),
    onSuccess: (data) => {
      setResult(data);
      qc.invalidateQueries({ queryKey: ["holdings"] });
      qc.invalidateQueries({ queryKey: ["summary"] });
    },
  });

  const handleFile = (f: File) => {
    if (!f.name.endsWith(".csv")) {
      alert("Please select a .csv file");
      return;
    }
    setFile(f);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-100">Import from Fidelity</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Upload your Fidelity positions CSV export
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-2xl leading-none">×</button>
        </div>

        {/* How-to steps */}
        <div className="bg-gray-800/60 rounded-xl p-4 mb-5 text-sm space-y-1.5">
          <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-2">
            How to export from Fidelity
          </p>
          {[
            "Log in to Fidelity → Accounts & Trade → Portfolio",
            'Click "Positions" tab',
            'Click the Download icon (↓) in the top-right of the positions table',
            "Save the .csv file and upload it below",
          ].map((step, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-gray-300">{step}</span>
            </div>
          ))}
        </div>

        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors mb-4 ${
            dragOver
              ? "border-blue-500 bg-blue-950/30"
              : file
              ? "border-green-600 bg-green-950/20"
              : "border-gray-700 hover:border-gray-500"
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {file ? (
            <div>
              <p className="text-green-400 font-medium">📄 {file.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {(file.size / 1024).toFixed(1)} KB · click to change
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 text-sm">Drop your Fidelity CSV here</p>
              <p className="text-xs text-gray-600 mt-1">or click to browse</p>
            </div>
          )}
        </div>

        {/* Import mode */}
        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-2">Import mode</p>
          <div className="grid grid-cols-2 gap-2">
            {(["replace", "merge"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-colors border ${
                  mode === m
                    ? "border-blue-500 bg-blue-950/40 text-blue-300"
                    : "border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                <span className="font-medium capitalize">{m}</span>
                <p className="text-xs mt-0.5 opacity-70">
                  {m === "replace"
                    ? "Clear existing, import fresh"
                    : "Keep existing, add/update"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Error from mutation */}
        {mutation.isError && (
          <p className="text-sm text-red-400 mb-3">
            {(mutation.error as Error).message}
          </p>
        )}

        {/* Result */}
        {result && (
          <div className="bg-gray-800 rounded-xl p-4 mb-4 text-sm space-y-2">
            <div className="flex gap-4">
              <span className="text-green-400 font-bold">
                ✅ {result.imported} positions imported
              </span>
              {result.skipped > 0 && (
                <span className="text-gray-500">{result.skipped} skipped</span>
              )}
            </div>
            {result.errors.length > 0 && (
              <div className="text-xs text-yellow-400 space-y-0.5">
                {result.errors.map((e, i) => (
                  <p key={i}>⚠ {e}</p>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-500 border-t border-gray-700 pt-2 mt-2">
              {result.holdings.map((h) => (
                <span key={h.ticker} className="mr-3">
                  <span className="text-blue-400 font-medium">{h.ticker}</span>{" "}
                  {h.shares.toFixed(4)} @ ${h.avg_cost.toFixed(2)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={onClose}>
            {result ? "Close" : "Cancel"}
          </button>
          {!result && (
            <button
              className="btn-primary flex-1"
              disabled={!file || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Importing...
                </span>
              ) : (
                "Import Holdings"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
