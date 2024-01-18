using granthalaya.Models;
using MongoDB.Driver;
namespace granthalaya.Services
{
    public class BorrowedBoookService:IBorrowedBookService 
    {
        private readonly IMongoCollection<BorrowedBook> _borrowedBooks;
        private readonly IMongoCollection<Book> _books;

        public BorrowedBoookService(IGranthalaDatabaseSettings settings,IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _borrowedBooks = database.GetCollection<BorrowedBook>(settings.BorrowedBookCollectionName);
            _books = database.GetCollection<Book>(settings.BookCollectionName);
        }

        public BorrowedBook CreateBorrowedBook(BorrowedBook borrowedBook)
        {
            _borrowedBooks.InsertOne(borrowedBook);
            Book editbook=_books.Find(book => book.Id == borrowedBook.bookId).FirstOrDefault();
            editbook.quantity -= 1;
            _books.ReplaceOne(book => book.Id == editbook.Id, editbook);
            return borrowedBook;
        }

        public void DeleteBorrowedBook(string id)
        {
            _borrowedBooks.DeleteOne(book => book.Id == id);
        }

        public BorrowedBook GetBorrowedBook(string id)
        {
            return _borrowedBooks.Find(book => book.Id == id).FirstOrDefault();
        }

        public List<BorrowedBook> GetBorrowedBooks()
        {
            return _borrowedBooks.Find(book => true).ToList();
        }

        public List<BorrowedBook> GetBorrowedBooksByCustomerName(string customerName)
        {
            return _borrowedBooks.Find(book => book.customerName == customerName).ToList();
        }

        public List<BorrowedBook> GetBorrowedBooksBylibraryName(string libraryName)
        {
            return _borrowedBooks.Find(book => book.libraryName == libraryName).ToList();
        }

        public void UpdateBorrowedBook(string id, BorrowedBook borrowedBook)
        {
            _borrowedBooks.ReplaceOne(book => book.Id == id, borrowedBook);
        }
    }
}
