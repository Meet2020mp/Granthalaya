using granthalaya.Models;
using MongoDB.Driver;
namespace granthalaya.Services
{
    public class LibrarianService : ILibrarianService
    {
        private IMongoCollection<Librarian> _librarians;
        public LibrarianService(IGranthalaDatabaseSettings settings,IMongoClient mongoClient)
        {
            var dataabse = mongoClient.GetDatabase(settings.DatabaseName);
            _librarians = dataabse.GetCollection<Librarian>(settings.LibrarianCollectionName);
        }
        public Librarian CreateLibraraian(Librarian libraraian)
        {
            _librarians.InsertOne(libraraian);
            return libraraian;
        }

        public void DeleteLibrarian(string id)
        {
            _librarians.DeleteOne(x => x.Id == id);
        }

        public Librarian GetLibraraianById(string id)
        {
            return _librarians.Find(x => x.Id == id).FirstOrDefault();
        }

        public Librarian GetLibraraianByLibraryId(string libraryId)
        {
            return _librarians.Find(x => x.libraryId == libraryId).FirstOrDefault();
        }
        public Librarian GetLibraraianByName(string name)
        {
            return _librarians.Find(x => x.name == name).FirstOrDefault();
        }

        public List<Librarian> GetLibrarian()
        {
            return _librarians.Find(x => true).ToList();
        }

        public void UpdateLibrarian(string id, Librarian librarian)
        {
            _librarians.ReplaceOne(x => x.Id == id, librarian);
        }
    }
}
