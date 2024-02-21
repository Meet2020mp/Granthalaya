using System.Net.Mail;
using System.Net;
using granthalaya.Models;
using MongoDB.Driver;

namespace granthalaya.Services
{
    public class KeyFunctions
    {
        private readonly IMongoCollection<Book> _books;
        private readonly IMongoCollection<Library> _libraries;
        private readonly IMongoCollection<Customer> _customers;
        public KeyFunctions(IGranthalaDatabaseSettings settings,IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _books = database.GetCollection<Book>(settings.BookCollectionName);
            _libraries = database.GetCollection<Library>(settings.LibraryCollectionName);
            _customers = database.GetCollection<Customer>(settings.CustomerCollectionName);
        }
        public static int MailSender(string email, string userName)
        {
            string fromMail = "samplephpsendmail@gmail.com";
            string fromPassword = "citsfizjinfpktif";
            Random random = new Random();
            var otp = random.Next(10000,99999);
            MailMessage message = new MailMessage();
            message.From = new MailAddress(fromMail);
            message.Subject = "OTP From Granthalaya!!";
            message.To.Add(new MailAddress(email));
            message.Body = "<html><body> <p>Hello "+userName+"</p></br> <p>OTP is <b>"+otp+"</b> for Granthalaya signup. </p></br><p>Do not share it with anyone for security reason.</p></body></html>";
            message.IsBodyHtml = true;

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(fromMail, fromPassword),
                EnableSsl = true,
            };

            smtpClient.Send(message);
            return otp;
        }
        public Demographics GetDemographics()
        {
            Demographics demographics = new Demographics();
            demographics.books = _books.Find(b=>true).ToList().Count();
            demographics.libraries = _libraries.Find(l => true).ToList().Count();
            demographics.customers = _customers.Find(c => true).ToList().Count();
            return demographics;
        }
    }
}
