namespace granthalaya.Models
{
    public interface IGranthalaDatabaseSettings
    {
        string CustomerCollectionName { get; set; }
        string LibrarianCollectionName { get; set; }
        string LibraryCollectionName { get; set; }
        string BookCollectionName { get; set; }
        string BorrowedBookCollectionName { get; set; }

        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
        string ReviewCollectionName { get; set; }
        string Token { get; set; }
    }
}
