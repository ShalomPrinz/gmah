import { describe, expect, it } from "vitest";

import { render, screen, setupUser } from "../../../../test";

import { useFormForwardContext } from "../FormForwardContext";
import { renderMany, renderWithProvider } from "./util.test";

const exampleForwardValue = {
  item: { name: "Shalom" },
  origin: { formName: "test" },
  removeFromOrigin: () => {},
};

describe("FormForwardContext", () => {
  describe("errors", () => {
    it("should throw error when using context without a parent provider", () => {
      const Component = () => {
        useFormForwardContext();
        return <></>;
      };

      expect(() => render(<Component />)).toThrowError();
    });
  });

  describe("is forwarding", () => {
    it("should return false on default", () => {
      let isForwardingValue;

      renderWithProvider(() => {
        const { isForwarding } = useFormForwardContext();
        isForwardingValue = isForwarding();
        return <></>;
      });

      expect(isForwardingValue).toBe(false);
    });

    it("should return true when forward is set", () => {
      let isForwardingValue;

      renderWithProvider(() => {
        const { isForwarding, setForward } = useFormForwardContext();
        setForward(exampleForwardValue);
        isForwardingValue = isForwarding();
        return <></>;
      });

      expect(isForwardingValue).toBe(true);
    });

    it("should return false when forward ended", () => {
      let isForwardingValue;

      renderWithProvider(() => {
        const { endForward, isForwarding, setForward } =
          useFormForwardContext();
        setForward(exampleForwardValue);
        endForward();
        isForwardingValue = isForwarding();
        return <></>;
      });

      expect(isForwardingValue).toBe(false);
    });
  });

  describe("forward value", () => {
    it("should return undefined on default", () => {
      let forwardValue;

      renderWithProvider(() => {
        const { getForward } = useFormForwardContext();
        forwardValue = getForward();
        return <></>;
      });

      expect(forwardValue).toBe(undefined);
    });

    it("should return set value when forward is set", () => {
      let forwardValue;

      renderWithProvider(() => {
        const { getForward, setForward } = useFormForwardContext();
        setForward(exampleForwardValue);
        forwardValue = getForward();
        return <></>;
      });

      expect(forwardValue).toBe(exampleForwardValue);
    });

    it("should return undefined when forward ended", () => {
      let forwardValue;

      renderWithProvider(() => {
        const { endForward, getForward, setForward } = useFormForwardContext();
        setForward(exampleForwardValue);
        endForward();
        forwardValue = getForward();
        return <></>;
      });

      expect(forwardValue).toBe(undefined);
    });
  });

  describe("different consumers", () => {
    it("should get isForwarding = true when value set from other consumer", () => {
      let isForwardingValue;
      const SetterComponent = () => {
        const { setForward } = useFormForwardContext();
        setForward(exampleForwardValue);
        return <></>;
      };

      const OtherComponent = () => {
        const { isForwarding } = useFormForwardContext();
        isForwardingValue = isForwarding();
        return <></>;
      };

      renderMany(SetterComponent, OtherComponent);

      expect(isForwardingValue).toBe(true);
    });

    it("should get the value set from other consumer", () => {
      let forwardValue;
      const SetterComponent = () => {
        const { setForward } = useFormForwardContext();
        setForward(exampleForwardValue);
        return <></>;
      };

      const GetterComponent = () => {
        const { getForward } = useFormForwardContext();
        forwardValue = getForward();
        return <></>;
      };

      renderMany(SetterComponent, GetterComponent);

      expect(forwardValue).toBe(exampleForwardValue);
    });

    it("should distinguish between consumers - only setter should get true on isThisForwarding", () => {
      const setterName = "setter";
      const firstName = "first";
      const secondName = "second";

      let isSetterForwarding;
      let isFirstForwarding;
      let isSecondForwarding;

      const forwardValue = {
        item: { value: "data" },
        origin: { formName: setterName },
        removeFromOrigin: () => {},
      };

      const SetterComponent = () => {
        const { isThisForwarding, setForward } = useFormForwardContext();
        setForward(forwardValue);
        isSetterForwarding = isThisForwarding({ formName: setterName });
        return <></>;
      };

      const FirstComponent = () => {
        const { isThisForwarding } = useFormForwardContext();
        isFirstForwarding = isThisForwarding({ formName: firstName });
        return <></>;
      };

      const SecondComponent = () => {
        const { isThisForwarding } = useFormForwardContext();
        isSecondForwarding = isThisForwarding({ formName: secondName });
        return <></>;
      };

      renderMany(SetterComponent, FirstComponent, SecondComponent);

      expect(isSetterForwarding).toBe(true);
      expect(isFirstForwarding).toBe(false);
      expect(isSecondForwarding).toBe(false);
    });

    it("should distinguish between components with the same form name by row indices", async () => {
      const formName = "test";
      const forwardValueToSet = (rowIndex: number) => ({
        item: { value: "data" },
        origin: { formName, rowIndex },
        removeFromOrigin: () => {},
      });

      const first = {
        buttonText: "First",
        rowIndex: 0,
        isForwarding: () => {},
      };
      const second = {
        buttonText: "Second",
        rowIndex: 1,
        isForwarding: () => {},
      };

      const user = setupUser();
      const Component = () => {
        const { isThisForwarding, setForward } = useFormForwardContext();

        first.isForwarding = () =>
          isThisForwarding({ formName, rowIndex: first.rowIndex });
        second.isForwarding = () =>
          isThisForwarding({ formName, rowIndex: second.rowIndex });

        return (
          <>
            <button
              onClick={() => setForward(forwardValueToSet(first.rowIndex))}
            >
              {first.buttonText}
            </button>
            <button
              onClick={() => setForward(forwardValueToSet(second.rowIndex))}
            >
              {second.buttonText}
            </button>
          </>
        );
      };

      renderWithProvider(Component);

      const firstButton = screen.getByRole("button", {
        name: first.buttonText,
      });
      await user.click(firstButton);

      expect(first.isForwarding()).toBe(true);
      expect(second.isForwarding()).toBe(false);
    });
  });
});
