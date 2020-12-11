using Microsoft.AspNetCore.Mvc;
using KP.TimeSheets.Domain;

namespace KP.TimeSheets.MVC.Controllers
{
    public class TimeSheetsController : BaseController
    {
        public TimeSheetsController(IUnitOfWork uow):base(uow){}
        
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