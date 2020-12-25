using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using KP_TimeSheet.MVC.Models;
using KP.TimeSheets.Persistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using KP.TimeSheets.Domain;

namespace KP_TimeSheet.MVC.Controllers
{
    public class HomeController : BaseController
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger,
        RASContext context, IUnitOfWork uow) : base(uow)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public ActionResult Sync()
        {
            try
            {
                this.UOW.ProjectRepository.Sync();
                this.UOW.SaveChanges();
                ViewBag.Message = "همکام سازی با موفقیت انجام شد";
            }
            catch (Exception ex)
            {
                ViewBag.Message ="خطا در همگام سازی: " + ex.Message;
            }
            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }






        //cookie ------------------------------------------
        private string cookie_Get(string key)
        {
            return Request.Cookies[key];
        }

        private void cookie_Set(string key, string value, DateTime? expireTime)
        {
            var option = new Microsoft.AspNetCore.Http.CookieOptions();
            if (expireTime.HasValue)
                option.Expires = expireTime.Value;
            else
                option.Expires = DateTime.Now.AddMilliseconds(10);
            Response.Cookies.Append(key, value, option);
        }

        private void cookie_Remove(string key)
        {
            Response.Cookies.Delete(key);
        }
    }
}


