using granthalaya.Models;

namespace granthalaya.Services
{
    public interface IBorrowedBookService
    {
        List<BorrowedBook> GetBorrowedBooks();
        BorrowedBook GetBorrowedBook(string id);
        List<BorrowedBook>GetBorrowedBooksByCustomerName(string customerName);
        List<BorrowedBook> GetBorrowedBooksBylibraryName(string libraryName);
        BorrowedBook CreateBorrowedBook(BorrowedBook borrowedBook);
        void UpdateBorrowedBook(string id,BorrowedBook borrowedBook);
        void DeleteBorrowedBook(string id);
    }
}
