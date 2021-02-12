using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using KP.TimeSheets.Domain;
using KP.TimeSheets.MVC.ViewModels;
using KP.TimeSheets.Persistance;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace KP.TimeSheets.MVC
{
    [Microsoft.AspNetCore.Mvc.Route("api/timesheetPlicy")]
    [ApiController]
    public class TimeSheetPolicyApiController : MyBaseAPIController
    {
        IUnitOfWork _uow;
        public TimeSheetPolicyApiController(RASContext db, IUnitOfWork uow) : base(db) { this._uow = uow; }


        [HttpGet("{ver}/[action]")]
        [ProducesResponseType(typeof(List<vmGetTimeSheetResualt>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetDefaultPoliciesList(string ver)
        {
            try
            {
                if (!this.MainChecks(ver, out string error)) throw new Exception(error);

                var now = DateTime.Now.Date;
                var answer = this.DBContext.TimesheetPolicies
                            .Where(p => p.IsDefault && p.Validity.Date >= now && p.UserId.HasValue)
                            .OrderBy(p => p.User.UserTitle)
                            .Select(p => new
                            {
                                p.Id,
                                p.isDeactivated,
                                p.IsOpen,
                                p.Start,
                                p.Finish,
                                p.User.UserTitle,
                                p.UserId,
                                p.Validity,
                                p.UserMustHasHozoor,
                                p.CreateDate
                            }).ToList().Select(p => new vmTimesheetPolicy
                            {
                                id = p.Id,
                                finish = DateUtility.GetPersianDate(p.Finish),
                                isDeactivated = p.isDeactivated,
                                createDate = DateUtility.GetPersianDate(p.CreateDate),
                                isOpen = p.IsOpen,
                                start = DateUtility.GetPersianDate(p.Start),
                                userId = p.UserId,
                                userTitle = p.UserTitle,
                                userMustHasHozoor = p.UserMustHasHozoor,
                                validity = DateUtility.GetPersianDate(p.Validity)
                            });


                return Ok(answer);
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در دریافت اطلاعات تایم شیت");
            }
        }

        [HttpGet("{ver}/[action]")]
        [ProducesResponseType(typeof(List<vmGetTimeSheetResualt>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetOtherPoliciesList(string ver)
        {
            try
            {
                if (!this.MainChecks(ver, out string error)) throw new Exception(error);

                var now = DateTime.Now.Date;
                var answer = this.DBContext.TimesheetPolicies
                            .Where(p => !p.IsDefault && p.Validity.Date >= now && p.UserId.HasValue)
                            .OrderByDescending(p => p.CreateDate)
                            .Select(p => new
                            {
                                p.Id,
                                p.isDeactivated,
                                p.IsOpen,
                                p.Start,
                                p.Finish,
                                p.User.UserTitle,
                                p.UserId,
                                p.Validity,
                                p.UserMustHasHozoor,
                                p.CreateDate
                            }).ToList().Select(p => new vmTimesheetPolicy
                            {
                                id = p.Id,
                                finish = DateUtility.GetPersianDate(p.Finish),
                                isDeactivated = p.isDeactivated,
                                createDate = DateUtility.GetPersianDate(p.CreateDate) + " " + p.CreateDate.Hour.ToString("00") + ":" + p.CreateDate.Minute.ToString("00"),
                                isOpen = p.IsOpen,
                                start = DateUtility.GetPersianDate(p.Start),
                                userId = p.UserId,
                                userTitle = p.UserTitle,
                                userMustHasHozoor = p.UserMustHasHozoor,
                                validity = DateUtility.GetPersianDate(p.Validity)
                            });
                return Ok(answer);
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در دریافت اطلاعات تایم شیت");
            }
        }




    }
}