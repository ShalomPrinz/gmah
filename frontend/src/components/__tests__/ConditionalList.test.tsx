import { describe, expect, it } from "vitest";

import { render } from "../../../test";

import ConditionalList from "../ConditionalList";

describe("ConditionalList", () => {
  describe("snapshot", () => {
    it("should render empty list", () => {
      const { asFragment } = render(
        <ConditionalList itemCallback={() => <></>} list={[]} />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render one item list", () => {
      const { asFragment } = render(
        <ConditionalList
          itemCallback={(item: string) => <div>{item}</div>}
          list={["item"]}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render three items list", () => {
      const { asFragment } = render(
        <ConditionalList
          itemCallback={(item: string) => <h2>{item}</h2>}
          list={["first", "second", "third"]}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should retain items props", () => {
      const { asFragment } = render(
        <ConditionalList
          itemCallback={(item: JSX.Element) => <>{item}</>}
          list={[
            <h1 className="first">first</h1>,
            <h1 className="second">second</h1>,
            <h1 className="third">third</h1>,
          ]}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
