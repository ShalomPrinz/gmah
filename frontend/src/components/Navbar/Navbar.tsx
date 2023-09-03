import { useState } from "react";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";

import { useMediaQuery } from "react-responsive";
import { NavLink, useLocation } from "react-router-dom";

import { useHistoryContext, useReportContext } from "../../contexts";
import ConditionalList from "../ConditionalList";
import IconComponent from "../Icon";

import AppLogo from "../../res/logo.png";
import "./Navbar.css";

interface Page {
  id: number;
  name: string;
  url: string;
  usesReport?: boolean;
}

interface PageCollection {
  id: number;
  pages: Page[];
  title: string;
}

// Note: When changing those, also change in css file
/** Navbar expand size in bootstrap breakpoints */
const expandSizeBs = "lg";
/** Navbar expand size in pixels */
const expandSizePx = "992px";

interface NavbarProps {
  pages: PageCollection[];
}

const appTitle = 'גמ"ח אבישי';

function AppNavbar({ pages }: NavbarProps) {
  const [expanded, setExpanded] = useState(false);
  const hasCollapseOption = useMediaQuery({ maxWidth: expandSizePx });

  const { pathname } = useLocation();
  const usingReport = isCurrentPageUsesReport(pages, pathname);

  const { SelectReportDropdown } = useReportContext();

  const { goBack } = useHistoryContext();

  const displayGoBack = !hasCollapseOption;
  const switchExpanded = () => setExpanded(!expanded);
  const setNotExpanded = () => expanded && switchExpanded();

  const navTitleStyle = expanded ? " fs-4 my-3 w-50" : "";

  const pageCallback = ({ name, url }: Page) => (
    <NavDropdown.Item as="div" className="nav-dropdown-item">
      <NavLink
        className="nav-dropdown-item p-1 fs-5"
        onClick={setNotExpanded}
        to={url}
      >
        {name}
      </NavLink>
    </NavDropdown.Item>
  );

  const collectionCallback = ({ pages, title }: PageCollection) => (
    <NavDropdown
      align="end"
      className={`nav-dropdown${navTitleStyle}`}
      title={title}
    >
      <ConditionalList itemCallback={pageCallback} list={pages} />
    </NavDropdown>
  );

  return (
    <Navbar
      className="navbar bg-default"
      expand={expandSizeBs}
      expanded={expanded}
      style={{ direction: "rtl" }}
    >
      <NavLink onClick={setNotExpanded} className="navbar-brand fs-1" to="/">
        <img height="90px" className="p-2 m-3" src={AppLogo} title={appTitle} />
        {appTitle}
      </NavLink>
      {hasCollapseOption && !expanded && (
        <NavbarButton
          Icon={<IconComponent icon="navbarClosed" />}
          onClick={switchExpanded}
          title="הראה תפריט"
        />
      )}
      <Navbar.Collapse>
        <Nav>
          <Navbar.Offcanvas placement="end">
            {expanded && (
              <Offcanvas.Header className="d-flex mx-4">
                <Offcanvas.Title className="fs-2">{appTitle}</Offcanvas.Title>
                <button
                  className="fs-1 btn btn-transparent"
                  onClick={switchExpanded}
                  title="סגור תפריט"
                  type="button"
                >
                  <IconComponent icon="navbarExpanded" />
                </button>
              </Offcanvas.Header>
            )}
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <ConditionalList
                  itemCallback={collectionCallback}
                  list={pages}
                />
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Nav>
      </Navbar.Collapse>
      {displayGoBack && (
        <>
          {usingReport && <SelectReportDropdown />}
          <NavbarButton
            Icon={<IconComponent flipHorizontal icon="forwardItem" />}
            onClick={goBack}
            title="חזור אחורה"
          />
        </>
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
        {
          id: 3,
          name: "נהגים",
          url: "/drivers",
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
          usesReport: true,
        },
        {
          id: 3,
          name: "הגדרות",
          url: "/month/settings",
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
          usesReport: true,
        },
        {
          id: 1,
          name: "דף השלמות",
          url: "/print/completion",
          usesReport: true,
        },
      ],
      title: "הדפסות",
    },
    {
      id: 3,
      pages: [
        {
          id: 0,
          name: "נתמכי חגים",
          url: "/holidays",
        },
      ],
      title: "חגים",
    },
  ];

  return <AppNavbar pages={pages} />;
}

function isCurrentPageUsesReport(
  collection: PageCollection[],
  currentUrl: string
) {
  return collection.some(({ pages }) =>
    pages.some((page) => page.url === currentUrl && page.usesReport)
  );
}

export default NavbarWrapper;
