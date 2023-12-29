import React, { useRef, useEffect, useState, useContext } from "react";
import axios from "axios";
import { Button, Form, Row, Col } from 'react-bootstrap';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";
import { LoginContext,UserContext } from "../App";
import { Link } from "@mui/material";
export default function SignUp() {
  const userNameRef = useRef(null);
  const passwordRef = useRef(null);
  const librarianRef = useRef(null);
  const libraryRef = useRef(null);
  const phoneRef=useRef(null);
  const emailRef = useRef(null);
  const navigate=useNavigate();
  const [loading, setLoading] = useState(true);
  const {setIsLoggedIn,setIsLibrarian}=useContext(LoginContext);
  const {setUserId,setUserName}=useContext(UserContext);
  const [libraries, setLibraries] = useState([
    {
      "id": 1,
      "name": "libraary1",
      "addresss": "nadiad",
      "availableBooks": [
      ]
    }
  ]);

  const aaddLibraryField = () => {
    const addlibrary = document.getElementById('addLibrary');
    addlibrary.toggleAttribute('disabled');
    // addlibrary.classList.toggle('invisible');
  }
  const fetchLibraries = () => {
    try {
      axios.get('https://localhost:7271/api/Libraries').then((response) => {
        setLibraries(response.data);
        setLoading(false);
        console.log(libraries);
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }
  useEffect(()=>{
    fetchLibraries();
  },[])
  const styles = {
    paperContainer: {
        height: "100%",
        backgroundImage: `url(${"b2.jpg"})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // marginTop: 0, 
        // padding: 0,
    },
    bg:{
      backgroundColor: 'transparent'
    }
};
  const handleSubmit = (e) => {
    e.preventDefault();
    // const libId=libraryRef.current.value;
    // console.log(libId);
    if(!librarianRef.current.checked) {
      // axios.get('https://localhost:7271/api/Customers').then(response=>{
      //   console.log(response.data);
      // }).catch(e=>{
      //   console.log(e);
      // })
      axios.post('https://localhost:7271/api/Customers',{
        'name':userNameRef.current.value,
        'email':emailRef.current.value,
        'phoneNumber':phoneRef.current.value,
        'password':passwordRef.current.value,
        'borrowedBooks':[]
      },{
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json'
        }
      }).then(response=>{
        console.log(response.data);
        setIsLoggedIn(true);
        setIsLibrarian(false);
        setUserId(response.data.id);
        setUserName(response.data.name);
        localStorage.setItem('userName',response.data.name);
        localStorage.setItem('userId',response.data.id);  
        navigate('/');
      }).catch(e=>{
        console.log(e);
      })
      
    }else{
      axios.post('https://localhost:7271/api/Librarians',{
        "name":userNameRef.current.value,
        "email":emailRef.current.value,
        "password":passwordRef.current.value,
        "phoneNumber":phoneRef.current.value,
        "libraryId":libraryRef.current.value
      },{
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response=>{
        // console.log(response.data);
        setIsLoggedIn(true);
        setIsLibrarian(true);
        setUserId(response.data.Id);
        setUserName(response.data.name);
        localStorage.setItem('userName',response.data.name);        
        localStorage.setItem('userId',response.data.id);   
        localStorage.setItem('libraryId',response.data.libraryId);    
        navigate('/admin');

      }).catch(e=>{
        console.log(e);
      })
    }
  }
  return (
    <div  style={styles.paperContainer}>
      <Paper elevation={5} className="container w-50  py-3" style={styles.bg}>
        <h2 className="my-3 text-center">Register!!</h2>
        <Row className="justify-content-md-center mt-5">
          <Col md={6}>
            <Form onSubmit={handleSubmit} id="signUpForm" className='form-container'>
              <Form.Group controlId="formBasicuserName">
                <Form.Label>User Name</Form.Label>
                <Form.Control name="Name"type="text" placeholder="Enter User Name" ref={userNameRef} />
              </Form.Group>
              <Form.Group className="my-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control name="Email"type="email" placeholder="Enter Email" ref={emailRef} />
              </Form.Group>
              <Form.Group className="my-3" controlId="formBasicuserName">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control name="PhoneNumber"type="text" placeholder="Enter Phone Number" ref={phoneRef} />
              </Form.Group>
              <Form.Group className="my-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control name="Password"type="password" placeholder="Password" ref={passwordRef} />
              </Form.Group>
               <Form.Check
                type="checkbox"
                id={`isLibrarian`}
                label="Are you Librarian?"
                ref={librarianRef}
                onChange={aaddLibraryField}
              />
              <Form.Select name="library"ref={libraryRef} disabled id="addLibrary" className="my-3" aria-label="Default select example">
                <option value="-1">Add library</option>
                {libraries.map(library => (

                  <option value={library.id}>{library.name}</option>
                ))}
              </Form.Select> 
              <Button className="my-3" variant="primary" type="submit" block>
                Submit
              </Button>
            </Form>
            
            <h5>Already Registered??<Link href="/login" style={{"color":"black"}}>Login</Link></h5>

          </Col>
        </Row>
      </Paper>

    </div>
  )
}