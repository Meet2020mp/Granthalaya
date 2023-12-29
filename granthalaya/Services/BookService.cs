using granthalaya.Models;
using MongoDB.Driver;

namespace granthalaya.Services
{
    public class BookService : IBookService
    {
        private readonly IMongoCollection<Book> _books;
        public BookService(IGranthalaDatabaseSettings settings,IMongoClient mongoClient)
        {
            var database=mongoClient.GetDatabase(settings.DatabaseName);
            _books = database.GetCollection<Book>(settings.BookCollectionName);
        }
        public Book CreateBook(Book book)
        {
            /*byte[] img = File.ReadAllBytes(book.imageName);
            book.image = img;*/
             _books.InsertOne(book);
            return book;
        }
        public void DeleteBook(string id)
        {
            _books.DeleteOne(book => book.Id == id);
        }

        public Book GetBook(string id)
        {
            return _books.Find(book => book.Id == id).FirstOrDefault();
        }

        public List<Book> GetBookByLibraryId(string libraryId)
        {
            return _books.Find(book => book.libraryId == libraryId).ToList();
        }

        public List<Book> GetBookByQuery(string parameter,string query, string libraryId)
        {
            if (libraryId != "0")
            {
                if (parameter == "title" || parameter == "")
                {
                    return _books.Find(book => book.title.ToString().Contains(query) && book.libraryId == libraryId).ToList();
                }
                else if (parameter == "auther")
                {
                    return _books.Find(book => book.author.ToString().Contains(query) && book.libraryId == libraryId).ToList();
                }
                else if (parameter == "library")
                {
                    return _books.Find(book => book.title.ToString().Contains(query) && book.libraryId == libraryId).ToList();

                }
            }
            else
            {
                if (parameter == "title" || parameter == "")
                {
                    return _books.Find(book => book.title.ToString().Contains(query)).ToList();
                }
                else if (parameter == "auther")
                {
                    return _books.Find(book => book.author.ToString().Contains(query)).ToList();
                }
                else if (parameter == "library")
                {
                    return _books.Find(book => book.title.ToString().Contains(query)).ToList();

                }
            }
            return new List<Book>();
        }

        public List<Book> GetBooks()
        {
            return _books.Find(book=>true).ToList();
        }

        public void UpdateBook(string id, Book book)
        {
             _books.ReplaceOne(book => book.Id == id, book);
        }
    }
}
