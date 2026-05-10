import { describe, it, expect } from "vitest";

describe("test toolchain smoke", () => {
  it("runs arithmetic", () => {
    expect(1 + 1).toBe(2);
  });

  it("has happy-dom window", () => {
    expect(typeof window).toBe("object");
    expect(typeof window.localStorage).toBe("object");
  });

  it("resolves @ path alias", async () => {
    const types = await import("@/lib/types");
    expect(typeof types.STORAGE_KEY).toBe("string");
  });
});
