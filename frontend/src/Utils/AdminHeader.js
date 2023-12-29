import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

function AdminHeader() {
  return (
    <Navbar bg="dark" variant='dark' expand="lg">
      <Container>
      <Navbar.Brand style={{"fontFamily":"satisfy","color":"cornflowerblue"}} className="px-1" href="/">Granthalaya</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link"to="/">Home</Link>
            <Link className="nav-link"to="/admin/libraries">Libraries</Link>
            <Link className="nav-link"to="/admin/add-library">Add Library</Link>
            <Link className="nav-link"to="/admin/add-librarian">Add Librarian</Link>
            {/* <Nav.Link href="/">Home</Nav.Link> */}
            {/* <Nav.Link href="#link">Link</Nav.Link> */}
           
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse  id="basic-navbar-nav" className="justify-content-end">
              <Link to="/login" className="nav-link text-light">Welcome admin</Link>
            &nbsp;&nbsp;
              <Link to="/signup" className="nav-link text-light">Logout</Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminHeader;