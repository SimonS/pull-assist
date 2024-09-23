import { describe, it, expect } from "vitest";
import { isPRPage } from "./utils";

describe("utils", () => {
  describe("isPRPage", () => {
    function setFakeWindowLocation(pathname: string) {
      Object.defineProperty(window, "location", {
        value: { pathname },
        writable: true,
      });
    }
    it("returns true for PR pages", () => {
      setFakeWindowLocation("/user/repo/pull/123");
      expect(isPRPage()).toBe(true);
    });

    it("returns false for non-PR pages", () => {
      setFakeWindowLocation("/user/repo");
      expect(isPRPage()).toBe(false);
    });
  });
});
