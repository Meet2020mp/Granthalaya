using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace granthalaya.Models
{
    [BsonIgnoreExtraElements]
    public class Review
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = String.Empty;
        public string feedBack { get; set; }=String.Empty;
        public float rating { get; set; }
        public DateTime time { get; set; }=DateTime.UtcNow;
        public string customerName { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string bookId { get; set; } = String.Empty;
    }
}
