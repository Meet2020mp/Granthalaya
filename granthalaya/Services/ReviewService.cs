using System.Net;
using granthalaya.Models;
using MongoDB.Driver;
namespace granthalaya.Services
{
    public class ReviewService : IReviewService
    {
        IMongoCollection<Review> _reviews;
        public ReviewService(IGranthalaDatabaseSettings settings,IMongoClient mongoClient)
        {
            var database=mongoClient.GetDatabase(settings.DatabaseName);
            _reviews = database.GetCollection<Review>(settings.ReviewCollectionName);
        }
        public Review CreateReview(Review review)
        {
            _reviews.InsertOne(review);
            return review;
        }

        public void DeleteReview(string id)
        {
            _reviews.DeleteOne(review => review.Id == id);
        }

        public Review GetReview(string id)
        {
            return _reviews.Find(review => review.Id == id).FirstOrDefault();
        }

        public List<Review> GetReviews()
        {
            return _reviews.Find(review=>true).ToList();
        }

        public void UpdateReview(string id, Review review)
        {
            _reviews.ReplaceOne(review => review.Id == id, review);
        }

        List<Review> IReviewService.GetReviewsByCustomerName(string customerName)
        {
            return _reviews.Find(review =>review.customerName == customerName).ToList();
        }

        List<Review> IReviewService.GetReviewsByQuery(string bookId)
        {
            return _reviews.Find(review => review.bookId == bookId).ToList();
        }
    }
}
