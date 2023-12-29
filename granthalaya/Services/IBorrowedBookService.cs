using granthalaya.Models;

namespace granthalaya.Services
{
    public interface IBorrowedBookService
    {
        List<BorrowedBook> GetBorrowedBooks();
        BorrowedBook GetBorrowedBook(string id);
        List<BorrowedBook>GetBorrowedBooksByCustomerId(string customerId);
        List<BorrowedBook> GetBorrowedBooksBylibraryId(string libraryId);
        BorrowedBook CreateBorrowedBook(BorrowedBook borrowedBook);
        void UpdateBorrowedBook(string id,BorrowedBook borrowedBook);
        void DeleteBorrowedBook(string id);
    }
}
