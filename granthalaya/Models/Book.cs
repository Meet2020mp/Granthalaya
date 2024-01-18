using System.ComponentModel.DataAnnotations.Schema;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace granthalaya.Models
{
    [BsonIgnoreExtraElements]

    public class Book
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = String.Empty;
        public string title { get; set; }
        public DateTime publishDate { get; set; }
        public String author { get; set; }
        public String description { get; set; }=String.Empty;
        public int price { get; set; }
        public int quantity { get; set; }
        public string libraryName { get; set; }
        public string imageName { get; set; } = String.Empty;
        [BsonIgnore]
        public IFormFile? image { get; set; } = null;
    }
}
