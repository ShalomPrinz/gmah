import { describe, expect, it } from "vitest";

/** Simple hack to allow file without tests in tests folder */
export const allowUtilInTestFolder = () =>
  describe("allow util in tests folder", () => {
    it("should be a 100% passing test", () => {
      expect(true).toBeTruthy();
    });
  });
