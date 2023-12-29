using granthalaya.Models;

namespace granthalaya.Services
{
    public interface ILibraryService
    {
        List<Library> GetLibraries();
        Library GetLibraryByName(string name);
        Library GetLibraryById(string id);
        Library CreateLibrary(Library library);
        void UpdateLibrary(string id,Library library);
        void DeleteLibrary(string id);
    }
}
