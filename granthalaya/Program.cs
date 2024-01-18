using granthalaya.Models;
using granthalaya.Services;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000", "http://*:3000").AllowAnyMethod().AllowAnyHeader();
                      });
});
// Add services to the container.

builder.Services.Configure<GranthalayaDatabaseSettings>(
                builder.Configuration.GetSection(nameof(GranthalayaDatabaseSettings)));

builder.Services.AddSingleton<IGranthalaDatabaseSettings>(sp =>
    sp.GetRequiredService<IOptions<GranthalayaDatabaseSettings>>().Value);

builder.Services.AddSingleton<IMongoClient>(s =>
        new MongoClient(builder.Configuration.GetValue<string>("GranthalayaDatabaseSettings:ConnectionString")));

builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<ILibrarianService, LibrarianService>();
builder.Services.AddScoped<ILibraryService, LibraryService>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IBorrowedBookService, BorrowedBoookService>();
builder.Services.AddScoped<IReviewService, ReviewService>();

builder.Services.AddControllers();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opts =>
{
    opts.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration.GetSection("GranthalayaDatabaseSettings:Token").Value!)),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("oauth2", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "standard authorization using bearer scheme",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
    });
    c.OperationFilter<SecurityRequirementsOperationFilter>();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "img")),
    RequestPath = "/img"
});
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization(); 
app.UseCors(MyAllowSpecificOrigins);

app.MapControllers();

app.Run();
