import { Drink } from "./types";

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const bin = atob(padded + pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeDrinkToHash(drink: Drink): string {
  return toBase64Url(JSON.stringify(drink));
}

export function decodeDrinkFromHash(hash: string): Drink | null {
  try {
    const raw = hash.startsWith("#") ? hash.slice(1) : hash;
    const data = new URLSearchParams(raw).get("data");
    if (!data) return null;
    const parsed = JSON.parse(fromBase64Url(data)) as Drink;
    if (!parsed?.id || !Array.isArray(parsed.rows)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function buildShareUrl(origin: string, drink: Drink): string {
  return `${origin}/shared#data=${encodeDrinkToHash(drink)}`;
}
