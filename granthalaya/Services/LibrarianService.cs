using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using granthalaya.Models;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
namespace granthalaya.Services
{
    public class LibrarianService : ILibrarianService
    {
        private IMongoCollection<Librarian> _librarians;
        private readonly IGranthalaDatabaseSettings _settings;

        public LibrarianService(IGranthalaDatabaseSettings settings,IMongoClient mongoClient)
        {
            _settings = settings;
            var dataabse = mongoClient.GetDatabase(settings.DatabaseName);
            _librarians = dataabse.GetCollection<Librarian>(settings.LibrarianCollectionName);
        }
        public Librarian CreateLibraraian(Librarian libraraian)
        {
            CreatePasswordHash(libraraian.password, out byte[] passwordHash, out byte[] passwordSalt);
            libraraian.PasswordHash = passwordHash;
            libraraian.PasswordSalt = passwordSalt; 
            _librarians.InsertOne(libraraian);
            return libraraian;
        }

        public void DeleteLibrarian(string id)
        {
            _librarians.DeleteOne(x => x.Id == id);
        }

        public Librarian GetLibraraianById(string id)
        {
            return _librarians.Find(x => x.Id == id).FirstOrDefault();
        }

        public Librarian GetLibraraianBylibraryName(string libraryName)
        {
            return _librarians.Find(x => x.libraryName == libraryName).FirstOrDefault();
        }
        public Librarian GetLibraraianByName(string name)
        {
            return _librarians.Find(x => x.name == name).FirstOrDefault();
        }

        public List<Librarian> GetLibrarian()
        {
            return _librarians.Find(x => true).ToList();
        }

        public void UpdateLibrarian(string id, Librarian librarian)
        {
            _librarians.ReplaceOne(x => x.Id == id, librarian);
        }
        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        public bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computeHash.SequenceEqual(passwordHash);
            }
        }

        public string CreateToken(Librarian user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.GivenName, user.libraryName),
                new Claim(ClaimTypes.Name, user.name),
                new Claim(ClaimTypes.Role,user.role)
            };

            var appSettingsToken = _settings.Token;
            if (appSettingsToken == null)
            {
                throw new Exception("AppSettings Token is null");
            }
            SymmetricSecurityKey symmetricSecurityKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(appSettingsToken));
            SigningCredentials signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = signingCredentials
            };
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(securityToken);

        }
        public string Login(string name, string password)
        {
            Librarian user = _librarians.Find(x => x.name == name).FirstOrDefault();
            if (user == null)
            {
                return null;
            }
            else if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }
            else
            {
                string token = CreateToken(user) + "$#:" + user.libraryName;
                return token;
            }
        }
    }
}
