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
    [Microsoft.AspNetCore.Mvc.Route("api/Confirm")]
    [ApiController]
    public class TimeSheetsConfirmApiController : MyBaseAPIController
    {
        IUnitOfWork _uow;
        public TimeSheetsConfirmApiController(RASContext db, IUnitOfWork uow) : base(db) { this._uow = uow; }
        

        [HttpGet("{userId}"),HttpGet("employee"),HttpGet("employeeTimeSheet/{fromDate}/{toDate}")]
        [ProducesResponseType(typeof(List<vmGetTimeSheetResualt>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetTimeSheet(Guid? userId, DateTime? fromDate, DateTime? toDate)
        {
            try
            {
                DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
                User currentUser = new UserHelper().GetCurrent(this._uow, this.UserName);

                if (!fromDate.HasValue)
                {

                    DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currentUser);


                    if (!fromDate.HasValue) fromDate = DateTime.Now.AddDays(-7);
                    if (!toDate.HasValue) toDate = DateTime.Now;

                    if (displayPeriod.IsWeekly)
                    {
                        fromDate = DateTime.Today.StartOfWeek(DayOfWeek.Saturday);
                        toDate = DateTime.Today.EndOfWeek(DayOfWeek.Friday);
                    }
                    else
                    {
                        toDate = fromDate.Value.AddDays(displayPeriod.NumOfDays);
                    }
                }

                IQueryable<Persistance.QueryEntities.EmployeeTimeSheetFromDB> query = null;

                if (userId.HasValue)
                {
                    query = this.DBContext.spFoundConfirmTimeSheet.FromSqlInterpolated(this.DBContext.spFoundConfirmTimeSheet_str(
                                        currentUser.ID,
                                        userId,
                                        fromDate.Value,
                                        toDate.Value
                                    ));
                }
                else
                {

                    query = this.DBContext.spFoundConfirmTimeSheet.FromSqlInterpolated(this.DBContext.spFoundEmployeeTimeSheet_str(
                                                            currentUser.ID,
                                                            fromDate.Value,
                                                            toDate.Value
                                                        ));
                }

                var items = await query.ToListAsync();

                var days = new string[] { "شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چارشنبه", "پنج شنبه", "جمعه" };

                var answer = items.GroupBy(g => g.Date)
                .Select(gg => new vmGetTimeSheetResualt
                {
                    date = gg.Key.Value,
                    isOpen = gg.FirstOrDefault().IsOpen ?? false,
                    dayTimeString=gg.FirstOrDefault().DayTimeString,
                    date_persian = gg.First().PersianDate,
                    day_persian = days[gg.First().DayOfWeek.Value],
                    hozoor = gg.First().Hozoor,
                    projects = gg.Where(p => p.ProjectId.HasValue).GroupBy(p => p.ProjectId).Select(pp => new vmGetTimeSheetResualt_Project
                    {
                        id = pp.Key,
                        title = pp.First().ProjectTitle,
                        workouts = pp.Where(w => w.TaskId.HasValue).GroupBy(w => new {w.TaskId,w.State}).Select(ww => new vmGetTimeSheetResualt_Workout
                        {
                            id = ww.Key.TaskId,
                            state = ww.Key.State,
                            title = ww.First().Title,
                            hours = ww.First().Hours
                        }).ToList()
                    }).ToList()
                }).ToList();

                return Ok(answer);
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در ثبت اطلاعات اقدام");
            }
        }

        [HttpGet("{type}/{userId}/{date}"),HttpGet("employee/{type}/{date}")]
        public async Task<IActionResult> GetPreviousPeriodConfirm(string type, Guid? userId, DateTime date)
        {
            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent(this._uow, this.UserName);
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currUser);

            DateTime fromDate;
            DateTime toDate;
            DateTime dt;

            if (type == "previous")
            {

                dt = date.AddDays(-1);

                fromDate = dt.AddDays(-displayPeriod.NumOfDays);
                toDate = dt;

            }
            else
            {

                dt = date.AddDays(1);

                fromDate = dt;
                toDate = dt.AddDays(displayPeriod.NumOfDays);
            }


            if (displayPeriod.IsWeekly)
            {
                fromDate = dt.StartOfWeek(DayOfWeek.Saturday);
                toDate = dt.EndOfWeek(DayOfWeek.Friday);
            }
            else
            {
                IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                if (presHours.Count() < displayPeriod.NumOfDays)
                {
                    fromDate = timeSheetManager.GetFirstPresenceHour().Date;
                    toDate = fromDate.AddDays(displayPeriod.NumOfDays);
                }
            }

            return await GetTimeSheet(userId, fromDate, toDate);
        }

        [HttpGet("[action]")]
        public IActionResult ChangeDisplayPeriodToWeeklyConfirm()
        {
            var currentUser = new UserHelper().GetCurrent(this._uow, this.UserName);
            DisplayPeriodManager dpm = new DisplayPeriodManager(this._uow);
            DisplayPeriod dp = new DisplayPeriod();
            dp = dpm.GetDisplayPeriod(currentUser);
            dp.IsWeekly = true;
            dpm.Edit(dp);

            return Ok(true);
        }

        [HttpPost("[action]")]
        public IActionResult ChangeDisplayPeriodToDaily(PeriodNumberDateJson period)
        {
            var currentUser = new UserHelper().GetCurrent(this._uow, this.UserName);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            var displayPeriod = DisplayPeriodUtilities.ConvertPeriodNumberDateJsonToDisplayPeriod(period, this._uow, currentUser);
            //SyncWithPWA(uow);

            displayPeriodMnager.Save(displayPeriod);
            return Ok(true);
        }



    }


}