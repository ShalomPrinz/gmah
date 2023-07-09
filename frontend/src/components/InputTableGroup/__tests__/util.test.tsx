import { allowUtilInTestFolder, render } from "../../../../test";

import { FormGroupForwardProvider } from "../FormForwardContext";

allowUtilInTestFolder();

const renderWithProvider = (Component: () => JSX.Element) =>
  render(
    <FormGroupForwardProvider>
      <Component />
    </FormGroupForwardProvider>
  );

const renderMany = (...many: (() => JSX.Element)[]) =>
  render(
    <FormGroupForwardProvider>
      {many.map((Component) => (
        <Component />
      ))}
    </FormGroupForwardProvider>
  );

export { renderMany, renderWithProvider };
