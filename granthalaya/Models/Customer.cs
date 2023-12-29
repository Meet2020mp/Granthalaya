using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace granthalaya.Models
{
    [BsonIgnoreExtraElements]
    public class Customer
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }=String.Empty;
        public String name { get; set; }
        public String email { get; set; }
        public String password { get; set; }
        public string phoneNumber { get; set; }
    }
}
