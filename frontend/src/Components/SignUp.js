import React, { useRef, useEffect, useState, useContext } from "react";
import axios from "axios";
import { Button, Form, Row, Col } from 'react-bootstrap';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";
import { LoginContext,UserContext } from "../App";
import { Link } from "@mui/material";
import Feedback from "../Utils/feedbacks";
export default function SignUp() {
  const userNameRef = useRef(null);
  const passwordRef = useRef(null);
  const librarianRef = useRef(null);
  const otpRef = useRef(null);
  const libraryRef = useRef(null);
  const phoneRef=useRef(null);
  const emailRef = useRef(null);
  const navigate=useNavigate();
  const [otp,setOtp]=useState(null);
  const [loading, setLoading] = useState(true);
  const [exist, setExist] = useState(false);
  const {setIsLoggedIn,setIsLibrarian}=useContext(LoginContext);
  const {setUserId,setUserName}=useContext(UserContext);
  const subject="OTP from Granthaaya!!"
  // var body="Hello "+ userNameRef.current.value+'</br> OTP: 1234';
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
  },[exist])
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
const handleSendOtp=()=>{
  //send mail contanig otp
  try{
    axios.post('https://localhost:7271/api/Customers/SendOTP',{
      'email':emailRef.current.value,
      'name':userNameRef.current.value,
      'password':''
    },{
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
      }
    }).then(response=>{
      // console.log(response)
      setOtp(response.data);
    })
  
  document.getElementById('formSendOtp').hidden=true;
  document.getElementById('formCheckOtp').hidden=false;
  document.getElementById('formOtp').hidden=false;
  }
  catch(e){

  }
}
const handleCheckOtp=()=>{
  console.log(otpRef.current.value);
  if(otpRef.current.value==otp){
    document.getElementById('formCheckOtp').hidden=true;
    document.getElementById('formSubmit').hidden=false;
  }
  else{
    //show popup
  }
}
  const handleSubmit = (e) => {
    e.preventDefault();
    setExist(false);

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
        'role':'Customer',
        'borrowedBooks':[]
      },{
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
        }
      }).then(response=>{
        if(response.data==''){
          setExist(true);
        }
        else{
          console.log(response.data);
          // localStorage.setItem('userName',response.data.name);
          navigate('/login');
        }
        // setIsLoggedIn(true);
        // setIsLibrarian(false);
        // setUserId(response.data.id);
        // setUserName(response.data.name);
        // localStorage.setItem('userId',response.data.name);  
        // navigate('/');
      }).catch(e=>{
        console.log(e);
      })
      
    }else{
      axios.post('https://localhost:7271/api/Librarians',{
        "name":userNameRef.current.value,
        "email":emailRef.current.value,
        "password":passwordRef.current.value,
        "phoneNumber":phoneRef.current.value,
        "role":"Librarian",
        "libraryName":libraryRef.current.value
      },{
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response=>{
        // console.log(response.data);
        // setIsLoggedIn(true);
        // setIsLibrarian(true);
        // setUserId(response.data.Id);
        // setUserName(response.data.name);
        if(response.data==''){
          setExist(true);
        }
        else{
        // localStorage.setItem('userName',response.data.name);          
        // localStorage.setItem('libraryName',response.data.libraryName);    
        navigate('/login');
        }
      }).catch(e=>{
        console.log(e);
      })
    }
  }
  return (
    <>
          {exist && <Feedback mes="User name already used" type="error" open={true}/>}
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

                  <option value={library.name}>{library.name}</option>
                ))}
              </Form.Select>
              <Form.Group className="my-3"  hidden controlId="formOtp" id="formOtp">
                <Form.Label>Enter OTP: </Form.Label>
                <Form.Control name="Otp" type="text" placeholder="Enter OTP: " ref={otpRef} />
              </Form.Group> 
              <Button className="my-3" id="formSendOtp" onClick={handleSendOtp} variant="primary">
              {/* <a href="mailto:`{email}`?subject={subject}&body={body}"> */}
                Send OTP
                {/* </a> */}
              </Button>
              <Button hidden className="my-3" id="formCheckOtp" onClick={handleCheckOtp} variant="primary">
                Check OTP
              </Button>
              
              <Button hidden id="formSubmit" className="my-3" variant="primary" type="submit" block>
                Submit
              </Button>
            </Form>
            
            <h5>Already Registered??<Link href="/login" style={{"color":"black"}}>Login</Link></h5>

          </Col>
        </Row>
      </Paper>

    </div>
    </>
  )
}