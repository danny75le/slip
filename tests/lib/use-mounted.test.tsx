import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMounted } from "@/lib/use-mounted";

describe("useMounted", () => {
  it("returns true after the first render in a browser-like environment", () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(true);
  });

  it("returns the same value (true) across re-renders", () => {
    const { result, rerender } = renderHook(() => useMounted());
    expect(result.current).toBe(true);
    rerender();
    expect(result.current).toBe(true);
    rerender();
    expect(result.current).toBe(true);
  });

  it("returns a boolean type at runtime", () => {
    const { result } = renderHook(() => useMounted());
    expect(typeof result.current).toBe("boolean");
  });
});
