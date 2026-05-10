"use client";

import { Drink, ModifierRow, STORAGE_KEY, Store } from "./types";

function emptyStore(): Store {
  return { drinks: [], schemaVersion: 1 };
}

function readStore(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Store;
    if (!parsed || !Array.isArray(parsed.drinks)) return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

function writeStore(store: Store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event("drink-store-change"));
}

export function listDrinks(): Drink[] {
  return readStore().drinks.slice().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getDrink(id: string): Drink | undefined {
  return readStore().drinks.find((d) => d.id === id);
}

export function newDrink(): Drink {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    name: "",
    rows: [],
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function newRow(label = "", value = ""): ModifierRow {
  return { id: crypto.randomUUID(), label, value };
}

export function saveDrink(drink: Drink): Drink {
  const store = readStore();
  const next: Drink = { ...drink, updatedAt: Date.now() };
  const idx = store.drinks.findIndex((d) => d.id === drink.id);
  if (idx === -1) store.drinks.push(next);
  else store.drinks[idx] = next;
  writeStore(store);
  return next;
}

export function deleteDrink(id: string) {
  const store = readStore();
  store.drinks = store.drinks.filter((d) => d.id !== id);
  writeStore(store);
}

export function exportJson(): string {
  return JSON.stringify(readStore(), null, 2);
}

export function importJson(json: string): { added: number } {
  const incoming = JSON.parse(json) as Store;
  if (!incoming || !Array.isArray(incoming.drinks)) {
    throw new Error("Invalid file: expected a drink-card export.");
  }
  const store = readStore();
  const byId = new Map(store.drinks.map((d) => [d.id, d]));
  for (const d of incoming.drinks) byId.set(d.id, d);
  const merged: Store = { schemaVersion: 1, drinks: [...byId.values()] };
  writeStore(merged);
  return { added: incoming.drinks.length };
}

export function resetAll() {
  writeStore(emptyStore());
}

export function upsertImportedDrink(drink: Drink) {
  const store = readStore();
  const idx = store.drinks.findIndex((d) => d.id === drink.id);
  if (idx === -1) store.drinks.push(drink);
  else store.drinks[idx] = drink;
  writeStore(store);
}

export function subscribe(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => listener();
  window.addEventListener("drink-store-change", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("drink-store-change", handler);
    window.removeEventListener("storage", handler);
  };
}
