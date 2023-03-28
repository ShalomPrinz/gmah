import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Navbar } from "../components";
import Home from "./Home";
import Families from "./Families";
import FamilyManager from "./FamilyManager";
import AddFamily from "./AddFamily";
import AddManyFamilies from "./AddManyFamilies";

const Header = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Header />}>
      <Route index element={<Home />} />
      <Route path="families" element={<Families />} />
      <Route path="manage">
        <Route index element={<FamilyManager />} />
        <Route path="add" element={<AddFamily />} />
        <Route path="add-many" element={<AddManyFamilies />} />
      </Route>
    </Route>
  )
);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
