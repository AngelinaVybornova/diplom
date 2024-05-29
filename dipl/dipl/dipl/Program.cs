using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors(builder =>
    builder.WithOrigins("http://localhost:4200")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowAnyOrigin()
);

app.Run();
/*var app = builder.Build();
app.UseRouting();

app.UseEndpoints(endpoints => {
    endpoints.MapControllers();
});*/



/*WebHost.CreateDefaultBuilder(args)
        .UseUrls("http://localhost:5000/");*/
