import { Container, Paper } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Feedback from "../Utils/feedbacks";

function EditBookForm() {
  const titleRef=new useRef(null);
  const quantityRef=new useRef(null);
  const authorRef=new useRef(null);
  const publishDateRef=new useRef(null);
  const priceRef=new useRef(null);
  const descriptionRef=new useRef(null);
  const {bookId}=useParams();
  const [book,setBook]=useState({});
  const [description,setDescription]=useState();
  const [publishDate,setPublishDate]=useState();
  const navigate=useNavigate();
  const [isEdit,setIsEdit]=useState(false);

    const  fetchData=async()=>{
    await axios.get(`https://localhost:7271/api/Books/${bookId}`,{
      headers: { "authorization": "Bearer " + localStorage.getItem('token') }
    }).then(response=>{
      setBook(response.data);
      // showPreview();
      console.log(response.data);
      // quantityRef.current=response.data.quantity;
      // authorRef.current=response.data.author;
      // priceRef.current=response.data.price;
      // titleRef.current=response.data.title;
      // publishDateRef.current=new Date(response.data.publishDate);
    }).catch(err=>{console.log(err)})
  }
  const handleSubmit = event => {
    event.preventDefault();
    // const newBook={
    //   'id':bookId,
    //   'title':titleRef.current.value,
    //   'quantity':quantityRef.current.value,
    //   'author':authorRef.current.value,
    //   'publishDate':book.publishDate,
    //   'price':priceRef.current.value,
    //   'libraryId':book.libraryId
    // }
    console.log(book);
    const formData=new FormData()
    formData.append('title',book.title)
    formData.append('quantity',book.quantity)
    formData.append('author',book.author)
    formData.append('publishDate',book.publishDate)
    formData.append('price',book.price)
    formData.append('description',book.description)
    formData.append('libraryName',book.libraryName)
    if(book.image!=null){formData.append('image',book.image);formData.append('imageName',book.image.name)}
    // formData.append('image',book.image)
    else {console.log(book);formData.append('imageName',book.imageName);formData.append('image',null)}
    formData.append('Id',bookId)
    axios.put(`https://localhost:7271/api/Books/${bookId}`,formData,{
      headers:{
        "Content-Type":"multipart/form-data",
        "authorization": "Bearer " + localStorage.getItem('token')
      }
    }).then(response => {
      // console.log(response.data);
      setIsEdit(true);
    }).catch(err => {console.log(err);})
    // console.log(libraryName);
    // console.log(book);
    // add the book to the state or send the data to an API
  };
  const updateBook=(per)=>{
    setBook({
      ...book,...per
    })
  }
  useEffect(()=>{
    if(!localStorage.getItem('userName') ){
        localStorage.setItem('redirectTo',`/admin/edit-book/${bookId}`);
        navigate('/login');
    }
    else{
    fetchData();
    }
  },[isEdit])
  const showPreview=(e)=>{
    if(e.target.files && e.target.files[0]){
      let image=e.target.files[0];
      // console.log(image);
      // console.log(imageRef.current.value);
      const reader=new FileReader();
      reader.onload=x=>{
        setBook({
          ...book,
          image:e.target.files[0],
          imageName:x.target.result
        })
        // setSrc(x.target.result)
        // setImgName(image.name)
      }
      // console.log(src);
      // console.log(book);
      reader.readAsDataURL(image);
    }
   }
  return (
    <>
        {isEdit && <Feedback mes="Book edited!!" open={true} type="success" />}

    <Container variant="dark">
      
    <div className="container my-4">
      <Paper elevation={5}>
      <h2 className="text-center py-2" style={{fontFamily:"fantasy"}}>Edit Book:</h2>
    <Form variant="darak" className="p-3"onSubmit={handleSubmit}>
      <Form.Group controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={book.title}
          onChange={(event)=>{updateBook({title:event.target.value})}}
          placeholder="Enter book title"
        />
      </Form.Group>
      <Form.Group className="my-2" controlId="formAuthor">
        <Form.Label>Author</Form.Label>
        <Form.Control
          type="text"
          name="author"
          value={book.author}
          onChange={(event)=>{updateBook({author:event.target.value})}}
          placeholder="Enter book author"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Book description</Form.Label>
        <Form.Control as="textarea" rows={3} value={book.description}           onChange={(event)=>{updateBook({description:event.target.value})}}
placeholder="Enter book description"/>
      </Form.Group>
      <Form.Group className="my-2" controlId="formPrice">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="text"
          name="price"
          value={book.price}
          onChange={(event)=>{updateBook({price:event.target.value})}}
          placeholder="Enter book price"
        />
      </Form.Group>
      <Form.Group className="my-2" controlId="formQuantity">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="text"
          name="quantity"
          value={book.quantity}
          onChange={(event)=>{updateBook({quantity:event.target.value})}}
          placeholder="Enter book quantity"
        />
        </Form.Group>
        <div>
            <img src={book.imageName} style={{"height":"200px","width":"200px"}}alt="Book image"/>
            </div>
      {/* <img src="lib1.jpg" className="form-control-top" alt="Book image"/> */}
      <Form.Group className="my-2" controlId="formPublishDate">
        <Form.Label>Book image</Form.Label>
        <Form.Control
        accept="img/*"
         className="form-control-file"
          type="file"
          name="image"
          // ref={imageRef}
          onChange={showPreview}
        />
      </Form.Group>
      <Button id="addBook"className="my-2 w-100"  variant="dark" type="submit">
        Edit Book
      </Button>
    </Form>
    </Paper>
    </div>
    </Container>
</>
  );
}

export default EditBookForm;
