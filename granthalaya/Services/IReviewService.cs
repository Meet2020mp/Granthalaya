using granthalaya.Models;

namespace granthalaya.Services
{
    public interface IReviewService
    {
        List<Review> GetReviews();
        Review GetReview(string id);
        List<Review> GetReviewsByQuery(string bookId);
        List<Review> GetReviewsByCustomerName(string customerName);
        void UpdateReview(string id,Review review);
        Review CreateReview(Review review);
        void DeleteReview(string id);
    }
}
