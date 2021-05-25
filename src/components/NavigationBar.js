import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import styled from 'styled-components';

const NavbarStyled = styled(Navbar)`
  background-color: var(--nav-back-color-style) !important;

  && .navbar-collapse {
    justify-content: flex-end;
  }

  && .navbar-nav .nav-link {
    color: var(--white);
    padding-right: 1.5rem;
    padding-left: 1.5rem;
    border-radius: 0.3125rem;
  }


  && .navbar-nav .nav-link:focus, 
  && .navbar-nav .nav-link:hover {
    background-color: #195d9c;
  }
`;

const NavbarContainer = styled.div`
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  text-align: right;
`;

const NavDropdownStyled = styled(NavDropdown)`
  @media (min-width: 992px){
    && .dropdown-menu {
      margin: .125rem 0 0 !important;
      right: 0;
      left: auto;
      background-color: var(--nav-back-color-submenu);
      padding: 0.8rem 0;
    }

    && .dropdown-toggle::after {
      content: none;
    }

    && .dropdown-menu::before {
      content: '';
      color: var(--nav-back-color-submenu);
      border-top: 0;
      border-right: 0.5rem solid transparent;
      border-bottom: 0.5rem solid;
      border-left: 0.5rem solid transparent;
      position: absolute;
      top: -0.5rem;
      right: 3rem;
    }
  }
`;

const NavDropdownItem = styled(NavDropdown.Item)`
  color: #fff;
  border-bottom: 0.1rem solid transparent;
  margin: 0.25rem 1.5rem;
  padding: 0;
  width: fit-content;
  display: block;
  
  &&:hover,
  &&:focus {
    color: #fff;
    text-decoration: none;
    background-color: transparent;
    border-bottom: 0.1rem solid #09a58a;
  }
`;

const NavigationBar = () => (
  <NavbarStyled bg="dark" expand="lg" role="navigation">
    <NavbarContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <Nav.Link as={Link} to="/" >Home</Nav.Link>
          <Nav.Link as={Link} to="/search">Search</Nav.Link>
          <NavDropdownStyled title="Data Model">
            <NavDropdownItem as={Link} to={{
              pathname: '/datamodel',
              state: {
                fromDataModel: 'gdc'
              }
            }}>GDC</NavDropdownItem>
            <NavDropdownItem as={Link} to={{
              pathname: '/datamodel',
              state: {
                fromDataModel: 'ctdc'
              }
            }}>CTDC</NavDropdownItem>
            <NavDropdownItem as={Link} to={{
              pathname: '/datamodel',
              state: {
                fromDataModel: 'icdc'
              }
            }}>ICDC</NavDropdownItem>
            <NavDropdownItem as={Link} to={{
              pathname: '/datamodel',
              state: {
                fromDataModel: 'pcdc'
              }
            }}>PCDC</NavDropdownItem>
          </NavDropdownStyled>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </NavbarContainer>
  </NavbarStyled>
)

export default NavigationBar;
