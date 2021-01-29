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
    [Microsoft.AspNetCore.Mvc.Route("api/timesheetsNew")]
    [ApiController]
    public class TimeSheetsApiNewController : MyBaseAPIController
    {
        IUnitOfWork _uow;
        public TimeSheetsApiNewController(RASContext db, IUnitOfWork uow) : base(db) { this._uow = uow; }


        [HttpGet("{ver}/{userId}"), HttpGet("{ver}/employee"), HttpGet("{ver}/employeeTimeSheet/{fromDate}/{toDate}")]
        [ProducesResponseType(typeof(List<vmGetTimeSheetResualt>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetTimeSheet(string ver, Guid? userId, DateTime? fromDate, DateTime? toDate)
        {
            var isWantingApprove=userId.HasValue;

            try
            {
                if (!this.MainChecks(ver, out string error)) throw new Exception(error);

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

                if (isWantingApprove)
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

                var days = new string[] { "شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه" };

                var answer = items.GroupBy(g => g.Date)
                .Select(gg => new vmGetTimeSheetResualt
                {
                    date = gg.Key.Value,
                    isOpen = gg.FirstOrDefault().IsOpen ?? false,
                    dayTimeString = gg.FirstOrDefault().DayTimeString,
                    date_persian = gg.First().PersianDate,
                    day_persian = days[gg.First().DayOfWeek.Value],
                    hozoor = gg.First().Hozoor,
                    projects = gg.Where(p =>p.Type=="Work" && p.ProjectId.HasValue)
                    .GroupBy(p => p.ProjectId).Select(pp => new vmGetTimeSheetResualt_Project
                    {
                        id = pp.Key,
                        title = pp.First().ProjectTitle,
                        workouts = pp.Where(w => w.TaskId.HasValue)
                        .GroupBy(w => new { w.TaskId, w.State }).Select(ww => new vmGetTimeSheetResualt_Workout
                        {
                            id = ww.Key.TaskId,
                            state = ww.Key.State,
                            title = ww.First().Title,
                            minutes = ww.First().Minutes
                        }).ToList()
                    }).ToList(),

                    others = gg.Where(p =>p.Type=="Other" && p.ProjectId.HasValue)
                    .GroupBy(p => p.State).Select(pp => new vmGetTimeSheetResualt_Project
                    {
                        id = pp.First().ProjectId,
                        title = pp.Key,
                        workouts = pp.Where(w => w.TaskId.HasValue)
                        .GroupBy(w => w.TaskId).Select(ww => new vmGetTimeSheetResualt_Workout
                        {
                            id = ww.First().TaskId,
                            state = ww.First().State,
                            title = ww.First().Title,
                            minutes = ww.Sum(www => www.Minutes)
                        }).ToList()
                    }).ToList()

                }).ToList();

                return Ok(answer);
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در دریافت اطلاعات تایم شیت");
            }
        }

        [HttpGet("{ver}/{type}/{userId}/{date}"), HttpGet("{ver}/employee/{type}/{date}")]
        public async Task<IActionResult> GetPreviousPeriodConfirm(string ver, string type, Guid? userId, DateTime date)
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

            return await GetTimeSheet(ver, userId, fromDate, toDate);
        }

        [HttpGet("[action]")]
        public IActionResult ChangeDisplayPeriodToWeeklyConfirm()
        {
            try
            {
                var currentUser = new UserHelper().GetCurrent(this._uow, this.UserName);
                DisplayPeriodManager dpm = new DisplayPeriodManager(this._uow);
                DisplayPeriod dp = new DisplayPeriod();
                dp = dpm.GetDisplayPeriod(currentUser);
                dp.IsWeekly = true;
                dpm.Edit(dp);

                return Ok(true);
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در تغییر به هفتگی");
            }
        }

        [HttpPost("[action]")]
        public IActionResult ChangeDisplayPeriodToDaily(PeriodNumberDateJson period)
        {
            try
            {
                var currentUser = new UserHelper().GetCurrent(this._uow, this.UserName);
                DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
                var displayPeriod = DisplayPeriodUtilities.ConvertPeriodNumberDateJsonToDisplayPeriod(period, this._uow, currentUser);
                //SyncWithPWA(uow);

                displayPeriodMnager.Save(displayPeriod);
                return Ok(true);
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در تغییر به روزانه");
            }
        }


        [HttpGet("[action]")]
        public IActionResult GetUsersList()
        {
            try
            {
                UserManager um = new UserManager(this._uow);
                var users = um.GetAll().Where(u => !string.IsNullOrEmpty(u.Code))
                .Select(u => new { id = u.ID, title = u.UserTitle })
                .OrderBy(u => u.title);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در دریافت لیست کاربران");
            }
        }

        [HttpPost("[action]")]
        public IActionResult SaveDailyLeave(DailyLeave dailyLeave)
        {
            try
            {
                if (dailyLeave == null) throw new Exception("اطلاعات مرخصی ارسال نشده است");
                if (string.IsNullOrEmpty(dailyLeave.PersianDateFrom)) throw new Exception("تاریخ شروع ارسال نشده است");
                if (string.IsNullOrEmpty(dailyLeave.PersianDateTo)) throw new Exception("تاریخ پایان ارسال نشده است");

                var currentUser = new UserHelper().GetCurrent(this._uow, this.UserName);

                DailyLeaveManager dlm = new DailyLeaveManager(this._uow);
                ProjectManager pm = new ProjectManager(this._uow);
                UserManager um = new UserManager(this._uow);
                dailyLeave.UserID = currentUser.ID;
                dailyLeave.OrganisationId = currentUser.OrganizationUnitID;

                if (dailyLeave.ProjectID == Guid.Empty) dailyLeave.ProjectID = null;
                if (dailyLeave.SuccessorID == Guid.Empty) dailyLeave.SuccessorID = null;

                if (dailyLeave.ID == Guid.Empty)
                {

                    dlm.Add(dailyLeave);
                }
                else
                {
                    dlm.Edit(dailyLeave);
                }

                return Ok(true);

            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در ذخیره مرخصی روزانه");
            }
        }


        [HttpPost("[action]")]
        public IActionResult SaveHourlyLeave(HourlyLeave hourlyLeave)
        {
            try
            {
                if (hourlyLeave == null) throw new Exception("اطلاعات مرخصی ارسال نشده است");
                var currentUser = new UserHelper().GetCurrent(this._uow, this.UserName);

                HourlyLeaveManager hm = new HourlyLeaveManager(this._uow);
                ProjectManager pm = new ProjectManager(this._uow);
                UserManager um = new UserManager(this._uow);
                hourlyLeave.UserId = currentUser.ID;
                hourlyLeave.OrganisationId = currentUser.OrganizationUnitID;

                if (hourlyLeave.ProjectID == Guid.Empty) hourlyLeave.ProjectID = null;

                if (hourlyLeave.ID == Guid.Empty)
                {
                    hm.Add(hourlyLeave);
                }
                else
                {
                    hm.Edit(hourlyLeave);
                }

                return Ok(true);

            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در ذخیره مرخصی ساعتی");
            }
        }

        [HttpPost("[action]")]
        public IActionResult SaveHourlyMission(HourlyMission hourlyMission)
        {
            try
            {
                if (hourlyMission == null) throw new Exception("اطلاعات ماموریت ارسال نشده است");
                var currentUser = new UserHelper().GetCurrent(this._uow, this.UserName);

                HourlyMissionManager hm = new HourlyMissionManager(this._uow);
                ProjectManager pm = new ProjectManager(this._uow);
                UserManager um = new UserManager(this._uow);
                hourlyMission.UserID = currentUser.ID;
                hourlyMission.OrganisationId = currentUser.OrganizationUnitID;

                if (hourlyMission.ProjectID == Guid.Empty) hourlyMission.ProjectID = null;

                if (hourlyMission.ID == Guid.Empty)
                {
                    hm.Add(hourlyMission);
                }
                else
                {
                    hm.Edit(hourlyMission);
                }

                return Ok(true);

            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در ذخیره ماموریت ساعتی");
            }
        }

        [HttpGet("waitingApprove/{wantedUserId}/{startDate}/{endDate}/{projectId?}/{taskId?}")]
        [ProducesResponseType(typeof(List<vmGetWaitingForApproveWorkhourDetail_Resualt>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetWaitingForApproveWorkhourDetail(Guid wantedUserId,DateTime startDate, DateTime endDate, Guid? projectId, Guid? taskId)
        {
            try
            {
                var currentUser = new UserHelper().GetCurrent(this._uow, this.UserName);

                var query = this.DBContext.spWaitingForApproveWorkHourDetail.FromSqlInterpolated(
                        this.DBContext.spWaitingForApproveWorkHourDetail_str(
                                                currentUser.ID,
                                                wantedUserId,
                                                startDate,
                                                endDate,
                                                projectId,
                                                taskId
                                                        ));
                
                var days = new string[] { "شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه" };

                var items = await query.ToListAsync();
                var answer = items.Select(i => new vmGetWaitingForApproveWorkhourDetail_Resualt{
                    date = i.Date,
                    description = i.Description,
                    isSend = i.IsSend,
                    minutes = i.Minutes,
                    projectId = i.ProjectId,
                    projectTitle = i.ProjectTitle,
                    title = i.Title,
                    workHourId = i.WorkHourId,
                    date_persian = i.PersianDate,
                    day_persian =days[i.TimeDayOfTheWeek]
                });

                return Ok(answer);

            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در دریافت جزئیات موارد منتظر تایید");
            }
        }
    }
}