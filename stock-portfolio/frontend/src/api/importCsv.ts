import client from "./client";

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
  holdings: { ticker: string; shares: number; avg_cost: number }[];
}

export const importFidelityCsv = (
  file: File,
  mode: "replace" | "merge" = "replace"
): Promise<ImportResult> => {
  const form = new FormData();
  form.append("file", file);
  // Don't set Content-Type manually — let the browser set it with the
  // correct multipart boundary automatically
  return client.post(`/api/import/fidelity?mode=${mode}`, form);
};
