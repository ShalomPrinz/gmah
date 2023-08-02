import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Navbar } from "../components";
import { AppContextsProvider } from "../contexts";

import { AppErrorBoundary, PageErrorBoundary, Pages } from ".";

const Header = () => (
  <AppErrorBoundary>
    <AppContextsProvider>
      <Navbar />
      <PageErrorBoundary>
        <Outlet />
      </PageErrorBoundary>
    </AppContextsProvider>
  </AppErrorBoundary>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Header />}>
      <Route index element={<Pages.Home />} />
      <Route path="families">
        <Route index element={<Pages.Families />} />
        <Route path="edit">
          <Route path=":name" element={<Pages.EditFamily />} />
        </Route>
        <Route path="history" element={<Pages.FamiliesHistory />} />
        <Route path="add">
          <Route index element={<Pages.FamilyManager />} />
          <Route path="single" element={<Pages.AddFamily />} />
          <Route path="many" element={<Pages.AddManyFamilies />} />
        </Route>
      </Route>
      <Route path="managers">
        <Route index element={<Pages.Managers />} />
        <Route path="edit" element={<Pages.EditManagers />} />
      </Route>
      <Route path="reports">
        <Route index element={<Pages.Reports />} />
      </Route>
      <Route path="month">
        <Route index element={<Pages.MonthTracker />} />
        <Route path="mark-receive" element={<Pages.MonthReceiptMark />} />
      </Route>
      <Route path="print">
        <Route path="month" element={<Pages.MonthPrintView />} />
        <Route path="completion" element={<Pages.CompletionEditor />} />
      </Route>
    </Route>
  )
);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
