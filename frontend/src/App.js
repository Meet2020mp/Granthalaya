import React,{useState,createContext } from 'react';
import './App.css';
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import Home from "./Components/Home";
import Header from './Utils/Header';
import BookList from './Components/BookList';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import BorrowedBooks from './Components/BorrowedBookList';
import AdminHeader from './Utils/AdminHeader';
import LibraryList from './Components/LibraryList';
import AddBookForm from './Components/AddBook';
import AddLibraryForm from './Components/AddLibrary';
import Libraries from './Components/Libraries';
import AddLibrarian from './Components/AddLibrarian';
import EditBookForm from './Components/EditBook';
import Search from './Components/Search';
import BorrowedBooksFromLibrary from './Components/BorrowedBooksFromLibrary';
export const LoginContext = createContext({
  isLoggedIn: false,
  isLibrarian:false,
  isAdmin:false,
  setIsLoggedIn: () => {},
  setIsLibrarian: () => {},
  setIsAdmin: () => {},
});

export const UserContext = createContext({
  userId:null,
  setUserId: () => {},
  userName:null,
  setUserName: () => {}
});

function App() {
  const [userId,setUserId]=useState(null);
  const [userName,setUserName]=useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLibrarian, setIsLibrarian] = useState(false);
  const [libraryId, setLibraryId] = useState(null);
  const [isAdmin,setIsAdmin]=useState(false);
  return (
    <>
    <BrowserRouter>
    <UserContext.Provider value={{userId,userName,setUserId,setUserName}}>
      <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn,isLibrarian,setIsLibrarian,isAdmin,setIsAdmin }}>

    <Header/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/admin" element={<Home/>}/>
      <Route path="/admin/add-book/:libraryId" element={<AddBookForm/>}/>
      <Route path="/admin/borrowed-books/:libraryId" element={<BorrowedBooksFromLibrary/>}/>
      <Route path="/admin/edit-book/:bookId" element={<EditBookForm/>}/>
      <Route path="/admin/libraries" element={<Libraries/>}/>
      <Route path="/admin/add-library" element={<AddLibraryForm/>}/>
      <Route path="/admin/add-librarian" element={<AddLibrarian/>}/>
      <Route path="/books/:libraryId" element={<BookList/>}/>
      <Route path="/admin/books/:libraryId" element={<BookList isAdmin='true'/>}/>
      <Route path="/libraries" element={<LibraryList/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/search/:libraryId" element={<Search/>}/>
      <Route path="/librarian/search/:libraryId" element={<Search/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/borrowed-books" element={<BorrowedBooks/>}/>
    </Routes>
    </LoginContext.Provider>
    </UserContext.Provider>
    </BrowserRouter>
    </>
  );
}

export default App;
