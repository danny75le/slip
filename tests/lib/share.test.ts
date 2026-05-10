import { describe, it, expect } from "vitest";
import {
  encodeDrinkToHash,
  decodeDrinkFromHash,
  buildShareUrl,
} from "@/lib/share";
import type { Drink } from "@/lib/types";

function makeDrink(overrides: Partial<Drink> = {}): Drink {
  return {
    id: "drink-1",
    name: "Iced Latte",
    rows: [
      { id: "r1", label: "Size", value: "Grande" },
      { id: "r2", label: "Milk", value: "Oat" },
    ],
    notes: "extra hot",
    createdAt: 1_700_000_000_000,
    updatedAt: 1_700_000_001_000,
    ...overrides,
  };
}

describe("share", () => {
  describe("encodeDrinkToHash", () => {
    it("produces a base64url string with no '+', '/', or '=' characters", () => {
      // Use content likely to introduce padding and non-url-safe base64 chars.
      const drink = makeDrink({
        name: "??????",
        notes: "?".repeat(20),
      });
      const encoded = encodeDrinkToHash(drink);
      expect(encoded).not.toMatch(/[+/=]/);
      expect(encoded.length).toBeGreaterThan(0);
    });
  });

  describe("encode/decode round-trip", () => {
    it("preserves a non-trivial drink with id, name, rows, notes, timestamps", () => {
      const drink = makeDrink();
      const decoded = decodeDrinkFromHash(`#data=${encodeDrinkToHash(drink)}`);
      expect(decoded).toEqual(drink);
    });

    it("preserves Unicode content (emoji, accented characters) in name and notes", () => {
      const drink = makeDrink({
        name: "Café Crème ?",
        notes: "?? extra ?? love — naïve façade",
        rows: [{ id: "r1", label: "Süße", value: "?" }],
      });
      const decoded = decodeDrinkFromHash(`#data=${encodeDrinkToHash(drink)}`);
      expect(decoded).toEqual(drink);
      expect(decoded?.name).toBe(drink.name);
      expect(decoded?.notes).toBe(drink.notes);
    });

    it("preserves an empty rows array and empty notes", () => {
      const drink = makeDrink({ rows: [], notes: "" });
      const decoded = decodeDrinkFromHash(`#data=${encodeDrinkToHash(drink)}`);
      expect(decoded).toEqual(drink);
      expect(decoded?.rows).toEqual([]);
      expect(decoded?.notes).toBe("");
    });
  });

  describe("decodeDrinkFromHash null cases", () => {
    it("returns null for empty string", () => {
      expect(decodeDrinkFromHash("")).toBeNull();
    });

    it("returns null for just '#'", () => {
      expect(decodeDrinkFromHash("#")).toBeNull();
    });

    it("returns null when the 'data' param is missing", () => {
      expect(decodeDrinkFromHash("#nope=foo")).toBeNull();
    });

    it("returns null for malformed base64 input", () => {
      expect(decodeDrinkFromHash("#data=!!!not-base64!!!")).toBeNull();
    });

    it("returns null when decoded JSON has no 'id'", () => {
      const noId = { name: "x", rows: [], createdAt: 0, updatedAt: 0 };
      const encoded = encodeDrinkToHash(noId as unknown as Drink);
      expect(decodeDrinkFromHash(`#data=${encoded}`)).toBeNull();
    });

    it("returns null when decoded JSON has 'rows' that is not an array", () => {
      const badRows = {
        id: "x",
        name: "x",
        rows: "not-an-array",
        createdAt: 0,
        updatedAt: 0,
      };
      const encoded = encodeDrinkToHash(badRows as unknown as Drink);
      expect(decodeDrinkFromHash(`#data=${encoded}`)).toBeNull();
    });
  });

  describe("decodeDrinkFromHash hash prefix handling", () => {
    it("accepts both '#data=…' and 'data=…' (leading '#' is optional)", () => {
      const drink = makeDrink();
      const encoded = encodeDrinkToHash(drink);
      const withHash = decodeDrinkFromHash(`#data=${encoded}`);
      const withoutHash = decodeDrinkFromHash(`data=${encoded}`);
      expect(withHash).toEqual(drink);
      expect(withoutHash).toEqual(drink);
    });
  });

  describe("buildShareUrl", () => {
    it("produces exactly `${origin}/shared#data=<encoded>`", () => {
      const drink = makeDrink();
      const encoded = encodeDrinkToHash(drink);
      const url = buildShareUrl("https://example.com", drink);
      expect(url).toBe(`https://example.com/shared#data=${encoded}`);
    });
  });
});
