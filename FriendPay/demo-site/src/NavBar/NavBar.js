import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { GrCart } from 'react-icons/gr';
import './NavBar.css';

function NavBar() {
  return (
    <Navbar className="container" variant="light" fixed="top">
      <Link className="navbar-brand" to="/">FriendPay</Link>
        <Nav className="ml-auto">
          <Nav.Link href="#">About</Nav.Link>
          <Nav.Link href="#">Shop</Nav.Link>
          <Button variant="outline-light" style={{border:"none"}}>
            <h4><GrCart /></h4>
          </Button>
        </Nav>
    </Navbar>
  );
}

export default NavBar;