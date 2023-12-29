import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Row, Col } from 'react-bootstrap';
import Paper from '@mui/material/Paper';
import Feedback from "../Utils/feedbacks";

export default function AddLibrarian() {
  const userNameRef = useRef(null);
  const passwordRef = useRef(null);
  const librarianRef = useRef(null);
  const libraryRef = useRef(null);
  const phoneRef=useRef(null);
  const emailRef = useRef(null);
  const [isAdded,setIsAdded]=useState(false);

  const [loading, setLoading] = useState(true);
  const [libraries, setLibraries] = useState([
    {
      "id": 1,
      "name": "libraary1",
      "addresss": "nadiad",
      "availableBooks": [
        {
          "id": 0,
          "title": "DSA",
          "publishDate": "2023-02-15T06:21:47.969",
          "author": "xyz",
          "price": 120,
          "quantity": 5
        },
        {
          "id": 0,
          "title": "DSA",
          "publishDate": "2023-02-15T06:21:47.969",
          "author": "xyz",
          "price": 120,
          "quantity": 5
        }
      ]
    }
  ]);
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
  },[isAdded])
  const handleSubmit = (e) => {
    e.preventDefault();
    const libId=libraryRef.current.value;
    console.log(libId);
      
       axios.post('https://localhost:7271/api/Librarians',{
        'name':userNameRef.current.value,
        'email':emailRef.current.value,
        'phoneNumber':phoneRef.current.value,
        'password':passwordRef.current.value,
        'libraryId':libraryRef.current.value
      },{
        headers: {
          'Content-Type': 'application/json'
        }}).then(response=>{
          setIsAdded(true);
            console.log(response.data);
        }).catch(e=>{
            console.log(e);
        })
      
    // }
}
  return (
    <>
        {isAdded && <Feedback mes="Librarian added!!" open={true} type="success" />}

    <div className='login-page'>
      <Paper elevation={5} className="container w-50 my-3 py-3">
        <h2 className="text-center">Add New Librarian: </h2>
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
              <Form.Select name="library"ref={libraryRef} id="addLibrary" className="my-3" aria-label="Default select example">
                <option value="-1">Add library</option>
                {libraries.map(library => (

                  <option value={library.id}>{library.name}</option>
                ))}
              </Form.Select>
              <Button className="my-3 w-100"  variant="dark" type="submit" block>
                Add Libraarian
              </Button>
            </Form>
          </Col>
        </Row>
      </Paper>

    </div>
    </>
  )
}