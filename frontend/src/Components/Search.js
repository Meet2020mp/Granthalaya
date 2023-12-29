import axios from 'axios';
import React, { useEffect, useState ,useContext} from 'react'
import { Container, Row, Col, Form, Spinner, Dropdown, ButtonGroup } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LoginContext } from '../App';
import Feedback from "../Utils/feedbacks";
import { useNavigate,useParams } from 'react-router-dom';
import { Paper } from '@mui/material';
import Button from '@mui/material/Button';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function Search() {
  const [isBorrowed, setIsBorrowed] = React.useState(false);
  const [query,setQuery]=useState("");
  const [parameter,setPaarameter]=useState("title");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { isLoggedIn } = useContext(LoginContext);
  const [loading,setLoading]=useState(true);
  const [books,setBooks]=useState([]);
  const [isDelete, setIsDelete] = React.useState(false);
  const { libraryId } = useParams();
  const navigate = useNavigate();
  const isLibrarian=localStorage.getItem('libraryId');
  const columns = [
    { id: 'id', label: 'Book id', minWidth: 80 },

    { id: 'title', label: 'Title', minWidth: 160 },
    { id: 'author', label: 'Author', minWidth: 105 },
    {
        id: 'price',
        label: 'Price',
        minWidth: 100,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'libraryId',
      label: 'Library Id',
      minWidth: 50,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
  },
    {
        id: 'publishDate',
        label: 'PublishDate',
        minWidth: 160,
        align: 'right',
        format: (value) => new Date(value).toDateString(),
    },
    {
        id: 'quantity',
        label: 'Quantity',
        minWidth: 160,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    // ,
    // {
    //     id: 'image',
    //     label: 'Image',
    //     minWidth: 200,
    //     align: 'right',
    //     format: (value) => {},
    // }
    
];
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
      border: 0,
  },
}));
const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(+event.target.value);
  setPage(0);
};
const getMuiTheme = () => createTheme({
  palette: {
      mode: 'dark',
  },
})
const storeData=async (bid)=>{
  var bookBorrow;
   await axios.get(`https://localhost:7271/api/Books/${bid}`).then(response=>{
          // setBookBorrow(response.data);
          bookBorrow=response.data;
      }).catch(e=>console.log(e))
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
          'customerId': localStorage.getItem('userId'),
          'bookName':bookBorrow.title,
          'bookImage':bookBorrow.imageName,
          'libraryName':bookBorrow.libraryId
      }
      axios.post('https://localhost:7271/api/BorrowedBooks', borrowedBook, {
          headers: {
              "Content-Type": "application/json"
          }
      }).then(response => {
          console.log(response.data);
          setIsBorrowed(true);
      }).catch(err => {
          console.log(err);
      })
                  // console.log(libBorrow);
}
  const handleSubmit=async ()=>{
    setLoading(true);
    
    await axios.get(`https://localhost:7271/api/Books/byQuery/${parameter}/${query}/${libraryId}`).then((res)=>{
      console.log(res.data);
      setBooks(res.data);
      setLoading(false);
    }).catch((e)=>{
      setLoading(false);
      console.log(e);
    })
  }
  const borrowBook = (bid) => {
    if (!localStorage.getItem('userName')) {
        localStorage.setItem('redirectTo', `/search`);
        navigate('/login');
    }
    else {
        let borrowedBook;
        storeData(bid)
    }
    // console.log(bid);
}
  useEffect(()=>{
    setLoading(false);
    handleSubmit();
  },[isBorrowed,query,isDelete])
  const editBook = (popupState,bid) => {
    // popupState.close;
    if (!localStorage.getItem('userName') || !localStorage.getItem('libraryId')) {
        localStorage.setItem('redirectTo', `/admin/edit-book/${bid}`);
        navigate('/login');
    }
    else {
        navigate(`/admin/edit-book/${bid}`);
    }
}
const deleteBook = (popupState,bid) => {
    // popupState.close;
    if (!localStorage.getItem('userName') || !localStorage.getItem('libraryId')) {
        localStorage.setItem('redirectTo', `/admin/edit-book/${bid}`);
        navigate('/login');
    }
    else {
        axios.delete(`https://localhost:7271/api/Books/${bid}`).then(res=>{
            console.log(res.data);
            setIsDelete(true);
        }).catch(e=>{
            console.log(e);
        })
    }
  }
  return (
    <>
     {isBorrowed && <Feedback mes="Book borrowed!!" open={true} type="success" />}
<Container>
            
            <Row className="my-5">
                <Col sm={12}>
                    <h1 className="text-center">Search Books</h1>
                </Col>
                <Col sm={12}>
                    <Form onSubmit={handleSubmit}>
                        <Row className="align-items-center">
                            <Col xs={10}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter search query"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </Col>
                            <Col xs={2}>
                                {/* <Button variant="contained" color="primary" onClick={handleSubmit}>
                                    Search
                                </Button> */}
                                <Dropdown as={ButtonGroup}>
                                    <Button variant="contained" color="primary" onClick={()=>{var par="title";setPaarameter(par)}}>Search By {parameter}</Button>

                                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={()=>{var par="auther";setPaarameter(par)}}>Search By Auther</Dropdown.Item>
                                        <Dropdown.Item onClick={()=>{var par="library";setPaarameter(par)}}>Search By Library</Dropdown.Item>
                                        <Dropdown.Item onClick={()=>{var par="title";setPaarameter(par)}}>Search By Title</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>


            <Row>


                <Col sm={12}>
                    {loading ? (
                        <Spinner animation="border" role="status" className="d-flex justify-content-center my-5">
                            <span className="sr-only"></span>
                        </Spinner>
                    ) : (
                      <>
                      {books.length==0 ? <h1>No book found!!</h1>:
                       <ThemeProvider theme={getMuiTheme()}>

                       <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                           <TableContainer sx={{ maxHeight: 440 }}>
                               <Table stickyHeader aria-label="sticky table">
                                   <TableHead>
                                       <TableRow>
                                       <TableCell
                                               key='image'
                                               align='center'
                                               style={{ minWidth: 180 }}
                                           >
                                               Book Image
                                           </TableCell>
                                           {columns.map((column) => (
                                               <TableCell
                                                   key={column.id}
                                                   align={column.align}
                                                   style={{ minWidth: column.minWidth }}
                                               >
                                                   {column.label}
                                               </TableCell>
                                           ))}
                                           
                                           <TableCell
                                               key='actions'
                                               align='center'
                                               style={{ minWidth: 180 }}
                                           >
                                               Actions
                                           </TableCell>
                                           
                                       </TableRow>
                                   </TableHead>
                                   <TableBody>
 
                                       {books
                                           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                           .map((row) => {
                                               return (
                                                   <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                       <div>
                                                           <img src={row.imageName} style={{"height":"200px","width":"200px"}}/>
                                                       </div>
                                                       {/* <TableRow hover role="checkbox" tabIndex={-1} key={row.id}> */}
                                                       {columns.map((column) => {
                                                           const value = row[column.id];
                                                           // bid=row[columns[0].id];
                                                           return (
                                                               <TableCell key={column.id} align={column.align}>
                                                                   {column.format && typeof value === 'number'
                                                                       ? column.format(value)
                                                                       : value}
                                                               </TableCell>
                                                           );
                                                       })}
                                                      {isLibrarian ?
                                                            <PopupState variant="popover" popupId="demo-popup-menu">
                                                                {(popupState) => (
                                                                    <React.Fragment>
                                                                        <Button variant="contained" {...bindTrigger(popupState)}>
                                                                            Options
                                                                        </Button>
                                                                        <Menu {...bindMenu(popupState)}>
                                                                            <MenuItem onClick={()=>{editBook(popupState,row.id)}}>Edit Book</MenuItem>
                                                                            <MenuItem onClick={()=>{deleteBook(popupState,row.id);}}>Delete Book</MenuItem>
                                                                        </Menu>
                                                                    </React.Fragment>
                                                                )}
                                                            </PopupState> : <Button className="my-2" onClick={() => { borrowBook(row.id) }} variant="contained">Borrow</Button>} 
                                                       {/* </TableRow> */}
                                                   </StyledTableRow>
                                               );
                                           })}
                                   </TableBody>
                               </Table>
                           </TableContainer>
                           <TablePagination
                               rowsPerPageOptions={[10, 25, 100]}
                               component="div"
                               count={books.length}
                               rowsPerPage={rowsPerPage}
                               page={page}
                               onPageChange={handleChangePage}
                               onRowsPerPageChange={handleChangeRowsPerPage}
                           />
                       </Paper>
                   </ThemeProvider>
                      }
                     
                  </>)}
                </Col>

            </Row>
        </Container>
        </>
          )
}
