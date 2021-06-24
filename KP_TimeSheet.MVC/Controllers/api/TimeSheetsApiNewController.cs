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
            var isWantingApprove = userId.HasValue;

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

                var mustCheckDefaultTimeSheetPolocy = false;
                var now = DateTime.Now;
                mustCheckDefaultTimeSheetPolocy = now.Date >= fromDate.Value.Date && now.Date <= toDate.Value.Date; //سعی شده پالیسی فقط دفعه اول چک شود و وقتی عقب جلو می رویم چک نشود چون همان است

                var numberOfReset = -1;

            labelForReset:

                numberOfReset++;

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
                    isOpen = gg.FirstOrDefault().IsOpen,
                    mustHaveHozoor = gg.First().UserMustHasHozoor,
                    dayTimeString = gg.FirstOrDefault().DayTimeString,
                    date_persian = gg.First().PersianDate,
                    day_persian = days[gg.First().DayOfWeek.Value],
                    hozoor = gg.First().Hozoor,
                    projects = gg.Where(p => p.Type == "Work" && p.ProjectId.HasValue)
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

                    others = gg.Where(p => p.Type == "Other" && p.ProjectId.HasValue)
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

                if (mustCheckDefaultTimeSheetPolocy && !answer.First(a => a.date.Value.Date == now.Date).isOpen.HasValue)
                {

                    createPolicyForUser(currentUser.ID);
                    if (numberOfReset < 1) goto labelForReset;
                }

                return Ok(answer);
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در دریافت اطلاعات تایم شیت");
            }
        }

        private void createPolicyForUser(Guid currentUserId)
        {
            //default policy must check maybe is deactivated
            //if isnot created, must create and today is open beacuase friday is checked in query
            //اگر زمانش گذشته باید تمدید بشه که با تاریخ های امروز یکسان بشه
            var userDefaultPolicy = this.DBContext.TimesheetPolicies.FirstOrDefault(p => p.IsDefault && p.UserId == currentUserId);
            var timeSheetConfig = this.DBContext.TimeSheetConfig.FirstOrDefault();
            if (timeSheetConfig == null)
            {
                timeSheetConfig = new TimeSheetConfig(){
                    DefualtOpenTimeSheetWeeks = 1,
                    TimeSheetLockDate = DateTime.Today
                };
                this.DBContext.TimeSheetConfig.Add(timeSheetConfig);
            }

            if (userDefaultPolicy == null)
            {
                userDefaultPolicy = new TimesheetPolicy()
                {
                    Id = Guid.NewGuid(),
                    IsDefault = true,
                    isDeactivated = false,
                    IsOpen = true,
                    UserMustHasHozoor = true,
                    UserId = currentUserId,
                };
                this.DBContext.TimesheetPolicies.Add(userDefaultPolicy);
            }

            userDefaultPolicy.Start = DateUtility.GetWeekStartDate(timeSheetConfig.DefualtOpenTimeSheetWeeks);
            userDefaultPolicy.Finish = DateUtility.GetWeekEndtDate();
            userDefaultPolicy.Validity = DateUtility.GetWeekEndtDate();
            userDefaultPolicy.CreateDate = DateTime.Now;


            this.DBContext.SaveChanges();
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

                var data = new ApproveAndDenyJson()
                {
                    id = dailyLeave.ID.ToString(),
                    date = DateTime.Now,
                    description = "",
                    workflowStageID = dailyLeave.WorkflowStageID

                };


                HistoryUtilities.RegisterApproveHistory(data, this._uow, currentUser);

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

                var data = new ApproveAndDenyJson()
                {
                    id = hourlyLeave.ID.ToString(),
                    date = DateTime.Now,
                    description = "",
                    workflowStageID = hourlyLeave.WorkflowStageID

                };


                HistoryUtilities.RegisterApproveHistory(data, this._uow, currentUser);

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

                var data = new ApproveAndDenyJson()
                {
                    id = hourlyMission.ID.ToString(),
                    date = DateTime.Now,
                    description = "",
                    workflowStageID = hourlyMission.WorkflowStageID

                };


                HistoryUtilities.RegisterApproveHistory(data, this._uow, currentUser);

                return Ok(true);

            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در ذخیره ماموریت ساعتی");
            }
        }


        [HttpGet("[action]")]
        [ProducesResponseType(typeof(List<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetWaitingForApproveUsers()
        {
            try
            {
                var currentUser = new UserHelper().GetCurrent(this._uow, this.UserName);

                var query = this.DBContext.spGetSubUsers.FromSqlInterpolated(
                        this.DBContext.spGetSubUsers_str(currentUser.ID));


                var items = await query.ToListAsync();
                var answer = items.Select(i => new
                {
                    id = i.UserId,
                    fullName = i.UserTitle + (i.Minutes.HasValue ? (" " + DateUtility.ConvertToTimeSpan(i.Minutes.Value)) : "") + (i.Minutes_Leave_Mission.HasValue ? (" م: " + DateUtility.ConvertToTimeSpan(i.Minutes_Leave_Mission.Value)) : "")
                }).ToList();

                return Ok(answer);

            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در دریافت لیست کاربران منتظر تایید");
            }
        }

        [HttpGet("waitingApprove/{wantedUserId}/{startDate}/{endDate}/{projectId?}/{taskId?}")]
        [ProducesResponseType(typeof(List<vmGetWaitingForApproveWorkhourDetail>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetWaitingForApproveWorkhourDetail(Guid wantedUserId, DateTime startDate, DateTime endDate, Guid? projectId, Guid? taskId)
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
                var answer = items.Select(i => new vmGetWaitingForApproveWorkhourDetail
                {
                    date = i.Date,
                    description = i.Description,
                    isSend = i.IsSend,
                    minutes = i.Minutes,
                    projectId = i.ProjectId,
                    projectTitle = i.ProjectTitle,
                    title = i.Title,
                    workHourId = i.WorkHourId,
                    date_persian = i.PersianDate,
                    day_persian = days[i.TimeDayOfTheWeek]
                });

                return Ok(answer);

            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در دریافت جزئیات موارد منتظر تایید");
            }
        }

        [HttpGet("waitingApproveMissionLeave/{type}/{wantedUserId}/{startDate}/{endDate}")]
        [ProducesResponseType(typeof(List<vmGetWaitingForApproveMissionLeaveDetail>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetWaitingForApproveMissionLeaveDetail(int type, Guid wantedUserId, DateTime startDate, DateTime endDate)
        {
            try
            {
                var currentUser = new UserHelper().GetCurrent(this._uow, this.UserName);

                var query = this.DBContext.spWaitingForApproveLeaveMissionDetail.FromSqlInterpolated(
                        this.DBContext.spWaitingForApproveLeaveMissionDetail_str(
                                                type,
                                                currentUser.ID,
                                                wantedUserId,
                                                startDate,
                                                endDate));

                var days = new string[] { "شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه" };

                var items = await query.ToListAsync();
                var answer = items.Select(i => new vmGetWaitingForApproveMissionLeaveDetail
                {
                    id = i.Id,
                    description = i.Description,
                    isSend = i.IsSend,

                    from = days[i.FromTimeDayOfTheWeek] + " " + i.FromPersianDate + (type == 3 ? "" : " " + i.From.Hour + ":" + i.From.Minute.ToString("00")),
                    to = days[i.ToTimeDayOfTheWeek] + " " + i.ToPersianDate + (type == 3 ? "" : " " + i.To.Hour + ":" + i.To.Minute.ToString("00")),

                    from_day = days[i.FromTimeDayOfTheWeek],
                    to_day = days[i.ToTimeDayOfTheWeek]
                });

                return Ok(answer);

            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در دریافت جزئیات موارد منتظر تایید");
            }
        }


        [HttpPost("approve")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult approveDeny(vmApproveDenyRequest request)
        {
            try
            {
                if (!this.MainChecks(request.ver, out string error)) throw new Exception(error);
                if (request.approveIds.Count == 0 && request.denyIds.Count == 0) throw new Exception("موردی برای تایید یا رد مشخص نشده است");

                var currentUser = new UserHelper().GetCurrent(this._uow, this.UserName);
                TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);


                if (request.type == 10)
                {
                    //workhour
                    foreach (var itemForApprove in request.approveIds)
                    {
                        var item = timeSheetManager.GetByID(itemForApprove.id);
                        approveDenyWorkhour(true, currentUser, timeSheetManager, item, itemForApprove.description);
                    }
                    foreach (var itemForDeny in request.denyIds)
                    {
                        var item = timeSheetManager.GetByID(itemForDeny.id);
                        approveDenyWorkhour(false, currentUser, timeSheetManager, item, itemForDeny.description);
                    }
                }

                if (request.type == 1)
                {
                    //ماموریت ساعتی
                    HourlyMissionManager dlm = new HourlyMissionManager(this._uow);

                    foreach (var itemForApprove in request.approveIds)
                    {
                        var dailyLeave = dlm.GetByID(itemForApprove.id);
                        approveDenyHourlyMission(true, currentUser, timeSheetManager, dlm, dailyLeave, itemForApprove.description);
                    }

                    foreach (var itemForDeny in request.denyIds)
                    {
                        var dailyLeave = dlm.GetByID(itemForDeny.id);
                        approveDenyHourlyMission(false, currentUser, timeSheetManager, dlm, dailyLeave, itemForDeny.description);
                    }

                    this._uow.SaveChanges();
                }
                if (request.type == 2)
                {
                    //مرخصی ساعتی
                    HourlyLeaveManager dlm = new HourlyLeaveManager(this._uow);

                    foreach (var itemForApprove in request.approveIds)
                    {
                        var dailyLeave = dlm.GetByID(itemForApprove.id);
                        approveDenyHourlyLeave(true, currentUser, timeSheetManager, dlm, dailyLeave, itemForApprove.description);
                    }

                    foreach (var itemForDeny in request.denyIds)
                    {
                        var dailyLeave = dlm.GetByID(itemForDeny.id);
                        approveDenyHourlyLeave(false, currentUser, timeSheetManager, dlm, dailyLeave, itemForDeny.description);
                    }

                    this._uow.SaveChanges();
                }
                if (request.type == 3)
                {
                    //مرخصی روزانه
                    DailyLeaveManager dlm = new DailyLeaveManager(this._uow);

                    foreach (var itemForApprove in request.approveIds)
                    {
                        var dailyLeave = dlm.GetByID(itemForApprove.id);
                        approveDenyDailyLeave(true, currentUser, timeSheetManager, dlm, dailyLeave, itemForApprove.description);
                    }

                    foreach (var itemForDeny in request.denyIds)
                    {
                        var dailyLeave = dlm.GetByID(itemForDeny.id);
                        approveDenyDailyLeave(false, currentUser, timeSheetManager, dlm, dailyLeave, itemForDeny.description);
                    }

                    this._uow.SaveChanges();
                }



                return Ok(new { message = "عملیات تایید با موفقیت انجام گردید" });
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در ذخیره تایید و رد ها");
            }
        }


        [HttpGet("GetHistoryWorkHour/{workHourId}")]
        public IEnumerable<WorkHourHistoryJson> GetHistoryWorkHour(Guid workHourId)
        {
            var result = new List<WorkHourHistoryJson>();
            WorkHourHistoryManager historyManagerh = new WorkHourHistoryManager(this._uow);

            result = new WorkHourHistoryAssembler().ToJsons(historyManagerh.GetByWorkHourID(workHourId)).ToList();
            return result;
        }


        //--------------------------------------------------------------------------------------
        private void approveDenyHourlyMission(bool isApprove, Domain.User currentUser, TimeSheetManager timeSheetManager, HourlyMissionManager dlm, HourlyMission dailyLeave, string userDescription)
        {
            if (dailyLeave.WorkflowStage.Type == "Final") throw new Exception("هم اکنون تایید نهایی می باشد");
            var isManager = timeSheetManager.IsUserOrganisationMnager(dailyLeave.UserID, currentUser);

            if (dailyLeave.WorkflowStage.Type == "Manager" && !isManager) throw new Exception("آیتم منتظر تایید مدیر ستادی است");

            var data = new ApproveAndDenyJson()
            {
                id = dailyLeave.ID.ToString(),
                date = DateTime.Now,
                description = userDescription,
                workflowStageID = dailyLeave.WorkflowStageID
            };

            if (isApprove)
            {
                dlm.Approve(dailyLeave);
                HistoryUtilities.RegisterApproveHistory(data, this._uow, currentUser);
            }
            else
            {
                dlm.Deny(dailyLeave);
                HistoryUtilities.RegisterApproveHistory(data, this._uow, currentUser);
            }
        }
        private void approveDenyHourlyLeave(bool isApprove, Domain.User currentUser, TimeSheetManager timeSheetManager, HourlyLeaveManager dlm, HourlyLeave dailyLeave, string userDescription)
        {
            if (dailyLeave.WorkflowStage.Type == "Final") throw new Exception("هم اکنون تایید نهایی می باشد");
            var isManager = timeSheetManager.IsUserOrganisationMnager(dailyLeave.UserId, currentUser);

            if (dailyLeave.WorkflowStage.Type == "Manager" && !isManager) throw new Exception("آیتم منتظر تایید مدیر ستادی است");

            var data = new ApproveAndDenyJson()
            {
                id = dailyLeave.ID.ToString(),
                date = DateTime.Now,
                description = userDescription,
                workflowStageID = dailyLeave.WorkflowStageID
            };

            if (isApprove)
            {
                dlm.Approve(dailyLeave);
                HistoryUtilities.RegisterApproveHistory(data, this._uow, currentUser);
            }
            else
            {
                dlm.Deny(dailyLeave);
                HistoryUtilities.RegisterApproveHistory(data, this._uow, currentUser);
            }
        }
        private void approveDenyDailyLeave(bool isApprove, Domain.User currentUser, TimeSheetManager timeSheetManager, DailyLeaveManager dlm, DailyLeave dailyLeave, string userDescription)
        {
            if (dailyLeave.WorkflowStage.Type == "Final") throw new Exception("هم اکنون تایید نهایی می باشد");
            var isManager = timeSheetManager.IsUserOrganisationMnager(dailyLeave.UserID, currentUser);

            if (dailyLeave.WorkflowStage.Type == "Manager" && !isManager) throw new Exception("آیتم منتظر تایید مدیر ستادی است");

            var data = new ApproveAndDenyJson()
            {
                id = dailyLeave.ID.ToString(),
                date = DateTime.Now,
                description = userDescription,
                workflowStageID = dailyLeave.WorkflowStageID
            };

            if (isApprove)
            {
                dlm.Approve(dailyLeave);
                HistoryUtilities.RegisterApproveHistory(data, this._uow, currentUser);
            }
            else
            {
                dlm.Deny(dailyLeave);
                HistoryUtilities.RegisterApproveHistory(data, this._uow, currentUser);
            }
        }

        private void approveDenyWorkhour(bool isApprove, Domain.User currentUser, TimeSheetManager timeSheetManager, WorkHour item, string userDescription)
        {

            if (item.WorkflowStage.Type == "Final") throw new Exception("هم اکنون تایید نهایی می باشد");

            var data = new ApproveAndDenyJson()
            {
                id = item.ID.ToString(),
                date = DateTime.Now,
                description = userDescription
            };

            var isManager = timeSheetManager.IsUserOrganisationMnager(item.EmployeeID, currentUser);
            var isProjectManager = timeSheetManager.IsUserProjectMnager(item, currentUser.UserName);


            if (isManager && isProjectManager)
            {
                if (isApprove)
                {
                    for (int i = item.WorkflowStage.Order; i < 4; i++)
                    {
                        timeSheetManager.ApproveWorkHour(item);
                        HistoryUtilities.RegisterApproveHistory(data, item, this._uow, currentUser);
                    }
                }
                else
                {
                    for (int i = item.WorkflowStage.Order; i > 1; i++)
                    {
                        timeSheetManager.DenyWorkHour(item);
                        HistoryUtilities.RegisterDenyHistory(data, item, this._uow, currentUser);
                    }
                }

            }
            else
            {

                if (item.WorkflowStage.Type == "Manager" && !isManager) throw new Exception("آیتم منتظر تایید مدیر ستادی است");
                if (item.WorkflowStage.Type == "ProjectManager" && !isProjectManager) throw new Exception("آیتم منتظر تایید مدیر پروژه است");
                if (isApprove)
                {
                    timeSheetManager.ApproveWorkHour(item);
                    HistoryUtilities.RegisterApproveHistory(data, item, this._uow, currentUser);
                }
                else
                {
                    timeSheetManager.DenyWorkHour(item);
                    HistoryUtilities.RegisterDenyHistory(data, item, this._uow, currentUser);
                }
            }
        }



    }
}