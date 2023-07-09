import { describe, expect, it } from "vitest";
import { object } from "yup";

import { render, screen, setupUser } from "../../../../test";

import InputTableGroup from "../InputTableGroup";
import SingleInputTable from "../SingleInputTable";
import type { RegisterSubmit } from "../types";

const emptyRegister = () => {};
const emptyTableCallback = () => <></>;

describe("InputTableGroup", () => {
  describe("snapshot", () => {
    it("should render empty input table group", () => {
      const { asFragment } = render(
        <InputTableGroup tableCallback={emptyTableCallback} tables={[]} />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render input table group with a single table", () => {
      const tableCallback = ({ name }: { name: string }) => (
        <SingleInputTable
          columns={[{ id: 0, label: "Name", path: "name" }]}
          defaultItem={{}}
          formName="testSingleTable"
          initialValues={[{ name }]}
          registerReset={emptyRegister}
          registerSubmit={emptyRegister}
          schema={object()}
        />
      );

      const { asFragment } = render(
        <InputTableGroup
          tables={[{ name: "Shalom Prinz" }]}
          tableCallback={tableCallback}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render input table group with two simple tables", () => {
      const tableCallback = ({ name }: { name: string }) => (
        <SingleInputTable
          columns={[{ id: 0, label: "Name", path: "name" }]}
          defaultItem={{}}
          formName="testSingleTable"
          initialValues={[{ name }]}
          registerReset={emptyRegister}
          registerSubmit={emptyRegister}
          schema={object()}
        />
      );

      const { asFragment } = render(
        <InputTableGroup
          tables={[{ name: "Shalom Prinz" }, { name: "Other Person" }]}
          tableCallback={tableCallback}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render input table group with one table, which has two columns and three rows", () => {
      type Item = { data: { name: string; points: string }[] };
      const tableCallback = ({ data }: Item) => (
        <SingleInputTable
          columns={[
            { id: 0, label: "Name", path: "name" },
            { id: 1, label: "Score", path: "points" },
          ]}
          defaultItem={{}}
          formName="testTwoColsThreeRows"
          initialValues={data}
          registerReset={emptyRegister}
          registerSubmit={emptyRegister}
          schema={object()}
        />
      );

      const { asFragment } = render(
        <InputTableGroup
          tables={[
            {
              data: [
                { name: "Shalom Prinz", points: "24K" },
                { name: "David", points: "12M" },
                { name: "Shlomo", points: "1B" },
              ],
            },
          ]}
          tableCallback={tableCallback}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render input table group with two tables, each has two columns and three rows", () => {
      type Item = { data: { name: string; points: string }[] };
      const tableCallback = ({ data }: Item) => (
        <SingleInputTable
          columns={[
            { id: 0, label: "Name", path: "name" },
            { id: 1, label: "Score", path: "points" },
          ]}
          defaultItem={{}}
          formName="testTwoColsThreeRows"
          initialValues={data}
          registerReset={emptyRegister}
          registerSubmit={emptyRegister}
          schema={object()}
        />
      );

      const { asFragment } = render(
        <InputTableGroup
          tables={[
            {
              data: [
                { name: "Shalom Prinz", points: "24K" },
                { name: "David", points: "12M" },
                { name: "Shlomo", points: "1B" },
              ],
            },
            {
              data: [
                { name: "People", points: "20b" },
                { name: "Location", points: "18kb" },
                { name: "Google", points: "9gb" },
              ],
            },
          ]}
          tableCallback={tableCallback}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
