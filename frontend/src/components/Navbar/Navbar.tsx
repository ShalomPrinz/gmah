import { useState } from "react";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

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

interface PageCollection {
  id: number;
  pages: Page[];
  title: string;
}

const pageCallback = ({ name, url }: Page) => (
  <NavDropdown.Item as="div" className="nav-dropdown-item">
    <NavLink className="nav-dropdown-item fs-5 w-100 p-1" to={url}>
      {name}
    </NavLink>
  </NavDropdown.Item>
);

const collectionCallback = ({ pages, title }: PageCollection) => (
  <NavDropdown align="end" className="nav-dropdown" title={title}>
    <ConditionalList itemCallback={pageCallback} list={pages} />
  </NavDropdown>
);

// Note: When changing those, also change in css file
/** Navbar expand size in bootstrap breakpoints */
const expandSizeBs = "lg";
/** Navbar expand size in pixels */
const expandSizePx = "992px";

interface NavbarProps {
  pages: PageCollection[];
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
          <ConditionalList itemCallback={collectionCallback} list={pages} />
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
      pages: [
        {
          id: 0,
          name: "נתמכים",
          url: "/families",
        },
        {
          id: 1,
          name: "הוספה",
          url: "/families/add",
        },
        {
          id: 2,
          name: "הסטוריה",
          url: "/families/history",
        },
      ],
      title: "נתמכים",
    },
    {
      id: 1,
      pages: [
        {
          id: 0,
          name: "אחראי נהגים",
          url: "/managers",
        },
        {
          id: 1,
          name: "דוחות קבלה",
          url: "/reports",
        },
        {
          id: 2,
          name: "מעקב חודשי",
          url: "/month",
        },
      ],
      title: "ניהול חודשי",
    },
    {
      id: 2,
      pages: [
        {
          id: 0,
          name: "חודשי",
          url: "/print/month",
        },
        {
          id: 1,
          name: "דף השלמות",
          url: "/print/completion",
        },
      ],
      title: "הדפסות",
    },
  ];

  return <AppNavbar pages={pages} />;
}

export default NavbarWrapper;
