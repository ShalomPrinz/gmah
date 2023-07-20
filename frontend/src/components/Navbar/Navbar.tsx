import { useState } from "react";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useMediaQuery } from "react-responsive";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import { useHistoryContext } from "../../contexts";
import ConditionalList from "../ConditionalList";
import IconComponent from "../Icon";

import "./Navbar.css";

interface Page {
  id: number;
  name: string;
  url: string;
}

const pageCallback = ({ name, url }: Page) => (
  <NavLink className="nav-item nav-links fw-light" to={url}>
    {name}
  </NavLink>
);

// Note: When changing those, also change in css file
/** Navbar expand size in bootstrap breakpoints */
const expandSizeBs = "lg";
/** Navbar expand size in pixels */
const expandSizePx = "992px";

interface NavbarProps {
  pages: Page[];
}

function AppNavbar({ pages }: NavbarProps) {
  const [expanded, setExpanded] = useState(false);
  const hasCollapseOption = useMediaQuery({ maxWidth: expandSizePx });
  const { goBack } = useHistoryContext();
  const goBackFailureCallback = () =>
    toast.error("הגעת לדף הבית", { toastId: "endOfHistory" });

  const displayGoBack = !hasCollapseOption;
  const toggleNavbarIcon = expanded ? "navbarExpanded" : "navbarClosed";
  const switchExpanded = () => setExpanded(!expanded);
  const setNotExpanded = () => expanded && switchExpanded();

  return (
    <Navbar
      className="navbar bg-default"
      expand={expandSizeBs}
      expanded={expanded}
      style={{ direction: "rtl" }}
    >
      <NavLink onClick={setNotExpanded} className="navbar-brand fs-1" to="/">
        <img
          height="90px"
          className="p-2 m-3"
          src="/src/res/logo.png"
          title={'גמ"ח אבישי'}
        />
        {'גמ"ח אבישי'}
      </NavLink>
      {hasCollapseOption && (
        <NavbarButton
          Icon={<IconComponent icon={toggleNavbarIcon} />}
          onClick={switchExpanded}
          title="הראה תפריט"
        />
      )}
      <Navbar.Collapse>
        <Nav onClick={setNotExpanded}>
          <ConditionalList itemCallback={pageCallback} list={pages} />
        </Nav>
      </Navbar.Collapse>
      {displayGoBack && (
        <NavbarButton
          Icon={<IconComponent flipHorizontal icon="forwardItem" />}
          onClick={() => goBack(goBackFailureCallback)}
          title="חזור אחורה"
        />
      )}
    </Navbar>
  );
}

interface NavbarButtonProps {
  Icon: JSX.Element;
  onClick: () => void;
  title: string;
}

function NavbarButton({ Icon, onClick, title }: NavbarButtonProps) {
  return (
    <button
      className="fs-1 mx-5 btn btn-transparent"
      title={title}
      type="button"
      onClick={onClick}
    >
      {Icon}
    </button>
  );
}

function NavbarWrapper() {
  const pages = [
    {
      id: 0,
      name: "כל המידע",
      url: "/families",
    },
    {
      id: 1,
      name: "ניהול",
      url: "/manage",
    },
    {
      id: 2,
      name: "אחראי נהגים",
      url: "/managers",
    },
    {
      id: 3,
      name: "דוחות קבלה",
      url: "/reports",
    },
    {
      id: 4,
      name: "מעקב חודשי",
      url: "/month",
    },
    {
      id: 5,
      name: "הסטוריית נתמכים",
      url: "/families/history",
    },
  ];

  return <AppNavbar pages={pages} />;
}

export default NavbarWrapper;
