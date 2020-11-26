using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using KP_TimeSheet.MVC.Models;
using KP.TimeSheets.Persistance;

namespace KP_TimeSheet.MVC.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly RASContext _db;

        public HomeController(ILogger<HomeController> logger, RASContext context)
        {
            _db=context;
            _db.Tasks.Add(new KP.TimeSheets.Domain.Task(){
                ID=Guid.NewGuid(),
                Title="Task1"
            });
            _db.SaveChanges();
            _logger = logger;
        }

        public IActionResult Index()
        {
            var t = _db.Tasks.FirstOrDefault(t=>t.Title=="Task1");
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
