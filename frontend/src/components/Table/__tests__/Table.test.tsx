import { describe, expect, it } from "vitest";

import { render } from "../../../../test";

import Table from "../Table";

describe("Table", () => {
  describe("snapshot", () => {
    it("should render empty table", () => {
      const { asFragment } = render(
        <Table columns={[]} data={[]} dataIdProp="" />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render table with one column", () => {
      const { asFragment } = render(
        <Table
          columns={[
            {
              id: 0,
              path: "name",
            },
          ]}
          data={[]}
          dataIdProp=""
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render table with three columns", () => {
      const { asFragment } = render(
        <Table
          columns={[
            { id: 0, path: "name" },
            { id: 1, path: "title", label: "TITLE" },
            { id: 2, path: "property" },
          ]}
          data={[]}
          dataIdProp=""
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render table with one column and one data row", () => {
      const { asFragment } = render(
        <Table
          columns={[{ id: 0, path: "name" }]}
          data={[
            {
              name: "Shalom",
            },
          ]}
          dataIdProp="name"
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render table with two labeled columns and one data row", () => {
      const { asFragment } = render(
        <Table
          columns={[
            { id: 0, label: "First Name", path: "name" },
            { id: 1, label: "Last Name", path: "family" },
          ]}
          data={[
            {
              id: "0",
              name: "Shalom",
              family: "Prinz",
            },
            {
              id: "1",
              name: "Yosi",
              family: "Cohen",
            },
          ]}
          dataIdProp="id"
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render table with two columns and three data rows", () => {
      const { asFragment } = render(
        <Table
          columns={[
            { id: 0, path: "title" },
            { id: 1, path: "description" },
          ]}
          data={[
            {
              id: "0",
              title: "Shalom",
              description: "this is my first name",
            },
            {
              id: "1",
              title: "Prinz",
              description: "this is my last name",
            },
          ]}
          dataIdProp="id"
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render table with one column, one data row, and one special column", () => {
      const { asFragment } = render(
        <Table
          columns={[{ id: 0, path: "value" }]}
          data={[
            {
              id: "0",
              value: "result",
            },
          ]}
          dataIdProp="id"
          LastColumn={({ item }) => <button>Click Me! {item.value}</button>}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render table with two columns and highlight the second", () => {
      const { asFragment } = render(
        <Table
          columns={[
            { id: 0, path: "value" },
            { id: 1, path: "content" },
          ]}
          data={[]}
          dataIdProp=""
          headerHighlight="content"
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
