import { describe, expect, it, vi } from "vitest";
import { array, object, string } from "yup";

import { render, screen, setupUser } from "../../../../test";

import InputTable from "../InputTable";

const emptyOnSubmit = () => Promise.resolve();

describe("InputTable", () => {
  describe("snapshot", () => {
    it("should render empty input table", () => {
      const { asFragment } = render(
        <InputTable
          columns={[]}
          defaultItem={{}}
          formName="empty"
          initialValues={[]}
          onSubmit={emptyOnSubmit}
          schema={object()}
          text={{
            noTable: "",
            submit: "",
          }}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render input table with one column", () => {
      // Table headers should not be displayed when table has no rows (body)
      const { asFragment } = render(
        <InputTable
          columns={[
            {
              id: 0,
              path: "name",
            },
          ]}
          defaultItem={{}}
          formName="oneColumn"
          initialValues={[]}
          onSubmit={emptyOnSubmit}
          schema={object()}
          text={{
            noTable: "",
            submit: "",
          }}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render input table with one column and one row", () => {
      const { asFragment } = render(
        <InputTable
          columns={[
            {
              id: 0,
              path: "name",
            },
          ]}
          defaultItem={{}}
          formName="oneColOneRow"
          initialValues={[
            {
              name: "Shalom Prinz",
            },
          ]}
          onSubmit={emptyOnSubmit}
          schema={object()}
          text={{
            noTable: "",
            submit: "",
          }}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render input table with two columns and three rows", () => {
      const { asFragment } = render(
        <InputTable
          columns={[
            {
              id: 0,
              path: "name",
            },
            {
              id: 1,
              path: "value",
            },
          ]}
          defaultItem={{}}
          formName="twoColsThreeRows"
          initialValues={[
            {
              name: "Shalom Prinz",
              value: "8",
            },
            {
              name: "Nitay Prinz",
              value: "21",
            },
            {
              name: "Someone",
              value: "17",
            },
          ]}
          onSubmit={emptyOnSubmit}
          schema={object()}
          text={{
            noTable: "",
            submit: "",
          }}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render input table with custom text when no table has no values", () => {
      const { asFragment } = render(
        <InputTable
          columns={[
            {
              id: 0,
              path: "name",
            },
          ]}
          defaultItem={{}}
          formName="customText"
          initialValues={[]}
          onSubmit={emptyOnSubmit}
          schema={object()}
          text={{
            noTable: "This text should show up when table has no values",
            submit: "should not show up",
          }}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render input table with custom submit text", () => {
      const { asFragment } = render(
        <InputTable
          columns={[
            {
              id: 0,
              path: "name",
            },
          ]}
          defaultItem={{}}
          formName="submitText"
          initialValues={[
            {
              name: "Anybody",
            },
          ]}
          onSubmit={emptyOnSubmit}
          schema={object()}
          text={{
            noTable: "should not show up",
            submit: "Submit Form",
          }}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("behavior", () => {
    it("should submit initial values", async () => {
      const user = setupUser();
      const submitText = "Submit Here";
      const onSubmit = vi.fn((values: object[]) => Promise.resolve());
      const initialValues = [{ id: "0", value: "Some data" }];
      render(
        <InputTable
          columns={[
            {
              id: 0,
              path: "value",
            },
          ]}
          defaultItem={{}}
          formName="testSubmit"
          initialValues={initialValues}
          onSubmit={onSubmit}
          schema={object()}
          text={{
            noTable: "",
            submit: submitText,
          }}
        />
      );

      const submitButton = screen.getByRole("button", { name: submitText });
      await user.click(submitButton);

      expect(onSubmit).toBeCalledWith(initialValues);
    });

    it("should submit types values over initial values", async () => {
      const user = setupUser();
      const submitText = "Submit Here";
      const onSubmit = vi.fn((values: object[]) => Promise.resolve());

      const valueId = "id";
      const initialValues = [{ id: valueId, value: "Some data" }];
      const typedValues = [{ id: valueId, value: "Shalom Prinz" }];

      render(
        <InputTable
          columns={[
            {
              id: 0,
              path: "value",
            },
          ]}
          defaultItem={{}}
          formName="testSubmit"
          initialValues={initialValues}
          onSubmit={onSubmit}
          schema={object()}
          text={{
            noTable: "",
            submit: submitText,
          }}
        />
      );

      const inputElement = screen.getByRole("textbox");
      await user.clear(inputElement);
      await user.type(inputElement, typedValues[0].value);

      const submitButton = screen.getByRole("button", { name: submitText });
      await user.click(submitButton);

      expect(onSubmit).toBeCalledWith(typedValues);
    });

    it("should not reset form values after successful submission", async () => {
      const user = setupUser();
      const submitText = "Submit Here";
      const initialValues = [{ id: "0", value: "Some data" }];
      render(
        <InputTable
          columns={[
            {
              id: 0,
              path: "value",
            },
          ]}
          defaultItem={{}}
          formName="testNoReset"
          initialValues={initialValues}
          onSubmit={emptyOnSubmit}
          schema={object()}
          text={{
            noTable: "",
            submit: submitText,
          }}
        />
      );

      const getInputValue = () =>
        screen.getByRole<HTMLInputElement>("textbox").value;

      expect(getInputValue()).toBe(initialValues[0].value);

      const submitButton = screen.getByRole("button", { name: submitText });
      await user.click(submitButton);

      expect(getInputValue()).toBe(initialValues[0].value);
    });

    it("should not submit if schema validation failed", async () => {
      const user = setupUser();
      const submitText = "Submit Here";
      const onSubmit = vi.fn((values: object[]) => Promise.resolve());

      const itemId = "0";
      const expectedString = "RightOne";
      const formName = "testSchemaFail";

      render(
        <InputTable
          columns={[
            {
              id: 0,
              path: "name",
            },
          ]}
          defaultItem={{}}
          formName={formName}
          initialValues={[{ id: itemId, name: "" }]}
          onSubmit={onSubmit}
          schema={object({
            [formName]: array().of(
              object({
                name: string().matches(new RegExp(`^${expectedString}$`)),
              })
            ),
          })}
          text={{
            noTable: "",
            submit: submitText,
          }}
        />
      );

      const inputElement = screen.getByRole("textbox");
      await user.type(inputElement, "incorrect");

      const submitButton = screen.getByRole("button", { name: submitText });
      await user.click(submitButton);

      expect(onSubmit).not.toBeCalled();

      await user.clear(inputElement);
      await user.type(inputElement, expectedString);
      await user.click(submitButton);

      expect(onSubmit).toBeCalledWith([{ id: itemId, name: expectedString }]);
    });

    it("should display error in the DOM if schema validation failed", async () => {
      const user = setupUser();
      const submitText = "Submit Here";
      const onSubmit = vi.fn((values: object[]) => Promise.resolve());

      const itemId = "0";
      const expectedString = "RightOne";
      const formName = "testSchemaFail";

      const { asFragment } = render(
        <InputTable
          columns={[
            {
              id: 0,
              path: "name",
            },
          ]}
          defaultItem={{}}
          formName={formName}
          initialValues={[{ id: itemId, name: "" }]}
          onSubmit={onSubmit}
          schema={object({
            [formName]: array().of(
              object({
                name: string().matches(new RegExp(`^${expectedString}$`)),
              })
            ),
          })}
          text={{
            noTable: "",
            submit: submitText,
          }}
        />
      );

      const inputElement = screen.getByRole("textbox");
      await user.type(inputElement, "incorrect");
      await user.tab(); // Unfocus element should cause validation

      const schemaFailSnapshot = asFragment();

      await user.clear(inputElement);
      await user.type(inputElement, expectedString);
      await user.tab(); // Unfocus element should cause validation

      expect(asFragment()).not.toEqual(schemaFailSnapshot);
    });

    it("should add row to the table", async () => {
      const user = setupUser();
      render(
        <InputTable
          columns={[
            {
              id: 0,
              path: "value",
            },
          ]}
          defaultItem={{
            value: "",
          }}
          formName="testAddRow"
          initialValues={[]}
          onSubmit={emptyOnSubmit}
          schema={object()}
          text={{
            noTable: "",
            submit: "",
          }}
        />
      );

      const getAllInputs = () => screen.queryAllByRole("textbox");

      expect(getAllInputs()).toHaveLength(0);

      const addRowButton = screen.getByRole("button", {
        name: "הוסף שורה בטבלה",
      });
      await user.click(addRowButton);

      expect(getAllInputs()).toHaveLength(1);
    });

    it("should add row to the table with initial data", async () => {
      const user = setupUser();
      render(
        <InputTable
          columns={[
            {
              id: 0,
              path: "value",
            },
          ]}
          defaultItem={{
            value: "",
          }}
          formName="testAppendRow"
          initialValues={[
            {
              id: "0",
              value: "First Row",
            },
          ]}
          onSubmit={emptyOnSubmit}
          schema={object()}
          text={{
            noTable: "",
            submit: "",
          }}
        />
      );

      const getAllInputs = () => screen.queryAllByRole("textbox");

      expect(getAllInputs()).toHaveLength(1);

      const addRowButton = screen.getByRole("button", {
        name: "הוסף שורה בטבלה",
      });
      await user.click(addRowButton);

      expect(getAllInputs()).toHaveLength(2);
    });
  });
});
