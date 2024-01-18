import { useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../App';

function Header() {
  const {isLoggedIn,setIsLoggedIn,setIsLibrarian,setIsAdmin}=useContext(LoginContext);
  const libId=localStorage.getItem('libraryName');
  const isAdmin=localStorage.getItem('isAdmin');
  const userId=localStorage.getItem('userId');
  console.log(libId);
  console.log(userId);
  const redirect=new useNavigate();
  const doLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('libraryName');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsLibrarian(false);
    setIsAdmin(false);
    redirect("/login")
  }
  useEffect(()=>{
    
  },[isLoggedIn])
  return (
    <Navbar bg="dark"  variant="dark" expand="lg">
      <Container>
        <Navbar.Brand style={{"fontFamily":"satisfy","color":"cornflowerblue"}} className="px-1" href="#">Granthalaya</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {(!libId && !isAdmin)?<>
            <Link className="nav-link"to="/">Home</Link>
            <Link className="nav-link"to="/libraries">Libraries</Link>
            <Link className="nav-link"to="/search/0">Search</Link>
            {/* <Link className="nav-link"to="/books">Books</Link> */}
            <Link className="nav-link"to="/borrowed-books">Borrowed Books</Link>
            </>
            :<>
            <Link className="nav-link"to="/admin">Home</Link>
            {(libId!="" && !isAdmin) ?<>
            <Link className="nav-link"to={`/librarian/search/${libId}`}>Search</Link>
            <Link className="nav-link" to={`/admin/books/${libId}`}>Books</Link>
            <Link className="nav-link" to={`/admin/add-book/${libId}`}>Add Book</Link>
            <Link className="nav-link" to={`/admin/borrowed-books/${libId}`}>Borrowed Books</Link>
              </>:<>
              <Link className="nav-link"to="/search/0">Search</Link>
        <Link className="nav-link"to="/admin/add-librarian">Add Librarian</Link>
        <Link className="nav-link"to="/admin/add-library">Add Library</Link>
              </>
          }</>
        }
        {/* {isAdmin? <>
        
        </>:<></>} */}

            {/* <Nav.Link href="/">Home</Nav.Link> */}
            {/* <Nav.Link href="#link">Link</Nav.Link> */}
          </Nav>

        </Navbar.Collapse>
        <Navbar.Collapse  id="basic-navbar-nav" className="justify-content-end">
          {(localStorage.getItem('userName'))?<>
          <Link to="#" className="nav-link text-light">Welcome {localStorage.getItem('userName')}</Link>
          &nbsp;&nbsp;
            <Link to="#" onClick={doLogout} className="nav-link text-light">Logout</Link>
            </>:<><Link to="/login" className="nav-link text-light">Login</Link>
          &nbsp;&nbsp;
            <Link to="/signup" className="nav-link text-light" >Sign up</Link></>}
              
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;