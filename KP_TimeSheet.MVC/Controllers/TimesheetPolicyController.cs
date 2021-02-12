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
    public class TimesheetPolicyController : BaseController
    {
        private readonly ILogger<HomeController> _logger;

        public TimesheetPolicyController(ILogger<HomeController> logger,
                            RASContext context, IUnitOfWork uow) : base(uow)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}


