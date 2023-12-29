using granthalaya.Services;
using Microsoft.AspNetCore.Mvc;
using granthalaya.Models;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace granthalaya.Controllers
{
    [Route("api/Libraries")]
    [ApiController]
    public class LibraryController : ControllerBase
    {
        private readonly ILibraryService _libraryService;
        public LibraryController(ILibraryService libraryService)
        {
            this._libraryService = libraryService;
        }
        // GET: api/<LibraryController>
        [HttpGet]
        public ActionResult<List<Library>> Get()
        {
            return _libraryService.GetLibraries();
        }

        // GET api/<LibraryController>/5
        [HttpGet("{id}")]
        public ActionResult<Library> Get(string id)
        {
            var library= _libraryService.GetLibraryById(id);
            if (library == null)
            {
                return NotFound($"Library with Id {id} not found!!");
            }
            return library;
        }

        // POST api/<LibraryController>
        [HttpPost]
        public ActionResult<Library> Post([FromBody] Library library)
        {
            _libraryService.CreateLibrary(library);
            return CreatedAtAction(nameof(Get), new { id = library.Id }, library);
        }

        // PUT api/<LibraryController>/5
        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] Library library)
        {
            var existingLibrary = _libraryService.GetLibraryById(id);
            if (existingLibrary == null)
            {
                return NotFound($"Library with Id {id} not found!!");
            }
            _libraryService.UpdateLibrary(id, library);
            return NoContent();
        }

        // DELETE api/<LibraryController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var existingLibrary = _libraryService.GetLibraryById(id);
            if (existingLibrary == null)
            {
                return NotFound($"Library with Id {id} not found!!");
            }
            _libraryService.DeleteLibrary(id);
            return Ok($"{existingLibrary.name} Library deleted!!");
        }
    }
}
