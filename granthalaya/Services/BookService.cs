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

        public List<Book> GetBookBylibraryName(string libraryName)
        {
            return _books.Find(book => book.libraryName == libraryName).ToList();
        }

        public List<Book> GetBookByQuery(string? parameter,string query, string? libraryName)
        {
            if (libraryName != "0")
            {
                Console.WriteLine("Hello");
                if (parameter == "title" || parameter == "")
                {
                    return _books.Find(book => book.title.ToString().ToLower().Contains(query.ToLower()) && book.libraryName == libraryName).ToList();
                }
                else if (parameter == "auther")
                {
                    return _books.Find(book => book.author.ToString().ToLower().Contains(query.ToLower()) && book.libraryName == libraryName).ToList();
                }
                else if (parameter == "library")
                {
                    return _books.Find(book=>book.libraryName == libraryName).ToList();

                }
            }
            else
            {
                if (parameter == "title" || parameter == "")
                {
                    Console.WriteLine("Hello");
                    return _books.Find(book => book.title.ToString().ToLower().Contains(query.ToLower())).ToList();
                }
                else if (parameter == "auther")
                {
                    return _books.Find(book => book.author.ToString().ToLower().Contains(query.ToLower())).ToList();
                }
                else if (parameter == "library")
                {
                    return _books.Find(book => book.libraryName.ToString().ToLower().Contains(query.ToLower())).ToList();

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
