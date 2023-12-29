import { Container, Paper } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Feedback from "../Utils/feedbacks";
function AddBookForm() {
  const titleRef=new useRef(null);
  const quantityRef=new useRef(null);
  const authorRef=new useRef(null);
  const publishDateRef=new useRef(null);
  const priceRef=new useRef(null);
  const imageRef=new useRef(null);
  const {libraryId}=useParams();
  const [libraryName,setLibraryName]=useState();
  const [isAdded,setIsAdded]=useState(false);
  const [publishDate,setPublishDate]=useState();
  const [value, setValue] = React.useState(dayjs('2022-04-17T15:30'));
  const [src,setSrc]=useState("/b2.jpg");
  const [imgname,setImgName]=useState("/b1.jpg");
  const [img,setImg]=useState();
  const fetchData=()=>{
    axios.get(`https://localhost:7271/api/Libraries/${libraryId}`).then(response=>{
      console.log(response.data);
      setLibraryName(response.data.name);
    }).catch(err=>{console.log(err)})
  }
  const handleSubmit = event => {
    event.preventDefault();
    // const book={
    //   'title':titleRef.current.value,
    //   'quantity':quantityRef.current.value,
    //   'author':authorRef.current.value,
    //   'publishDate':publishDateRef.current.value,
    //   'price':priceRef.current.value,
    //   'libraryId':libraryId,
    //   'image':img,
    //   'imageName':src
    // }
    const formData=new FormData()
    formData.append('title',titleRef.current.value)
    formData.append('quantity',quantityRef.current.value)
    formData.append('author',authorRef.current.value)
    formData.append('publishDate',publishDateRef.current.value)
    formData.append('price',priceRef.current.value)
    formData.append('libraryId',libraryId)
    formData.append('image',img)
    formData.append('imageName',imgname)
    // console.log(formData);
    axios.post('https://localhost:7271/api/Books/',formData,{
      Headers:{
        "Content-Type":"application/json"
      }
    }).then(response => {
      // console.log(response.data);
      setIsAdded(true);
    }).catch(err => {console.log(err);})
    // console.log(libraryName);
    // console.log(book);
    // add the book to the state or send the data to an API
  };
  useEffect(()=>{
    fetchData();
  },[isAdded])
  
 const showPreview=(e)=>{
  if(e.target.files && e.target.files[0]){
    let image=e.target.files[0];
    // console.log(image);
    // console.log(imageRef.current.value);
    const reader=new FileReader();
    reader.onload=x=>{
      setImg(image);
      setSrc(x.target.result)
      setImgName(image.name)
    }
    // console.log(src);
    // console.log(img);
    reader.readAsDataURL(image);
  }
 }
  return (
    <>
    {isAdded && <Feedback mes="Book added!!" open={true} type="success" />}

    <Container variant="dark">
      
    <div className="container my-4">
      <Paper elevation={5}>
      <h2 className="text-center py-2">Add New Book to {libraryName}:</h2>
    <Form variant="darak" className="p-3"onSubmit={handleSubmit}>
      <Form.Group controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          ref={titleRef}
          placeholder="Enter book title"
        />
      </Form.Group>
      <Form.Group className="my-2" controlId="formAuthor">
        <Form.Label>Author</Form.Label>
        <Form.Control
          type="text"
          name="author"
          ref={authorRef}
          placeholder="Enter book author"
        />
      </Form.Group>
      <Form.Group className="my-2" controlId="formPrice">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="text"
          name="price"
          ref={priceRef}
          placeholder="Enter book price"
        />
      </Form.Group>
      <Form.Group className="my-2" controlId="formQuantity">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="text"
          name="quantity"
          ref={quantityRef}
          placeholder="Enter book quantity"
        />
        </Form.Group>
        <Form.Group className="my-2" controlId="formPublishDate">
        <Form.Label>Publish Date</Form.Label>
        <Form.Control
          type="date"
          name="quantity"
          ref={publishDateRef}
        />
      </Form.Group>
      <div>
            <img src={src} style={{"height":"200px","width":"200px"}}alt="Book image"/>
            </div>
      {/* <img src="lib1.jpg" className="form-control-top" alt="Book image"/> */}
      <Form.Group className="my-2" controlId="formPublishDate">
        <Form.Label>Book image</Form.Label>
        <Form.Control
        accept="img/*"
         className="form-control-file"
          type="file"
          name="image"
          ref={imageRef}
          onChange={showPreview}
        />
      </Form.Group>
      <Button id="addBook"className="my-2 w-100"  variant="dark" type="submit">
        Add Book
      </Button>
    </Form>
    </Paper>
    </div>
    </Container>
    </>
  );
}

export default AddBookForm;
