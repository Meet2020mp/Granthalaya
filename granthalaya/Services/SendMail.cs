using System.Net.Mail;
using System.Net;

namespace granthalaya.Services
{
    public class SendMail
    {
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
    }
}
