using granthalaya.Models;

namespace granthalaya.Services
{
    public interface IBookService
    {
        List<Book> GetBooks();
        Book GetBook(string id);
        List<Book> GetBookByQuery(string parameter,string query,string libraryId);
        List<Book> GetBookByLibraryId(string id);
        void UpdateBook(string id, Book book);
        void DeleteBook(string id);
        Book CreateBook(Book book);
    }
}
