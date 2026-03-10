import { describe, it, expect } from "vitest"

import { cn } from "./utils"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("handles falsy values", () => {
    expect(cn("base", false, "visible")).toBe("base visible")
  })

  it("resolves Tailwind conflicts (last wins)", () => {
    expect(cn("px-4", "px-8")).toBe("px-8")
  })

  it("handles undefined and null values", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar")
  })

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("")
  })

  it("resolves complex Tailwind conflicts", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("handles array syntax", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar")
  })
})
