import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

const columns = [
    { id: 'id', label: 'Library id', minWidth: 80 },

    { id: 'name', label: 'Name', minWidth: 160 },
    { id: 'address', label: 'Address', minWidth: 105 },
    
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
export default function Libraries() {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const navigate=new useNavigate();
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [libraries, setlibraries] = useState([
        {
            "id": 1,
            "name": "Ddu Library",
            "address":"Nadiad"
        },
        {
          "id": 2,
          "name": "Sayaji Vaibhav Library",
          "address":"Navsari"
        }
    ]);
    const fetchLibraries = async () => {
        axios.get('https://localhost:7271/api/Libraries',{
            headers: { "authorization": "Bearer " + localStorage.getItem('token') }
          }).then((response) => {
            setlibraries(response.data);
            setLoading(false);
            console.log(libraries);
        });
    }
    const getMuiTheme = () => createTheme({
        palette: {
            mode: 'dark',
        },
    })
    useEffect(() => {
        setLoading(false);
        fetchLibraries();
    }, [])
    const addBookToLibrary=(libraryName)=>{
        console.log(libraryName);
        navigate(`/admin/add-book/${libraryName}`);
    }
    const visitLibrary=(libraryName)=>{
        console.log(libraryName);
        navigate(`/admin/books/${libraryName}`);
    }
    var bid=0;
    return (
        <>
            <div className="container text-center">
                <h2 style={{fontFamily:"fantasy"}}>Registered libraries are:</h2>


                {loading ? (<Spinner animation="border" role="status" className="d-flex justify-content-center my-5">
                    <span className="sr-only"></span>
                </Spinner>) :
                    <ThemeProvider theme={getMuiTheme()}>

                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
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
                                                    key= 'actions'
                                                    align='center'
                                                    style={{ minWidth: 180 }}
                                                >
                                                    Actions
                                                </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {libraries
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                    {/* <TableRow hover role="checkbox" tabIndex={-1} key={row.id}> */}
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            bid=row[columns[0].id];
                                                            return (
                                                                 <TableCell key={column.id} align={column.align}>
                                                                    {column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                        <Button className="my-2" onClick={()=>visitLibrary(row.name)}variant="contained">Visit Library</Button>
                                                        &nbsp;&nbsp;<Button className="my-2" onClick={()=>addBookToLibrary(row.name)}variant="contained">Add book</Button>
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
                                count={libraries.length}
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