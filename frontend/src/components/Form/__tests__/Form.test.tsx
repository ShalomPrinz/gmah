import { describe, expect, it, vi } from "vitest";
import { number, object, string } from "yup";

import { render, screen, setupUser } from "../../../../test";

import Form from "../Form";

const emptyOnSubmit = () => Promise.resolve();

describe("Form", () => {
  describe("snapshot", () => {
    it("should render empty form", () => {
      const { asFragment } = render(
        <Form
          onSubmit={emptyOnSubmit}
          schema={object()}
          textInputs={[]}
          title=""
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render form with one text input", () => {
      const { asFragment } = render(
        <Form
          onSubmit={emptyOnSubmit}
          schema={object({
            name: string(),
          })}
          textInputs={[
            {
              label: "Name",
              path: "name",
            },
          ]}
          title="Basic Form"
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render form with three text inputs", () => {
      const { asFragment } = render(
        <Form
          onSubmit={emptyOnSubmit}
          schema={object({
            name: string(),
            value: number(),
            content: string(),
          })}
          textInputs={[
            {
              label: "Name",
              path: "name",
            },
            {
              label: "Value",
              path: "value",
            },
            {
              label: "Content",
              path: "content",
            },
          ]}
          title="Three Inputs Form"
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should ignore double size input if inputsInRow not set to '6'", () => {
      const { asFragment } = render(
        <Form
          onSubmit={emptyOnSubmit}
          schema={object()}
          textInputs={[
            {
              label: "Name",
              path: "name",
              doubleSize: true,
            },
          ]}
          title=""
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render double size input if inputsInRow set to '6'", () => {
      const { asFragment } = render(
        <Form
          onSubmit={emptyOnSubmit}
          schema={object()}
          textInputs={[
            {
              label: "Name",
              path: "name",
              doubleSize: true,
            },
          ]}
          title=""
          inputsInRow="6"
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render form with unique submit text", () => {
      const { asFragment } = render(
        <Form
          onSubmit={emptyOnSubmit}
          schema={object({
            name: string(),
          })}
          textInputs={[
            {
              label: "Name",
              path: "name",
            },
          ]}
          title="Basic Form"
          submitText="Submit This Form"
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("behavior", () => {
    it("should submit initial data", async () => {
      const user = setupUser();
      const onSubmit = vi.fn((values: object) => Promise.resolve());
      const initialData = { id: 0, value: "Some data" };
      render(
        <Form
          onSubmit={onSubmit}
          schema={object()}
          textInputs={[]}
          title="Initial Data Form"
          initialData={initialData}
        />
      );

      const submitButton = screen.getByRole("button");
      await user.click(submitButton);

      expect(onSubmit).toBeCalledWith(initialData);
    });

    it("should submit typed data", async () => {
      const user = setupUser();
      const onSubmit = vi.fn((values: object) => Promise.resolve());
      render(
        <Form
          onSubmit={onSubmit}
          schema={object()}
          textInputs={[
            {
              label: "Full Name",
              path: "name",
            },
          ]}
          title="Initial Data Form"
        />
      );

      const dataToType = "Shalom Prinz";
      const inputElement = screen.getByRole("textbox");
      await user.type(inputElement, dataToType);

      const submitButton = screen.getByRole("button");
      await user.click(submitButton);

      expect(onSubmit).toBeCalledWith({ name: dataToType });
    });

    it("should submit typed data over initial data", async () => {
      const user = setupUser();
      const onSubmit = vi.fn((values: object) => Promise.resolve());
      render(
        <Form
          onSubmit={onSubmit}
          schema={object()}
          textInputs={[
            {
              label: "Full Name",
              path: "name",
            },
          ]}
          title="Initial Data Form"
          initialData={{ name: "some placeholder" }}
        />
      );

      const dataToType = "Real Name";
      const inputElement = screen.getByRole("textbox");
      await user.clear(inputElement);
      await user.type(inputElement, dataToType);

      const submitButton = screen.getByRole("button");
      await user.click(submitButton);

      expect(onSubmit).toBeCalledWith({ name: dataToType });
    });

    it("should not submit if schema validation failed", async () => {
      const user = setupUser();
      const onSubmit = vi.fn((values: object) => Promise.resolve());
      const expectedString = "Shalom Prinz";
      render(
        <Form
          onSubmit={onSubmit}
          schema={object({
            name: string().matches(new RegExp(`^${expectedString}$`)),
          })}
          textInputs={[
            {
              label: "Full Name",
              path: "name",
            },
          ]}
          title=""
        />
      );

      const schemaFailureText = "Some Text";
      const inputElement = screen.getByRole("textbox");
      await user.type(inputElement, schemaFailureText);

      const submitButton = screen.getByRole("button");
      await user.click(submitButton);

      expect(onSubmit).not.toBeCalled();

      await user.clear(inputElement);
      await user.type(inputElement, expectedString);
      await user.click(submitButton);

      expect(onSubmit).toBeCalledWith({ name: expectedString });
    });

    it("should display error in the DOM if schema validation failed", async () => {
      const user = setupUser();
      const onSubmit = vi.fn((values: object) => Promise.resolve());
      const { asFragment } = render(
        <Form
          onSubmit={onSubmit}
          schema={object({
            name: string().matches(/"password"/),
          })}
          textInputs={[
            {
              label: "Full Name",
              path: "name",
            },
          ]}
          title=""
        />
      );

      const inputElement = screen.getByRole("textbox");
      await user.type(inputElement, "wrong");
      await user.tab(); // Unfocus element should cause validation

      expect(asFragment()).toMatchSnapshot();

      await user.clear(inputElement);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
