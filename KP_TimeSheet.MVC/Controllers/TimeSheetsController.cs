
using Microsoft.AspNetCore.Mvc;

namespace KP.TimeSheets.MVC.Controllers
{
    public class TimeSheetsController : Controller
    {
        
        public ActionResult Register()
        {
            return View();
        }

        public ActionResult Confirmation()
        {
            return View();
        }

    }
}