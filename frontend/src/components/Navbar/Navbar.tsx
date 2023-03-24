import { useState } from "react";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
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

interface NavbarProps {
  pages: Page[];
}

function AppNavbar({ pages }: NavbarProps) {
  const [expanded, setExpanded] = useState(false);

  const icon = expanded ? "navbarExpanded" : "navbarClosed";
  const setNotExpanded = () => expanded && setExpanded(!expanded);

  return (
    <Navbar
      className="navbar bg-default"
      expand="lg"
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
      <Navbar.Toggle
        aria-controls="responsive-navbar-nav"
        onClick={() => setExpanded(!expanded)}
      >
        <IconComponent icon={icon} />
      </Navbar.Toggle>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav onClick={setNotExpanded}>
          <ConditionalList itemCallback={pageCallback} list={pages} />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
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
  ];

  return <AppNavbar pages={pages} />;
}

export default NavbarWrapper;
