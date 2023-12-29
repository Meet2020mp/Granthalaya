﻿using granthalaya.Models;
using granthalaya.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace granthalaya.Controllers
{
    [Route("api/Customers")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        // GET: api/<CustomerController>
        public CustomerController(ICustomerService customerService)
        {
            this._customerService = customerService;
        }
        [HttpGet]
        public ActionResult<List<Customer>> Get()
        {
            return _customerService.GetCustomers();
        }

        // GET api/<CustomerController>/5
        [HttpGet("{name}")]
        public ActionResult<Customer> Get(string name)
        {
            var customer= _customerService.GetCustomerByName(name);
            if (customer == null)
            {
                return NotFound("Customer not exist!!");
            }
            return customer;
        }

        // POST api/<CustomerController>
        [HttpPost]
        public ActionResult<Customer> Post([FromBody] Customer customer)
        {
             _customerService.CreateCustomer(customer);
            return CreatedAtAction(nameof(Get), new {id=customer.Id}, customer);
        }

        // PUT api/<CustomerController>/5
        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] Customer customer)
        {
            var customer1 = _customerService.GetCustomerById(id);
            if (customer1 == null)
            {
                return NotFound($"Customer with Id={id} not exist!!");
            }
            _customerService.UpdateCustomer(id, customer);
            return NoContent();
        }

        // DELETE api/<CustomerController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var customer1 = _customerService.GetCustomerById(id);
            if (customer1 == null)
            {
                return NotFound($"Customer with Id={id} not exist!!");
            }
            _customerService.DeleteCustomer(id);
            return Ok($"Customer with Id={id} deleted!!");

        }
    }
}
