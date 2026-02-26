export function toOptions(items, getValue, getLabel, allLabel) {
  const base = allLabel ? [{ label: allLabel, value: "all" }] : [];
  const seen = new Set();
  const rows = [];
  (items || []).forEach((item) => {
    const value = getValue(item);
    if (!value || seen.has(String(value))) return;
    seen.add(String(value));
    rows.push({ value: String(value), label: String(getLabel(item) || value) });
  });
  rows.sort((a, b) => a.label.localeCompare(b.label));
  return [...base, ...rows];
}

export function unwrapData(result) {
  if (!result || result.error) return null;
  return result.data?.data || result.data || null;
}
