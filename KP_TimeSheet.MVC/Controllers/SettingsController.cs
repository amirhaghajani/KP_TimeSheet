using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using KP.TimeSheets.Domain;
using KP.TimeSheets.Persistance;
using KP.TimeSheets.MVC;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace KP.TimeSheets.MVC.Controllers
{
    public class SettingsController : BaseController
    {
       public SettingsController(IUnitOfWork uow) : base(uow) { }
        public ActionResult Calendar()
        {
            return View();
        }

        public ActionResult ProjectsCalendars()
        {
            return View();
        }

        public ActionResult Departments()
        {
            return View();
        }
    }
}
