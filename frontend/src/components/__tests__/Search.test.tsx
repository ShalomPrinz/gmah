import { describe, expect, it, vi } from "vitest";

import { render, screen, setupUser } from "../../../test";

import Search from "../Search";

describe("Search", () => {
  describe("snapshot", () => {
    it("should render empty search box", () => {
      const { asFragment } = render(
        <Search onChange={() => {}} placeholder="" />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render search box with a placeholder", () => {
      const { asFragment } = render(
        <Search onChange={() => {}} placeholder="some text" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("behavior", () => {
    it("should get typed text when user types", async () => {
      const user = setupUser();
      const onChange = vi.fn((input: string) => {});
      render(<Search onChange={onChange} placeholder="" />);

      const element = screen.getByRole("searchbox");
      const text = "hello";
      await user.type(element, text);

      expect(onChange).toBeCalledWith(text);
      expect(onChange).toBeCalledTimes(text.length);
    });
  });
});
