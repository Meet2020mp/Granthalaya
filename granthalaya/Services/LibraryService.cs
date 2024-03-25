using granthalaya.Models;
using MongoDB.Driver;
namespace granthalaya.Services
{
    public class LibraryService : ILibraryService
    {
        private readonly IMongoCollection<Library> _libraries;
        public LibraryService(IGranthalaDatabaseSettings settings,IMongoClient mongoClient)  {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _libraries = database.GetCollection<Library>(settings.LibraryCollectionName);
        }
        public Library CreateLibrary(Library library)
        {
             _libraries.InsertOne(library);
            return library;
        }

        public void DeleteLibrary(string id)
        {
            _libraries.DeleteOne(library => library.Id == id);
        }

        public List<Library> GetLibraries()
        {
            return _libraries.Find(library=>true).ToList();
        }
        public int GetLibrariesCount()
        {
            return _libraries.Find(library => true).ToList().Count();
        }

        public Library GetLibraryById(string id)
        {
            return _libraries.Find(library=>library.Id == id).FirstOrDefault();
    
        }

        public Library GetLibraryByName(string name)
        {
            return _libraries.Find(library => library.name == name).FirstOrDefault();
        }

        public void UpdateLibrary(string id, Library library)
        {
            _libraries.ReplaceOne(library => library.Id == id, library);
        }
    }
}
