export function dominantColorFromName(input: string): string {
  const hash = [...input].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const r = 40 + (hash % 120);
  const g = 60 + ((hash * 3) % 110);
  const b = 80 + ((hash * 5) % 100);
  return `rgb(${r}, ${g}, ${b})`;
}

export function pseudoBlurhash(input: string): string {
  return Buffer.from(input).toString("base64").slice(0, 20);
}
