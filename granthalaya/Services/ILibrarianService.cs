using granthalaya.Models;

namespace granthalaya.Services
{
    public interface ILibrarianService
    {
        List<Librarian> GetLibrarian();
        Librarian GetLibraraianById(string id);
        Librarian GetLibraraianByName(string name);

        Librarian GetLibraraianBylibraryName(string name);
        Librarian CreateLibraraian(Librarian libraraian);
        void UpdateLibrarian(string id, Librarian librarian);
        void DeleteLibrarian(string id);
        string Login(string name, string password);
    }
}
