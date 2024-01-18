using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace granthalaya.Models
{
    [BsonIgnoreExtraElements]
    public class Admin
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = String.Empty;
        public string name { get; set; }
        public string password { get; set; }
        public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
        public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();
        public String role { get; set; } = String.Empty;

    }
}
