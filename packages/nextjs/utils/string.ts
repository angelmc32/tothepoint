export function truncateString(str: string | undefined, start = 6, end = 4) {
  if (!str) return "Could not format address...";
  return `${str.slice(0, start)}...${str.slice(0 - end)}`;
}

export function copyToClipboard(entryText: string) {
  void navigator.clipboard.writeText(entryText);
}
