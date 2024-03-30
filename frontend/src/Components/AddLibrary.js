import { Container, Paper } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Feedback from "../Utils/feedbacks";
function AddLibraryForm() {
  const libraryNameRef=new useRef(null);
  const addressRef=new useRef(null);
  const [isAdded,setIsAdded]=useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    const library={
      'name':libraryNameRef.current.value,
      'address':addressRef.current.value,
      'availableBooks':[]
    }
    console.log(library);

    axios.post(`https://granthalaya.bsite.net/api/Libraries`,library,{
      headers: {
        'Content-Type': 'application/json',
        "authorization": "Bearer " + localStorage.getItem('token')
      }
    }).then(response=>{
      setIsAdded(true);
      console.log(response.data);
    }).catch(err=>{
      console.log(err);
    })
    // add the library to the state or send the data to an API
  };
  useEffect(()=>{

  },[isAdded])
  return (
<>
    {isAdded && <Feedback mes="Library added!!" open={true} type="success" />}

    <Container variant="dark">
    <div className="container my-4">
      <Paper elevation={5}>
      <h2 className="text-center py-2" style={{fontFamily:"fantasy"}}>Add New library:</h2>
    <Form variant="darak" className="p-3"onSubmit={handleSubmit}>
      <Form.Group controlId="formTitle">
        <Form.Label>Library name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          ref={libraryNameRef}
          placeholder="Enter library title"
        />
      </Form.Group>
      <Form.Group className="my-2" controlId="formAuthor">
        <Form.Label>Library Address</Form.Label>
        <Form.Control
          type="text"
          name="address"
          ref={addressRef}
          placeholder="Enter library address"
        />
      </Form.Group>
      <Button id="addlibrary"className="my-2 w-100"  variant="dark" type="submit">
        Add library
      </Button>
    </Form>
    </Paper>
    </div>
    </Container>
    </>
  );
}

export default AddLibraryForm;
