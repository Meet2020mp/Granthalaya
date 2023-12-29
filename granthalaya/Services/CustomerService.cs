using granthalaya.Models;
using MongoDB.Driver;
namespace granthalaya.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IMongoCollection<Customer> _customers;
        public CustomerService(IGranthalaDatabaseSettings settings,IMongoClient mongoClient)
        {
            var database= mongoClient.GetDatabase(settings.DatabaseName);
            _customers=database.GetCollection<Customer>(settings.CustomerCollectionName);
        }
        public Customer CreateCustomer(Customer customer)
        {
            _customers.InsertOne(customer);
            return customer;
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

        public void UpdateCustomer(string id, Customer customer)
        {
            _customers.ReplaceOne(x=>x.Id==id, customer);
        }
    }
}
