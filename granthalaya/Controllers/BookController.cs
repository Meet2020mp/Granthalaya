using granthalaya.Models;
using granthalaya.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace granthalaya.Controllers
{
    [Route("api/Books")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public BookController(IBookService bookService,IWebHostEnvironment hostEnvironment)
        {
            this._bookService = bookService;
            this._hostingEnvironment = hostEnvironment;
        }
        // GET: api/<BookController>
        [AllowAnonymous]
        [HttpGet]
        public ActionResult<List<Book>> Get()
        {
            return _bookService.GetBooks();
        }
        [AllowAnonymous]
        // GET api/<BookController>/5
        [HttpGet("{id}")]
        public ActionResult<Book> Get(string id)
        {
            var book=_bookService.GetBook(id);
            if (book == null)
            {
                return NotFound($"Book with Id {id} not found!!");
            }
            return book;
        }
        [AllowAnonymous]
        [HttpGet("ByQuery/{parameter}/{query}/{libraryName}")]
        public ActionResult<List<Book>> GetBooksByQuery(string parameter,string query, string? libraryName)
        {
                var books = _bookService.GetBookByQuery(parameter,query, libraryName);
                if (books == null)
                {
                    return NotFound("Sorry no book found!!");
                }
            return books;
        }
        [AllowAnonymous]
        [HttpGet("ByLibraryName/{libraryName}")]
        public ActionResult<List<Book>> GetBooksOfLibrary(string libraryName)
        {
            var books=_bookService.GetBookBylibraryName(libraryName);
            if (books == null)
            {
                return NotFound("No books found for library!!");
            }
            return books;
        }
        [Authorize(Roles = "Librarian")]

        // POST api/<BookController>
        [HttpPost]
        public async Task<ActionResult<Book>> Post([FromForm] Book book)
        {
            string imageName = await SaveImage(book.image);
            book.imageName = String.Format("{0}://{1}{2}/img/{3}", Request.Scheme, Request.Host, Request.PathBase, imageName);
            _bookService.CreateBook(book);
            return CreatedAtAction(nameof(Get), new { id = book.Id }, book);
        }
        [Authorize(Roles = "Librarian")]

        // PUT api/<BookController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, [FromForm] Book book)
        {
            if (id != book.Id)
            {
                return BadRequest();
            }
            var existingBook=_bookService.GetBook(id);
            if (existingBook == null)
            {
                return NotFound($"Book with Id {id} not foound!!");
            }
            try
            {
                if (book.image != null)
                {
                    string imageName = await SaveImage(book.image);
                    book.imageName = String.Format("{0}://{1}{2}/img/{3}", Request.Scheme, Request.Host, Request.PathBase, imageName);
                }
                _bookService.UpdateBook(id, book);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return NoContent();
        }
        [Authorize(Roles = "Librarian")]

        // DELETE api/<BookController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var existingBook = _bookService.GetBook(id);
            if (existingBook == null)
            {
                return NotFound($"Book with Id {id} not foound!!");
            }
            _bookService.DeleteBook(id);
            return Ok($"{existingBook.title} Book deleted");

        }
        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = new string(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.FileName);
            var imagePath = Path.Combine(_hostingEnvironment.ContentRootPath, "img", imageName);
            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }
            return imageName;
        }
    }
}
