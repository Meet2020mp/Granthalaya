using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using granthalaya.Models;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
namespace granthalaya.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IMongoCollection<Customer> _customers;
        private readonly IGranthalaDatabaseSettings _settings;
        private readonly IMongoClient _mongoClient;
        public CustomerService(IGranthalaDatabaseSettings settings,IMongoClient mongoClient)
        {
            _settings = settings;
            _mongoClient = mongoClient;
            var database= mongoClient.GetDatabase(settings.DatabaseName);
            _customers=database.GetCollection<Customer>(settings.CustomerCollectionName);
        }
        public Customer CreateCustomer(Customer customer)
        {   
            CreatePasswordHash(customer.password, out byte[] passwordHash, out byte[] passwordSalt);
            customer.PasswordHash = passwordHash;
            customer.PasswordSalt = passwordSalt;
            _customers.InsertOne(customer);
            return customer;
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

        public string CreateToken(Customer user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
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
        public void DeleteCustomer(string id)
        {
            _customers.DeleteOne(x=>x.Id==id);
        }

        public Customer GetCustomerById(string id)
        {
            return _customers.Find(x => x.Id == id).FirstOrDefault();
        }

        public Customer GetCustomerByName(string name)
        {
            return  _customers.Find(x => x.name == name).FirstOrDefault();

        }

        public List<Customer> GetCustomers()
        {
            return _customers.Find(x => true).ToList();
        }
        public int GetCustomersCount()
        {
            return _customers.Find(x => true).ToList().Count();
        }
        public Demographics GetDemographics()
        {
            KeyFunctions functions = new KeyFunctions(_settings, _mongoClient);
            return functions.GetDemographics();
        }
        public void UpdateCustomer(string id, Customer customer)
        {
            _customers.ReplaceOne(x=>x.Id==id, customer);
        }

        public string Login(string name, string password)
        {
            Customer user= _customers.Find(x=>x.name==name).FirstOrDefault();
            if (user == null)
            {
                return null;
            }
            else if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                Console.WriteLine("in else if");
                return null;
            }
            else
                return CreateToken(user);
        }
    }
}
