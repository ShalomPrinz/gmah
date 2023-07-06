import { afterEach } from "vitest";

import { cleanup, render, screen } from "@testing-library/react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { HistoryProvider } from "../src/contexts";

afterEach(cleanup);

function renderWithRouter(Component: JSX.Element) {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={<HistoryProvider>{Component}</HistoryProvider>}
      />
    )
  );
  return render(<RouterProvider router={router} />);
}

export { render, renderWithRouter, screen };
