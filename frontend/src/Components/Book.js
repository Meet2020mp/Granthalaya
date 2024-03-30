import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/Stack';
import { Button, DropdownButton } from 'react-bootstrap';
import Rating from '@mui/material/Rating';
import Modal from 'react-bootstrap/Modal';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Feedback from "../Utils/feedbacks";
import { Menu, MenuItem, Paper, TableRow } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { styled } from '@mui/material/styles';

export default function Book(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const customerName = localStorage.getItem('userName');
    const libraryName = localStorage.getItem('libraryName');
    const { bookId } = useParams();
    const [book, setBook] = useState("");
    const [reviews, setReviews] = useState([]);
    const [ratingValue, setRatingValue] = useState(2.5);
    const reviewData = new useRef(null);
    const [isDelete, setIsDelete] = useState(false);

    const feedBackRef = new useRef(null);
    const ratingRef = new useRef(null);
    const [page, setPage] = useState(1);
    const [isBorrowed, setIsBorrowed] = useState(false);
    const navigate = useNavigate();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [reviewAdded, setReviewAdded] = useState(false);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleChange = (event, value) => {
        setPage(value);
    };
    const fetchData = async () => {
        await axios.get(`https://granthalaya.bsite.net/api/Books/${bookId}`,{
            headers:{"authorization": "Bearer " + localStorage.getItem('token')}
        }).then(response => {
            console.log(response.data);
            setBook(response.data);
        }).catch(err => { console.log(err) })
        await axios.get(`https://granthalaya.bsite.net/api/Review/ByBook/${bookId}`,{
            headers:{"authorization": "Bearer " + localStorage.getItem('token')}
        }).then(response => {
            setReviews(response.data);
            console.log(response.data);
        }).catch(err => { console.log(err) })
    }
    useEffect(() => {
        fetchData()
    }, [reviewAdded, isBorrowed, isDelete])
    const storeReview = async () => {
        // const formData = new FormData();
        // formData.append('rating', ratingValue.valueOf());
        // formData.append('review', feedBackRef.current.data);
        // formData.append('bookId', bookId);
        // formData.append('customerName', localStorage.getItem('userName'));
        // formData.append('time', new Date());
        console.log(ratingValue);
        console.log(feedBackRef.current.value);
        var time = new Date();
        await axios.post(`https://granthalaya.bsite.net/api/Review`, {
            "rating": ratingValue,
            "bookId": bookId,
            "feedBack": feedBackRef.current.value,
            "customerName": customerName
        }
            , {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + localStorage.getItem('token')
                }
            }).then(response => {
                console.log(response.data);
                handleClose();
                setReviewAdded(true);
            }).catch(err => { console.log(err) })
    }
    const storeData = async (bid) => {
        setIsBorrowed(false);
        var bookBorrow;
        await axios.get(`https://granthalaya.bsite.net/api/Books/${bid}`,{
            headers:{"authorization": "Bearer " + localStorage.getItem('token')}
        }).then(response => {
            // setBookBorrow(response.data);
            bookBorrow = response.data;
        }).catch(e => console.log(e))
        console.log(bookBorrow);
        var issueDate = new Date();
        var dueDate = new Date();
        dueDate.setDate(issueDate.getDate() + 30);
        issueDate = issueDate.toISOString();
        dueDate = dueDate.toISOString();
        var borrowedBook = {
            'bookId': bid,
            'issueDate': issueDate,
            'dueDate': dueDate,
            'returnDate': null,
            'fine': 0,
            'customerName': localStorage.getItem('userName'),
            'bookName': bookBorrow.title,
            'bookImage': bookBorrow.imageName,
            'libraryName': bookBorrow.libraryName
        }
        axios.post('https://granthalaya.bsite.net/api/BorrowedBooks', borrowedBook, {
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('token')
            }
        }).then(response => {
            console.log(response.data);
            setIsBorrowed(true);
        }).catch(err => {
            console.log(err);
        })
        // console.log(libBorrow);
    }
    const borrowBook = () => {
        if (!localStorage.getItem('userName')) {
            localStorage.setItem('redirectTo', `/books/${libraryName}`);
            navigate('/login');
        }
        else {
            let borrowedBook;
            storeData(bookId)
        }
        // console.log(bid);
    }
    const editBook = () => {
        // popupState.close;
        if (!localStorage.getItem('userName') || !localStorage.getItem('libraryName')) {
            localStorage.setItem('redirectTo', `/admin/edit-book/${bookId}`);
            navigate('/login');
        }
        else {
            navigate(`/admin/edit-book/${bookId}`);
        }
    }
    const deleteBook = () => {
        // popupState.close;
        if (!localStorage.getItem('userName') || !localStorage.getItem('libraryName')) {
            localStorage.setItem('redirectTo', `/book/${bookId}`);
            navigate('/login');
        }
        else {
            axios.delete(`https://granthalaya.bsite.net/api/Books/${bookId}`,{
                headers: { "authorization": "Bearer " + localStorage.getItem('token') },
              }).then(res => {
                // console.log(res.data);
                navigate(`/admin/books/${libraryName}`);
            }).catch(e => {
                console.log(e);
            })
        }
    }
    return (
        <>
            {isBorrowed && <Feedback mes="Book borrowed!!" open={true} type="success" />}
            {reviewAdded && <Feedback mes="Review stored!!" open={true} type="success" />}

            <Container className='my-2'>
                <center className='my-4'><h2>{book.title} Book</h2></center>
                {/* <Paper elevation={3}> */}
                <Row>
                    <Col sm={4}><Image src={book.imageName} style={{ "height": "20rem", "width": "20rem" }} thumbnail /></Col>
                    <Col sm={8}>
                        <Stack gap={3}>
                            <div className="p-2">
                                <Stack>
                                    <div className="p-2">
                                        <h2>Description:-</h2>
                                    </div>
                                    <div className="p-2">
                                        {book.description}
                                        {/* Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati esse exercitationem ipsum, optio odit recusandae laborum quia ab quae soluta, porro error dicta explicabo laboriosam modi illo ducimus est vero.
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati esse exercitationem ipsum, optio odit recusandae laborum quia ab quae soluta, porro error dicta explicabo laboriosam modi illo ducimus est vero. */}
                                    </div>
                                </Stack>
                            </div>

                            <div className="p-2">
                                <Container >
                                    <Row>
                                        <Col sm={2}>Quantity:- {book.quantity}</Col>
                                        <Col>Price:- {book.price}</Col>
                                    </Row>
                                </Container>
                            </div>
                            <div className="p-2">
                                <Container>
                                    <Row>
                                        <Col sm={3}>
                                            {
                                                libraryName != null ?
                                                    <DropdownButton
                                                        bsStyle="primary"
                                                        title="Option"
                                                        key={bookId}
                                                        id={bookId}
                                                    >
                                                        <MenuItem eventKey="1" onClick={editBook}>Edit Book</MenuItem>
                                                        <MenuItem eventKey="2" onClick={deleteBook}>Delete Book</MenuItem>
                                                    </DropdownButton>

                                                    :
                                                    book.quantity > 0 ?
                                                        <Button variant="primary" onClick={borrowBook}>
                                                            Borrow Book
                                                        </Button> :
                                                        <Button disabled variant="primary" onClick={borrowBook}>
                                                            Borrow Book
                                                        </Button>
                                            }

                                        </Col>
                                        <Col>

                                            <Button variant="primary" onClick={handleShow}>
                                                Give Review
                                            </Button>

                                            <Modal show={show} onHide={handleClose}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Give Review</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <Stack>
                                                        <div>
                                                            <Rating value={ratingValue}
                                                                onChange={(event, newValue) => {
                                                                    setRatingValue(newValue);
                                                                }} name="read-only" precision={0.5} />
                                                        </div>
                                                        <div>
                                                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                                                <Form.Label>Write Feedback</Form.Label>
                                                                <Form.Control as="textarea" rows={3} ref={feedBackRef} />
                                                            </Form.Group>
                                                        </div>
                                                    </Stack>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={handleClose}>
                                                        Close
                                                    </Button>
                                                    <Button variant="primary" onClick={storeReview}>
                                                        Save Changes
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </Stack>
                    </Col>
                </Row>
                {/* </Paper> */}
                <Row>
                    <Paper elevation={3} className='my-3'>

                        <center className='my-2'><h2>Reviews</h2></center>
                        {reviews.length == 0 ?
                            <center><h4>Be the first one to provide review</h4></center>
                            :
                            reviews.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
                                .map((review) => {
                                    return (
                                        <Container className='my-2 ' >
                                            <Row>
                                                <Col sm={3}>
                                                    <Stack>
                                                        <div>{review.customerName} :</div>
                                                        <div>{review.time.toLocaleLowerCase()}</div>
                                                    </Stack>
                                                </Col>
                                                <Col>
                                                    <Stack gap={3}>
                                                        <div className="">
                                                            <Rating readOnly name="read-only" value={review.rating} precision={0.5} />
                                                        </div>
                                                        <div className="">
                                                            {review.feedBack}
                                                            {/* Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi, deserunt quibusdam. Dolore tempora tenetur neque nesciunt itaque? Rerum accusamus, rem, quo error earum, aspernatur omnis beatae minima iure ullam nihil. */}
                                                        </div>
                                                    </Stack>
                                                </Col>
                                            </Row>
                                        </Container>
                                    );
                                })}
                        {/* {
                    reviews.forEach(review =>{
                        
                <Container className='my-2'>
                    <Row>
                        <Col sm={2}>
                            <Stack>
                                <div>{review.customerName}</div>
                                <div>{review.time}</div>
                            </Stack>
                        </Col>
                        <Col>
                            <Stack gap={3}>
                                <div className="p-2">
                                    <Rating readOnly name="read-only" value={review.rating} precision={0.5} />
                                </div>
                                <div className="p-2">
                                    {review.feedBack}
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi, deserunt quibusdam. Dolore tempora tenetur neque nesciunt itaque? Rerum accusamus, rem, quo error earum, aspernatur omnis beatae minima iure ullam nihil.
                                </div>
                            </Stack>
                        </Col>
                    </Row>
                </Container>
                    });
                } */}
                        {/* <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={reviews.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
                        <Stack spacing={2}>
                            {/* <Typography>Page: {page}</Typography> */}

                            <Pagination className='my-3' color="primary" count={rowsPerPage} page={page} onChange={handleChange} />
                        </Stack>
                    </Paper>

                </Row>
            </Container>
        </>
    );
}