import React, { useContext, useEffect, useState } from "react";
import { Spinner } from 'react-bootstrap';
import axios from "axios";
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
// import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LoginContext } from '../App';
import Feedback from "../Utils/feedbacks";
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
        align: 'right',
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
export default function BookList(props) {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = React.useState(0);
    const [isBorrowed, setIsBorrowed] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isDelete, setIsDelete] = React.useState(false);
    const { isLoggedIn } = useContext(LoginContext);
    const  {libraryName}  = useParams();
    const navigate = useNavigate();
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [books, setBooks] = useState([
        {
            "id": 0,
            "title": "DSA",
            "publishDate": "2023-02-15T06:21:47.969",
            "author": "narasimha karumanchi",
            "price": 220,
            "quantity": 5
        },

    ]);
    const fetchBooks = async () => {
        // axios.get(`https://granthalaya.bsite.net/api/Libraries/${libraryName}`).then(response => {
        //     setLibraryName(response.data.name);
        //     // console.log(libraryName);
        // })
        axios.get(`https://granthalaya.bsite.net/api/Books/BylibraryName/${libraryName}`,{
            headers: { "authorization": "Bearer " + localStorage.getItem('token') }
          }).then((response) => {
            setBooks(response.data);
            console.log(response.data);
            setLoading(false);
            // console.log(books);
        });
    }
    const getMuiTheme = () => createTheme({
        palette: {
            mode: 'dark',
        },
    })
    useEffect(() => {
        // setLoading(false);
        fetchBooks();
    }, [isBorrowed, isDelete])
    // const [bookBorrow,setBookBorrow]=useState();
    // const [libBorrow,setLibBorrow]=useState("DDU Library");

    const storeData = async (bid) => {
        setIsBorrowed(false);
        var bookBorrow;
        await axios.get(`https://granthalaya.bsite.net/api/Books/${bid}`,
        {
            headers: { "authorization": "Bearer " + localStorage.getItem('token') }
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
    const borrowBook = (bid) => {
        if (!localStorage.getItem('userName')) {
            localStorage.setItem('redirectTo', `/books/${libraryName}`);
            navigate('/login');
        }
        else {
            navigate(`/book/${bid}`);
            let borrowedBook;
            // storeData(bid)
        }
        // console.log(bid);
    }
    const editBook = (popupState, bid) => {
        // popupState.close;
        if (!localStorage.getItem('userName') || !localStorage.getItem('libraryName')) {
            localStorage.setItem('redirectTo', `/admin/edit-book/${bid}`);
            navigate('/login');
        }
        else {
            navigate(`/admin/edit-book/${bid}`);
        }
    }
    const deleteBook = (popupState, bid) => {
        // popupState.close;
        if (!localStorage.getItem('userName') || !localStorage.getItem('libraryName')) {
            localStorage.setItem('redirectTo', `/admin/edit-book/${bid}`);
            navigate('/login');
        }
        else {
            axios.delete(`https://granthalaya.bsite.net/api/Books/${bid}`,{
                headers: { authorization: "Bearer " + localStorage.getItem('token') }
              }).then(res => {
                console.log(res.data);
                setIsDelete(true);
            }).catch(e => {
                console.log(e);
            })
        }
    }
    return (
        <>
            <div className="container text-center">
                <h2 style={{fontFamily:"fantasy"}}>Available books of {libraryName}:</h2>
                {isDelete && <Feedback mes="Book deleted!!" open={true} type="success" />}

                {isBorrowed && <Feedback mes="Book borrowed!!" open={true} type="success" />}
                {loading ? (<Spinner animation="border" role="status" className="d-flex justify-content-center my-5">
                    <span className="sr-only"></span>
                </Spinner>) :
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
                                                            <img src={row.imageName} style={{ "height": "200px", "width": "200px" }} />
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
                                                        {props.isAdmin ?
                                                            <PopupState variant="popover" popupId="demo-popup-menu">
                                                                {(popupState) => (
                                                                    <React.Fragment>
                                                                        <Button variant="contained" {...bindTrigger(popupState)}>
                                                                            Options
                                                                        </Button>
                                                                        <Menu {...bindMenu(popupState)}>
                                                                            <MenuItem onClick={() => { editBook(popupState, row.id) }}>Edit Book</MenuItem>
                                                                            <MenuItem onClick={() => { deleteBook(popupState, row.id); }}>Delete Book</MenuItem>
                                                                        </Menu>
                                                                    </React.Fragment>
                                                                )}
                                                            </PopupState> :<>
                                                            {
                                                                row.quantity > 0 ?
                                                                    <Button className="my-2"  onClick={() => { borrowBook(row.id) }} variant="contained">View Book</Button>
                                                                    :
                                                                    <Button className="my-2" disabled onClick={() => { borrowBook(row.id) }} variant="contained">Borrow</Button>
                                                            }
                                                        </>
                                                        }
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
            </div>
        </>
    )
} 