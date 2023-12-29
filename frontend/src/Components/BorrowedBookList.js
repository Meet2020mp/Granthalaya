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
// import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { LoginContext } from '../App';
import { useNavigate } from "react-router-dom";
import Feedback from "../Utils/feedbacks";
const columns = [
    { id: 'id', label: 'id', minWidth: 80 },

    { id: 'bookName', label: 'Book Name', minWidth: 150 },

    { id: 'libraryId', label: 'Library Id', minWidth: 100 },
    {
        id: 'dueDate',
        label: 'Due Date',
        minWidth: 160,
        align: 'right',
        format: (value) => new Date(value).toDateString(),
    },
    {
        id: 'issueDate',
        label: 'Issue Date',
        minWidth: 160,
        align: 'right',
        format: (value) => new Date(value).toDateString(),
    },
    {
        id: 'returnDate',
        label: 'Return Date',
        minWidth: 160,
        align: 'right',
        format: (value) => new Date(value).toDateString(),
    },
    {
        id: 'fine',
        label: 'Fine',
        minWidth: 160,
        align: 'right',
    },
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
export default function BorrowedBooks() {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const { isLoggedIn } = useContext(LoginContext);
    const navigate = useNavigate();
    const [bookName, setBookName] = useState();
    const [booksrc, setBookSrc] = useState();
    const [libraryId, setlibraryId] = useState();
    const [isReturned, setIsReturned] = useState(false);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [books, setBooks] = useState([
    ]);
    const [returnedBooks, setReturnedBooks] = useState();
    let fetchBooks = async () => {
        await axios.get(`https://localhost:7271/api/BorrowedBooks/ByCustomerId/${localStorage.getItem('userId')}`).then((response) => {
            
            setBooks( response.data);
            setLoading(false);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        })

    }
    const getMuiTheme = () => createTheme({
        palette: {
            mode: 'dark',
        },
    })
    useEffect(() => {
        if (!localStorage.getItem('userName')) {
            localStorage.setItem('redirectTo', `/borrowed-books`);
            navigate('/login');
        }
        else {
            // setLoading(false);
            fetchBooks();
        }
    }, [isReturned])
    const returnBook = async (bid) => {
        // setLoading(true);
        await axios.get(`https://localhost:7271/api/BorrowedBooks/${bid}`).then(response => {
            // console.log(response.data);
            setReturnedBooks(response.data);
        }).catch(err => {
            console.log(err);
        })
        var fineDays = new Date().getTime() - new Date(returnedBooks.dueDate).getTime();
        fineDays = Math.floor(fineDays / (1000 * 60 * 60 * 24));
        if (fineDays < 0) fineDays = 0;
        setReturnedBooks({
            ...returnedBooks,
            'returnDate': new Date(),
            'fine': fineDays * 10
        })

        console.log(returnedBooks);
        await axios.put(`https://localhost:7271/api/BorrowedBooks/${bid}`,
            {
                'id': bid,
                'libraryId': returnedBooks.libraryId,
                'customerId': returnedBooks.customerId,
                'issueDate': returnedBooks.issueDate,
                'dueDate': returnedBooks.dueDate,
                'bookId': returnedBooks.bookId,
                'bookName': returnedBooks.bookName,
                'bookImage': returnedBooks.bookImage,
                'returnDate': new Date(),
                'fine': fineDays * 10
                // 'fine':0
            }, {
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            console.log(response.data);
            setIsReturned(true);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log(err);
        })
        // console.log(bid);
    }
    // async function getValue(bid,lid) {
    //     axios.get(`https://localhost:7271/api/Books/${bid}`).then(response => {
    //         //   console.log(response.data);  
    //         setBookName(response.data.title);
    //         setBookSrc(response.data.imageName);
    //         // setLoading(false);
    //     }).catch(err => {
    //         console.log(err);
    //     })

    //     axios.get(`https://localhost:7271/api/Libraries/${lid}`).then(response => {
    //         // console.log(response.data);  
    //         setlibraryId(response.data.name);
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // }

    // var bid=0;
    return (
        <>
            <div className="container text-center">
                <h1>Borrowed books are:</h1>

                {isReturned && <Feedback mes="book returned!!" open={true} type="success" />}

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
                                                let returned = false;
                                                if (row['returnDate'] !== null) returned = true;
                                                // getValue(row['bookId'],row['libraryId']);
                                                return (
                                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                        {/* <TableRow hover role="checkbox" tabIndex={-1} key={row.id}> */}
                                                        <div>
                                                            <img src={row.bookImage} style={{ "height": "200px", "width": "200px" }} />
                                                        </div>
                                                        {columns.map((column) => {
                                                            var value = row[column.id];

                                                            // console.log( new Date(value).toDateString());
                                                            // console.log(bookName+" "+libraryId);
                                                            // if(column.id==='bookId')value=bookName;
                                                            // if(column.id==='libraryId')value=libraryId;
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {column.format && value != undefined
                                                                        ? column.format(value)
                                                                        : value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                        {returned ?
                                                            <Button className="my-2" disabled variant="contained">Returned</Button>
                                                            :
                                                            <Button className="my-2" onClick={() => returnBook(row.id)} variant="contained">Return</Button>
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