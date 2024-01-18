using granthalaya.Models;
using granthalaya.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace granthalaya.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }
        // GET: api/<ReviewController>
        [HttpGet]
        public ActionResult<List<Review>> Get()
        {
            return _reviewService.GetReviews();
        }

        // GET api/<ReviewController>/5
        [HttpGet("{id}")]
        public ActionResult<Review> Get(string id)
        {
            return _reviewService.GetReview(id);
        }
        [AllowAnonymous]
        [HttpGet("ByBook/{bookId}")]
        public ActionResult<List<Review>> GetByBook(string bookId)
        {
            return _reviewService.GetReviewsByQuery(bookId);
        }
        [HttpGet("ByCustomer/{customerName}")]
        public ActionResult<List<Review>> GetByCustomer(string customerName)
        {
            return _reviewService.GetReviewsByCustomerName(customerName);
        }
        // POST api/<ReviewController>
        [HttpPost]
        public ActionResult<Review> Post([FromBody] Review review)
        {
            _reviewService.CreateReview(review);
            return review;
        }

        // PUT api/<ReviewController>/5
        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] Review review)
        {
            var existingReview = _reviewService.GetReview(id);
            if (existingReview == null)
            {
                return NotFound("Review not found!!");
            }
            _reviewService.UpdateReview(id, review);
            return NoContent();
        }

        // DELETE api/<ReviewController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var existingReview = _reviewService.GetReview(id);
            if (existingReview == null)
            {
                return NotFound("Review not found!!");
            }
            _reviewService.DeleteReview(id);
            return Ok("Review Deleted");
        }
    }
}
