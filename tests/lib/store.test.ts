import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  listDrinks,
  getDrink,
  newDrink,
  newRow,
  saveDrink,
  deleteDrink,
  exportJson,
  importJson,
  resetAll,
  upsertImportedDrink,
  subscribe,
} from "@/lib/store";
import { STORAGE_KEY, type Drink, type Store } from "@/lib/types";

// ----- inline test factories (do not call production newDrink) -----

let counter = 0;
function uid(prefix = "id"): string {
  counter += 1;
  return `${prefix}-${counter}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeDrink(overrides: Partial<Drink> = {}): Drink {
  const now = overrides.updatedAt ?? overrides.createdAt ?? 1_000_000;
  return {
    id: overrides.id ?? uid("drink"),
    name: overrides.name ?? "Test Drink",
    rows: overrides.rows ?? [],
    notes: overrides.notes ?? "",
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    ...overrides,
  };
}

function seedStorage(drinks: Drink[]) {
  const store: Store = { drinks, schemaVersion: 1 };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function readRaw(): Store | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Store) : null;
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("listDrinks", () => {
  it("returns [] when storage is empty", () => {
    expect(listDrinks()).toEqual([]);
  });

  it("returns drinks sorted by updatedAt descending (newest first)", () => {
    const a = makeDrink({ id: "a", updatedAt: 100 });
    const b = makeDrink({ id: "b", updatedAt: 300 });
    const c = makeDrink({ id: "c", updatedAt: 200 });
    seedStorage([a, b, c]);

    const result = listDrinks();
    expect(result.map((d) => d.id)).toEqual(["b", "c", "a"]);
  });
});

describe("newDrink / newRow", () => {
  it("newDrink() returns a fresh drink with non-empty uuid id, empty fields, and createdAt === updatedAt", () => {
    const d = newDrink();
    expect(typeof d.id).toBe("string");
    expect(d.id.length).toBeGreaterThan(0);
    expect(d.name).toBe("");
    expect(d.notes).toBe("");
    expect(d.rows).toEqual([]);
    expect(d.createdAt).toBe(d.updatedAt);
    expect(typeof d.createdAt).toBe("number");
  });

  it("two consecutive newDrink() calls produce different ids", () => {
    const d1 = newDrink();
    const d2 = newDrink();
    expect(d1.id).not.toBe(d2.id);
  });

  it("newRow('Size', 'Grande') returns { id, label, value } with non-empty id", () => {
    const r = newRow("Size", "Grande");
    expect(r.label).toBe("Size");
    expect(r.value).toBe("Grande");
    expect(typeof r.id).toBe("string");
    expect(r.id.length).toBeGreaterThan(0);
  });

  it("newRow() with no args defaults label and value to ''", () => {
    const r = newRow();
    expect(r.label).toBe("");
    expect(r.value).toBe("");
    expect(r.id.length).toBeGreaterThan(0);
  });
});

describe("saveDrink", () => {
  it("saves a brand-new drink so it appears in listDrinks", () => {
    const d = makeDrink({ id: "new-1", name: "Latte" });
    saveDrink(d);
    const list = listDrinks();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe("new-1");
    expect(list[0].name).toBe("Latte");
  });

  it("updates an existing drink in place (no duplicate ids in storage)", () => {
    const d = makeDrink({ id: "same", name: "Original", updatedAt: 100 });
    seedStorage([d]);
    saveDrink({ ...d, name: "Updated" });

    const raw = readRaw();
    expect(raw?.drinks).toHaveLength(1);
    expect(raw?.drinks[0].name).toBe("Updated");
    expect(raw?.drinks[0].id).toBe("same");
  });

  it("stamps updatedAt with the current time", () => {
    vi.useFakeTimers();
    const fixed = new Date("2026-01-15T12:00:00.000Z");
    vi.setSystemTime(fixed);

    const d = makeDrink({ id: "stamp", updatedAt: 1 });
    const saved = saveDrink(d);
    expect(saved.updatedAt).toBe(fixed.getTime());
  });

  it("returns the saved drink with the fresh updatedAt", () => {
    vi.useFakeTimers();
    const t = new Date("2026-03-03T03:03:03.000Z").getTime();
    vi.setSystemTime(t);

    const d = makeDrink({ id: "ret", updatedAt: 0 });
    const saved = saveDrink(d);
    expect(saved.id).toBe("ret");
    expect(saved.updatedAt).toBe(t);
  });

  it("dispatches a 'drink-store-change' event on window", () => {
    const listener = vi.fn();
    window.addEventListener("drink-store-change", listener);
    saveDrink(makeDrink({ id: "evt" }));
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener("drink-store-change", listener);
  });
});

describe("getDrink", () => {
  it("returns the drink when the id matches", () => {
    const d = makeDrink({ id: "find-me", name: "Mocha" });
    seedStorage([d]);
    expect(getDrink("find-me")?.name).toBe("Mocha");
  });

  it("returns undefined when the id does not match", () => {
    seedStorage([makeDrink({ id: "x" })]);
    expect(getDrink("nope")).toBeUndefined();
  });
});

describe("deleteDrink", () => {
  it("removes the drink whose id matches", () => {
    const a = makeDrink({ id: "a" });
    const b = makeDrink({ id: "b" });
    seedStorage([a, b]);
    deleteDrink("a");
    const ids = listDrinks().map((d) => d.id);
    expect(ids).toEqual(["b"]);
  });

  it("is a no-op when the id does not match (storage shape unchanged)", () => {
    const a = makeDrink({ id: "a" });
    const b = makeDrink({ id: "b" });
    seedStorage([a, b]);
    deleteDrink("does-not-exist");
    const raw = readRaw();
    expect(raw?.drinks).toHaveLength(2);
    expect(raw?.drinks.map((d) => d.id).sort()).toEqual(["a", "b"]);
  });

  it("dispatches a 'drink-store-change' event", () => {
    seedStorage([makeDrink({ id: "a" })]);
    const listener = vi.fn();
    window.addEventListener("drink-store-change", listener);
    deleteDrink("a");
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener("drink-store-change", listener);
  });
});

describe("exportJson / importJson", () => {
  it("exportJson() is parseable JSON with drinks array and schemaVersion", () => {
    seedStorage([makeDrink({ id: "x" })]);
    const json = exportJson();
    const parsed = JSON.parse(json);
    expect(Array.isArray(parsed.drinks)).toBe(true);
    expect(parsed.schemaVersion).toBe(1);
  });

  it("exportJson -> importJson round-trip preserves the drinks", () => {
    const a = makeDrink({ id: "a", name: "A", updatedAt: 1 });
    const b = makeDrink({ id: "b", name: "B", updatedAt: 2 });
    seedStorage([a, b]);
    const json = exportJson();

    window.localStorage.clear();
    importJson(json);

    const list = listDrinks();
    expect(list.map((d) => d.id).sort()).toEqual(["a", "b"]);
    expect(list.find((d) => d.id === "a")?.name).toBe("A");
    expect(list.find((d) => d.id === "b")?.name).toBe("B");
  });

  it("importJson reports { added: N } matching the count of incoming drinks", () => {
    const incoming: Store = {
      schemaVersion: 1,
      drinks: [
        makeDrink({ id: "i1" }),
        makeDrink({ id: "i2" }),
        makeDrink({ id: "i3" }),
      ],
    };
    const result = importJson(JSON.stringify(incoming));
    expect(result.added).toBe(3);
  });

  it("importJson of an existing-id drink replaces the local one (incoming wins)", () => {
    const local = makeDrink({ id: "shared", name: "Local Name" });
    seedStorage([local]);

    const incoming: Store = {
      schemaVersion: 1,
      drinks: [makeDrink({ id: "shared", name: "Incoming Name" })],
    };
    importJson(JSON.stringify(incoming));

    expect(getDrink("shared")?.name).toBe("Incoming Name");
  });

  it("importJson of a non-array drinks payload throws an error mentioning 'Invalid'", () => {
    expect(() => importJson(JSON.stringify({ drinks: "nope" }))).toThrowError(
      /Invalid/,
    );
  });

  it("importJson of malformed JSON throws", () => {
    expect(() => importJson("{not json")).toThrow();
  });
});

describe("resetAll", () => {
  it("wipes all drinks (listDrinks() returns [] afterward)", () => {
    seedStorage([makeDrink({ id: "a" }), makeDrink({ id: "b" })]);
    resetAll();
    expect(listDrinks()).toEqual([]);
  });

  it("dispatches a 'drink-store-change' event", () => {
    const listener = vi.fn();
    window.addEventListener("drink-store-change", listener);
    resetAll();
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener("drink-store-change", listener);
  });
});

describe("upsertImportedDrink", () => {
  it("inserts a new drink without re-stamping updatedAt", () => {
    const d = makeDrink({ id: "imp-1", updatedAt: 12345 });
    upsertImportedDrink(d);
    const got = getDrink("imp-1");
    expect(got).toBeDefined();
    expect(got?.updatedAt).toBe(12345);
  });

  it("updates an existing drink", () => {
    const original = makeDrink({ id: "imp-2", name: "Old", updatedAt: 100 });
    seedStorage([original]);
    const replacement = makeDrink({
      id: "imp-2",
      name: "New",
      updatedAt: 100,
    });
    upsertImportedDrink(replacement);

    const raw = readRaw();
    expect(raw?.drinks).toHaveLength(1);
    expect(raw?.drinks[0].name).toBe("New");
    expect(raw?.drinks[0].updatedAt).toBe(100);
  });
});

describe("subscribe", () => {
  it("listener is called after saveDrink", () => {
    const listener = vi.fn();
    const unsub = subscribe(listener);
    saveDrink(makeDrink({ id: "sub-save" }));
    expect(listener).toHaveBeenCalledTimes(1);
    unsub();
  });

  it("listener is called after a synthetic 'storage' event on window", () => {
    const listener = vi.fn();
    const unsub = subscribe(listener);
    window.dispatchEvent(new Event("storage"));
    expect(listener).toHaveBeenCalledTimes(1);
    unsub();
  });

  it("returned unsubscribe function detaches the listener", () => {
    const listener = vi.fn();
    const unsub = subscribe(listener);
    unsub();

    saveDrink(makeDrink({ id: "after-unsub" }));
    window.dispatchEvent(new Event("storage"));
    expect(listener).not.toHaveBeenCalled();
  });
});
