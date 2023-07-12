import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Navbar } from "../components";
import Managers from "./Managers";
import Home from "./Home";
import EditFamily from "./EditFamily";
import EditManagers from "./EditManagers";
import Families from "./Families";
import FamilyManager from "./FamilyManager";
import AddFamily from "./AddFamily";
import AddManyFamilies from "./AddManyFamilies";
import Reports from "./Reports";
import MonthTracker from "./MonthTracker";

import { HistoryProvider } from "../contexts";

const Header = () => (
  <HistoryProvider>
    <Navbar />
    <Outlet />
  </HistoryProvider>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Header />}>
      <Route index element={<Home />} />
      <Route path="families">
        <Route index element={<Families />} />
        <Route path="edit">
          <Route path=":name" element={<EditFamily />} />
        </Route>
      </Route>
      <Route path="manage">
        <Route index element={<FamilyManager />} />
        <Route path="add" element={<AddFamily />} />
        <Route path="add-many" element={<AddManyFamilies />} />
      </Route>
      <Route path="managers">
        <Route index element={<Managers />} />
        <Route path="edit" element={<EditManagers />} />
      </Route>
      <Route path="reports">
        <Route index element={<Reports />} />
      </Route>
      <Route path="month">
        <Route index element={<MonthTracker />} />
      </Route>
    </Route>
  )
);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
