using NuGet.ProjectModel;
namespace granthalaya.Models
{
    public class GranthalayaDatabaseSettings : IGranthalaDatabaseSettings
    {
        public string DatabaseName { get; set; }=string.Empty;
        public string ConnectionString { get; set; }=string.Empty;
        public string CustomerCollectionName { get; set; }=string.Empty;
        public string LibrarianCollectionName { get; set; } = string.Empty;
        public string LibraryCollectionName { get; set; } = string.Empty;
        public string BookCollectionName { get; set; } = string.Empty;
        public string BorrowedBookCollectionName { get; set; } = string.Empty;
    }
}
