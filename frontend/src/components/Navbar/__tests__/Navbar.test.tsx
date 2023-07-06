import { describe, expect, it } from "vitest";

import { renderWithRouter } from "../../../../test";

import Navbar from "../Navbar";

describe("Navbar", () => {
  describe("snapshot", () => {
    it("should render navbar", () => {
      const { asFragment } = renderWithRouter(<Navbar />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
