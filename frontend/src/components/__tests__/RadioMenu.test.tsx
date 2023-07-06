import { describe, expect, it, vi } from "vitest";

import { render, screen, setupUser } from "../../../test";

import RadioMenu from "../RadioMenu";

describe("RadioMenu", () => {
  describe("snapshot", () => {
    it("should render empty radio menu", () => {
      const { asFragment } = render(
        <RadioMenu buttons={[]} menuId="" onSelect={() => {}} />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render one radio button", () => {
      const { asFragment } = render(
        <RadioMenu
          buttons={[{ id: "1", text: "button text", value: "hello world" }]}
          menuId="menu id"
          onSelect={() => {}}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render three radio buttons", () => {
      const { asFragment } = render(
        <RadioMenu
          buttons={[
            { id: "1", text: "button text", value: "hello world" },
            { id: "2", text: "other text", value: "select me" },
            { id: "3", text: "another", value: "option 3" },
          ]}
          menuId="menu id"
          onSelect={() => {}}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("behavior", () => {
    it("should select second option and get its value", async () => {
      const user = setupUser();
      const secondButtonValue = "to be selected";
      const onSelect = vi.fn((value: string) => {});
      render(
        <RadioMenu
          buttons={[
            { id: "1", text: "button text", value: "hello world" },
            { id: "2", text: "other text", value: secondButtonValue },
          ]}
          menuId="menu id"
          onSelect={onSelect}
        />
      );

      const element = screen.getAllByRole("radio")[1];
      await user.click(element);

      expect(onSelect).toBeCalledWith(secondButtonValue);
    });

    it("should select second option and then third option", async () => {
      const user = setupUser();
      const thirdButtonValue = "to be selected";
      const onSelect = vi.fn((value: string) => {});
      render(
        <RadioMenu
          buttons={[
            { id: "1", text: "button text", value: "hello world" },
            { id: "2", text: "nothing here", value: "irrelevant" },
            { id: "3", text: "other text", value: thirdButtonValue },
          ]}
          menuId="menu id"
          onSelect={onSelect}
        />
      );

      const buttons = screen.getAllByRole("radio");
      await user.click(buttons[1]);
      await user.click(buttons[2]);

      expect(onSelect).toBeCalledWith(thirdButtonValue);
    });
  });
});
