using granthalaya.Models;
using granthalaya.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace granthalaya.Controllers
{
    [Route("api/BorrowedBooks")]
    [ApiController]
    public class BorrowedBookController : ControllerBase
    {
        private readonly IBorrowedBookService _borrowedBookService;
        public BorrowedBookController(IBorrowedBookService borrowedBookService)
        {
            this._borrowedBookService = borrowedBookService;
        }
        // GET: api/<BorrowedBookController>
        [HttpGet]
        public ActionResult<List<BorrowedBook>> Get()
        {
            return _borrowedBookService.GetBorrowedBooks();
        }

        // GET api/<BorrowedBookController>/5
        [HttpGet("{id}")]
        public ActionResult<BorrowedBook> Get(string id)
        {
            return _borrowedBookService.GetBorrowedBook(id);
        }
        [HttpGet("ByCustomerId/{cid}")]
        public ActionResult<List<BorrowedBook>> GetByCustomerId(string cid)
        {
            return _borrowedBookService.GetBorrowedBooksByCustomerId(cid);
        }
        [HttpGet("ByLibraryId/{lid}")]
        public ActionResult<List<BorrowedBook>> GetByLibraryId(string lid)
        {
            return _borrowedBookService.GetBorrowedBooksBylibraryId(lid);
        }
        // POST api/<BorrowedBookController>m
        [HttpPost]
        public ActionResult<BorrowedBook> Post([FromBody] BorrowedBook book)
        {
            _borrowedBookService.CreateBorrowedBook(book);
            return CreatedAtAction(nameof(Get), new { id = book.Id }, book);
        }

        // PUT api/<BorrowedBookController>/5
        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] BorrowedBook book)
        {
            var existingBook = _borrowedBookService.GetBorrowedBook(id);
            if (existingBook == null)
            {
                return NotFound("Book not found!!");
            }
            _borrowedBookService.UpdateBorrowedBook(id, book);
            return NoContent();
        }

        // DELETE api/<BorrowedBookController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var existingBook = _borrowedBookService.GetBorrowedBook(id);
            if (existingBook == null)
            {
                return NotFound("Book not found!!");
            }
            _borrowedBookService.DeleteBorrowedBook(id);
            return Ok("Book deleted");
        }
    }
}
