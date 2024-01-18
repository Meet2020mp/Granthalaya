using System.Linq.Expressions;
using granthalaya.Models;
using granthalaya.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace granthalaya.Controllers
{
    [Authorize]
    [Route("api/Librarians")]
    [ApiController]
    public class LibrarianController : ControllerBase
    {
        private readonly ILibrarianService _librarianService;
        public LibrarianController(ILibrarianService libraraianService)
        {
            this._librarianService = libraraianService;
        }
        // GET: api/<LibrarianController>
        [HttpGet]
        public ActionResult<List<Librarian>> Get()
        {
            return _librarianService.GetLibrarian();
        }

        // GET api/<LibrarianController>/5
        [HttpGet("{name}")]
        public ActionResult<Librarian> Get(string name)
        {
            var librarian = _librarianService.GetLibraraianByName(name);
            if (librarian == null)
            {
                return NotFound($"Librarian not exist!!");
            }
            return librarian;
        }
        [AllowAnonymous]
        [HttpPost("Login")]
        public ActionResult<string> Login([FromBody] LoginDTO login)
        {
            return _librarianService.Login(login.name, login.password);
        }
        [AllowAnonymous]
        // POST api/<LibrarianController>
        [HttpPost]
        public ActionResult<Librarian> Post([FromBody] Librarian librarian)
        {
            Librarian l = _librarianService.GetLibraraianByName(librarian.name);
            if (l != null)
            {
                return null;
            }
            _librarianService.CreateLibraraian(librarian);
            return CreatedAtAction(nameof(Get), new { id = librarian.Id }, librarian);
        }

        // PUT api/<LibrarianController>/5
        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] Librarian librarian)
        {
            var librarian1 = _librarianService.GetLibraraianById(id);
            if (librarian1 == null)
            {
                return NotFound($"Librarian with Id {id} not exist!!");
            }
            _librarianService.UpdateLibrarian(id, librarian);
            return NoContent();
        }

        // DELETE api/<LibrarianController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var librarian = _librarianService.GetLibraraianById(id);
            if (librarian == null)
            {
                return NotFound($"Librarian with Id {id} not exist!!");
            }
            _librarianService.DeleteLibrarian(id);
            return Ok($"{librarian.name} Librarian deleted!!");
        }
    }
}
