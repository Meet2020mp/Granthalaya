﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace granthalaya.Models
{
    [BsonIgnoreExtraElements]

    public class BorrowedBook
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = String.Empty;
        [BsonRepresentation(BsonType.ObjectId)]
        public string bookId { get; set; }
        public string bookName { get; set; }
        public string bookImage { get; set; }
        public string libraryName { get; set; }
        public DateTime issueDate { get; set; }
        public DateTime dueDate { get; set; }
        public DateTime? returnDate { get; set; }
        public int fine { get; set; }
        public string? customerName { get; set; }
    }
}
