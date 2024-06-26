﻿using granthalaya.Models;

namespace granthalaya.Services
{
    public interface ICustomerService
    {
        List<Customer> GetCustomers();
        int GetCustomersCount();
        Demographics GetDemographics();
        Customer GetCustomerById(string id);
        Customer GetCustomerByName(string name);
        Customer CreateCustomer(Customer customer);
        void UpdateCustomer(string id,Customer customer);
        void DeleteCustomer(string id);
        string Login(string name, string password);
    }
}
