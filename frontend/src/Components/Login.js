import React, { useRef,useContext, useState, useEffect } from "react";
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Link from '@mui/material/Link';

import { LoginContext, UserContext } from '../App';
import axios from "axios";
import Feedback from "../Utils/feedbacks";
export default function Login() {
  const userNameRef = useRef(null);
  const passwordRef = useRef(null);
  const librarianRef = useRef(null);
  const [invalid,setInvalid]=useState(false);
  const { setIsLoggedIn, setIsLibrarian,setIsAdmin } = useContext(LoginContext);
  const { setUserId,setUserName } = useContext(UserContext);
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const userName = userNameRef.current.value;
    const password = passwordRef.current.value;
    if(librarianRef.current.checked){
      try{
        axios.get(`https://localhost:7271/api/Librarians/${userName}`).then((response) => {
          // if(response.data.name===userName && response.data.password===password && userName === 'admin'){
            //   setIsLoggedIn(true);
        //   setIsAdmin(true);
        //   setUserId(response.data.id);
        //   setUserName(response.data.name);
        //   localStorage.setItem('userName',response.data.name);
        //   localStorage.setItem('userId',response.data.id);
        //   navigate("/admin");

        // }
        if(userName=="admin" && response.data.name===userName && response.data.password===password){
          setIsLoggedIn(true);
          setIsAdmin(true);
          setUserId(response.data.id);
          setUserName(response.data.name);
          localStorage.setItem('userName',response.data.name);
          localStorage.setItem('userId',response.data.id);
          localStorage.setItem('isAdmin',true);
          // navigate("/");
          const lastLocation=localStorage.getItem('redirectTo');
          localStorage.removeItem('redirectTo');
          // Feedback({mes:`Welcome ${userName}`,open:'true',type:"success"})
          lastLocation?navigate(lastLocation):navigate('/');
        }
        else if(response && response.data.name===userName && response.data.password===password){
          setIsLoggedIn(true);
          setIsLibrarian(true);
          setUserId(response.data.id);
          setUserName(response.data.name);

          localStorage.setItem('userName',response.data.name);
          localStorage.setItem('userId',response.data.id);
          localStorage.setItem('libraryId',response.data.libraryId);
          // Feedback({mes:`Welcome ${userName}`,open:'true',type:"success"})

      //     const location = useLocation();
      // const { redirectTo } = queryString.parse(location.search);
      // history.push(redirectTo == null ? "/admin" : redirectTo);
        navigate("/admin");

        }
        else{

          setInvalid(true);
        }
        });
      }catch(e) {
        // Feedback({mes:`Invalid credentials`,open:'true',type:"danger"})
        setInvalid(true);

        console.log(e);
      }
    }else{
      try{
        axios.get(`https://localhost:7271/api/Customers/${userName}`).then((response) => {
          
          if(response && response.data.name===userName && response.data.password===password){
            setIsLoggedIn(true);
            setIsLibrarian(false);
            setUserId(response.data.id);
            setUserName(response.data.name);
            localStorage.setItem('userName',response.data.name);
            localStorage.setItem('userId',response.data.id);
            // navigate("/");
            const lastLocation=localStorage.getItem('redirectTo');
            localStorage.removeItem('redirectTo');
            // Feedback({mes:`Welcome ${userName}`,open:'true',type:"success"})
            lastLocation?navigate(lastLocation):navigate('/');
          }
          else{
            setInvalid(true);

          }
          });
        }catch(e) {
          // Feedback({mes:`Invalid credentials`,open:'true',type:"danger"})
          setInvalid(true);
          console.log(e);
        }
    }
  }
  useEffect(()=>{
    // setInvalid(false);
  },[invalid])
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
  return (
    <>
    {invalid && <Feedback mes="invalid credentials" type="error" open={true}/>}
    <Paper style={styles.paperContainer}>

    <div className='login-page' >
      <Paper elevation={5} style={styles.bg}  className="container w-50 py-3" >
              <h2 className="my-3 text-center">Login!!</h2>

        <Row className="justify-content-md-center mt-5">
          <Col md={6}>
            <Form onSubmit={handleSubmit}className='form-container'>
              <Form.Group controlId="formBasicuserName">
                <Form.Label>User Name</Form.Label>
                <Form.Control type="userName" placeholder="Enter User Name" ref={userNameRef} />
              </Form.Group>
              <Form.Group className="my-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" ref={passwordRef} />
              </Form.Group>
              <Form.Check
                type="checkbox"
                id={`isLibrarian`}
                label="Are you libraryan?"
                ref={librarianRef}
              />
              <Button className="my-3" variant="primary" type="submit" block>
                Submit
              </Button>
            </Form>
            <h5>New User??<Link href="/signup" style={{"color":"black"}}>Sign up</Link></h5>
          </Col>
        </Row>
      </Paper>
    </div>
    </Paper>
    </>
  )
}