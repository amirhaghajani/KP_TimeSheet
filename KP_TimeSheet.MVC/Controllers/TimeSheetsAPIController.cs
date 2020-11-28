using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace KP.TimeSheets.MVC
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeSheetsAPIController : ControllerBase
    {
        IUnitOfWork _uow;
        public TimeSheetsAPIController(IUnitOfWork uow){
            this._uow = uow;
        }
        
        #region Register Methods

        [HttpPost("[action]")]
        public IEnumerable<WorkHourHistoryJson> GetHistoryWorkHour(WorkHourJson WorkHourJson)
        {
            var result = new List<WorkHourHistoryJson>();
            UserManager userManager = new UserManager(this._uow);
            WorkHourHistoryManager historyManagerh = new WorkHourHistoryManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            result = new WorkHourHistoryAssembler().ToJsons(historyManagerh.GetByWorkHourID(WorkHourJson.ID)).ToList();
            return result;
        }

        [HttpGet("[action]")]
        public IEnumerable<TimeSheetJson> ChangeDisplayPeriodToWeekly()
        {
            UserManager um = new UserManager(this._uow);
            var currentUser = new UserHelper().GetCurrent(this._uow);
            DisplayPeriodManager dpm = new DisplayPeriodManager(this._uow);
            DisplayPeriod dp = new DisplayPeriod();
            dp = dpm.GetDisplayPeriod(currentUser);
            dp.IsWeekly = true;
            dpm.Edit(dp);
            return GetTimeSheets();
        }

        [HttpPost("[action]")]
        public IEnumerable<TimeSheetJson> GetTimeSheetsByDateAndNumberOfDay(PeriodNumberDateJson period)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            UserManager userManager = new UserManager(this._uow);
            ProjectManager projectManager = new Domain.ProjectManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            var displayPeriod = DisplayPeriodUtilities.ConvertPeriodNumberDateJsonToDisplayPeriod(period,this._uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            displayPeriodMnager.Save(displayPeriod);
            DateTime fromDate = displayPeriod.StartDate;
            DateTime toDate = fromDate.AddDays(displayPeriod.NumOfDays);
            IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
            IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
            result = TimeSheetAssembler.ToJsonsForRegister(presHours, workHours);

            return result;
        }

        [HttpPost("[action]")]
        public IEnumerable<WorkHourJson> GetCurrentPeriodSentWorkHours(List<TimeSheetValueJson> workHourJsons)
        {
            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            DateTime fromDate = workHourJsons[0].Date;
            DateTime toDate = workHourJsons[workHourJsons.Count() - 1].Date;
            return new WorkHourAssembler().ToJsons(timeSheetManager.GetSentWorkHours(currUser.UserName).Where(x => x.Date >= fromDate && x.Date <= toDate).OrderBy(c => c.Date));

        }

        [HttpPost("[action]")]
        public IEnumerable<WorkHourJson> GetWorkHoursByDate(WorkHourJson WorkHourJson)
        {
            var result = new List<WorkHourJson>();
            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            result = new WorkHourAssembler().ToJsons(timeSheetManager.GetWorkHoursByUser(currUser, WorkHourJson.Date, WorkHourJson.Date)).ToList();
            return result;
        }

        [HttpGet("[action]")]
        public IEnumerable<WorkHourJson> GetSentWorkHours()
        {
            var userName = User.Identity.Name;
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            return new WorkHourAssembler().ToJsons(timeSheetManager.GetSentWorkHours(userName).OrderBy(c => c.Date));
        }

        [HttpGet("[action]")]
        public IEnumerable<TimeSheetJson> GetTimeSheets()
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            UserManager userManager = new UserManager(this._uow);
            ProjectManager projectManager = new Domain.ProjectManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            DateTime fromDate;
            DateTime toDate = DateTime.MaxValue;
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currUser);
            if (displayPeriod != null)
            {
                fromDate = displayPeriod.StartDate;
                if (displayPeriod.IsWeekly)
                {
                    fromDate = DateTime.Today.StartOfWeek(DayOfWeek.Saturday);
                    toDate = DateTime.Today.EndOfWeek(DayOfWeek.Friday);
                }
                else
                {
                    toDate = fromDate.AddDays(displayPeriod.NumOfDays);
                }
            }
            else
            {
                fromDate = DateTime.Today.StartOfWeek(DayOfWeek.Saturday);
                toDate = DateTime.Today.EndOfWeek(DayOfWeek.Friday);
            }
            IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
            IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
            result = TimeSheetAssembler.ToJsonsForRegister(presHours, workHours);
            return result;
        }

        [HttpPost("[action]")]
        public IEnumerable<WorkHourOnProjecstJson> GetThisMonthProjects(TimeSheetValueJson json)
        {
            List<WorkHourOnProjecstJson> result = new List<WorkHourOnProjecstJson>();
            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent(this._uow);

            var all = timeSheetManager.GetWorkHoursByUser(currUser.ID, json.Date);
            foreach (var item in all.GroupBy(x => x.ProjectId).Select(y => y.FirstOrDefault()).ToList())
            {
                var addItem = new WorkHourOnProjecstJson();
                addItem.ProjectId = item.ProjectId;
                addItem.Title = item.Project.Title;
                var hour = all.Where(a => a.ProjectId == item.ProjectId).Sum(d => d.Hours);
                addItem.Hour = DateUtility.ConvertToTimeSpan(hour);
                result.Add(addItem);
            }
            return result;
        }

        [HttpPost("[action]")]
        public string GetCurrentUser()
        {
            return User.Identity.Name;
        }

        [HttpPost("[action]")]
        public IEnumerable<TimeSheetJson> GetCurrentPeriod(List<TimeSheetValueJson> workHourJsons)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            DateTime fromDate = workHourJsons[0].Date;
            DateTime toDate = workHourJsons[workHourJsons.Count() - 1].Date;
            IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
            IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
            result = TimeSheetAssembler.ToJsonsForRegister(presHours, workHours);
            return result;
        }

        [HttpPost("[action]")]
        public IEnumerable<TimeSheetJson> GetNextPeriod(TimeSheetValueJson workHourJson)
        {

            List<TimeSheetJson> result = new List<TimeSheetJson>();
            if (workHourJson == null)
            {
                workHourJson = new TimeSheetValueJson();
                workHourJson.Date = DateTime.Now.AddDays(-7);

            }

            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currUser);
            DateTime toDate = workHourJson.Date.AddDays(1);

            DateTime fromDate;
            var type = workHourJson.Value.GetType();
            if (displayPeriod != null)
            {
                fromDate = displayPeriod.StartDate;
                if (displayPeriod.IsWeekly)
                {
                    var Condition = workHourJson.Value.Equals(true) || workHourJson.Date.AddDays(7) < DateTime.Now;
                    if (DateTime.Now > workHourJson.Date && Condition)
                    {
                        fromDate = toDate.StartOfWeek(DayOfWeek.Saturday);
                        toDate = toDate.EndOfWeek(DayOfWeek.Friday);
                        IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                        IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);

                        result = TimeSheetAssembler.ToJsonsForRegister(presHours, workHours);
                    }
                    else
                    {

                        fromDate = DateTime.Now.StartOfWeek(DayOfWeek.Saturday);
                        toDate = DateTime.Now.EndOfWeek(DayOfWeek.Friday);
                        IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                        IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
                        result = TimeSheetAssembler.ToJsonsForRegister(presHours, workHours);
                    }

                }
                else
                {
                    toDate = fromDate.AddDays(displayPeriod.NumOfDays);
                    IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                    if (presHours.Count() < displayPeriod.NumOfDays)
                    {
                        fromDate = DateTime.Now;
                        toDate = fromDate.AddDays(displayPeriod.NumOfDays);
                        presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                    }
                    IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
                    result = TimeSheetAssembler.ToJsonsForRegister(presHours, workHours);
                }
            }
            else
            {
                fromDate = DateTime.Now.StartOfWeek(DayOfWeek.Saturday);
                toDate = DateTime.Now.EndOfWeek(DayOfWeek.Friday);
                IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
                result = TimeSheetAssembler.ToJsonsForRegister(presHours, workHours);
            }
            return result;
        }

        [HttpPost("[action]")]
        public IEnumerable<TimeSheetJson> GetPreviousPeriod(WorkHourJson workHourJson)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            if (workHourJson == null)
            {
                workHourJson = new WorkHourJson();
                workHourJson.Date = DateTime.Now;
            }
            var startDate = workHourJson.Date;

            UserManager userManager = new UserManager(this._uow);
            ProjectManager projectManager = new Domain.ProjectManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currUser);

            var dt = startDate.AddDays(-1);

            DateTime fromDate = dt.AddDays(-displayPeriod.NumOfDays);
            DateTime toDate = dt;

            if (displayPeriod.IsWeekly)
            {
                fromDate = dt.StartOfWeek(DayOfWeek.Saturday);
                toDate = dt.EndOfWeek(DayOfWeek.Friday);

                IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
                result = TimeSheetAssembler.ToJsonsForRegister(presHours, workHours);

            }
            else
            {

                IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
                if (presHours.Count() < displayPeriod.NumOfDays)
                {
                    fromDate = timeSheetManager.GetFirstPresenceHour().Date;
                    toDate = fromDate.AddDays(displayPeriod.NumOfDays);
                    presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                }
                result = TimeSheetAssembler.ToJsonsForRegister(presHours, workHours);
            }



            return result;
        }

        [HttpPost("[action]")]
        public List<string> SaveWorkHours(WorkHourJson workHourJson)
        {

            List<string> result = new List<string>();

            try
            {
                UserManager userManager = new UserManager(this._uow);
                TaskManager taskManager = new TaskManager(this._uow);
                ProjectManager prjManager = new ProjectManager(this._uow);
                TimeSheetManager tsManager = new TimeSheetManager(this._uow);
                Validations validate = new Validations();
                User currUser = new UserHelper().GetCurrent(this._uow);
                WorkHour workHour = workHourJson.ToWorkHour();
                workHour.Task = taskManager.GetByID(workHour.TaskID);
                workHour.TaskID = workHour.Task.ID;
                workHour.Project = prjManager.GetByID(workHourJson.ProjectID);
                workHour.ProjectId = workHour.Project.ID;
                workHour.EmployeeID = currUser.ID;
                workHour.Employee = userManager.GetByID(currUser.ID);
                workHour.WorkflowStage = new WorkflowManager(this._uow).FirstStage();
                workHour.WorkflowStageID = workHour.WorkflowStage.ID;
                workHour.Description = workHourJson.Description;
                 tsManager.SaveWorkHour(workHour);
                 HistoryUtilities.RegisterSaveHistory(workHour,this._uow);
            }

            catch (ValidationException ex)
            {

                result= ex.Errors;
            }
            return result;
        }

        [HttpPost("[action]")]
        public List<string> SendWorkHour(WorkHourJson workHourJson)//JObject jsonObject
        {
            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager WHM = new TimeSheetManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            Validations validate = new Validations();
            var WorkHour = WHM.GetByID(workHourJson.ID);
            List<string> result = new List<string>();
            result = validate.ValidateRegisterWorkHour(WorkHour);

            if (result.Count() == 0)
            {
                if (WorkHour.WorkflowStage.IsFirst)
                {
                    WHM.SendWorkHour(WorkHour);
                    HistoryUtilities.RegisterSendHistory(WorkHour,this._uow);
                    result.Add("ارسال کارکرد با موفقیت انجام گردید");
                }
            }

            return result;
        }

        [HttpPost("[action]")]
        public List<string> SendWorkHours(WorkHourJson workHourJson)//JObject jsonObject
        {
            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager WHM = new TimeSheetManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            Validations validate = new Validations();
            var WorkHours = WHM.GetBydateAndUserId(workHourJson.Date, currUser.ID);
            List<string> result = new List<string>();

            foreach (var wh in WorkHours.ToList())
            {
                if (wh.WorkflowStage.IsFirst)
                {
                    result = validate.ValidateRegisterWorkHour(wh);
                    if (result.Count() > 0)
                        return result;

                    WHM.SendWorkHour(wh);
                    HistoryUtilities.RegisterSendHistory(wh,this._uow);
                    result.Add("عملیات ارسال کارکرد ها با موفقیت انجام گردید");
                }
            }

            return result;
        }

        [HttpPost("[action]")]
        public IEnumerable<WorkHourJson> GetUnConfirmedWorkHours(WorkHourJson workHourJson)//JObject jsonObject)
        {
            TimeSheetManager WHM = new TimeSheetManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            return new WorkHourAssembler().ToJsons(WHM.GetUnConfirmedWorkHours(workHourJson.Date, currUser.ID));
        }

        [HttpPost("[action]")]
        public PresenceHour GetPresenceHourByDate(WorkHourJson workHourJson)//JObject jsonObject)
        {
            TimeSheetManager WHM = new TimeSheetManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            return WHM.GetPresenceHourByUserIdAndDate(currUser.ID, workHourJson.Date);
        }

        [HttpPost("[action]")]
        public IEnumerable<WorkHourJson> GetConfirmedWorkHours(WorkHourJson workHourJson)//JObject jsonObject)
        {
            TimeSheetManager WHM = new TimeSheetManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            return new WorkHourAssembler().ToJsons(WHM.GetConfirmedWorkHours(workHourJson.Date, currUser.ID));
        }

        [HttpPost("[action]")]
        public bool DeleteWorkHours(WorkHourJson workHourJson)//JObject jsonObject)
        {
            TimeSheetManager WHM = new TimeSheetManager(this._uow);
            WHM.DeleteWorkHour(workHourJson.ID);
            return true;
        }

        [HttpPost("[action]")]
        public string CurrentUser()//JObject jsonObject)
        {
            string UserName = User.Identity.Name;
            return UserName;
        }

        [HttpGet("[action]")]
        public AllEntityJson GetYesterdayData()
        {
            TimeSheetManager timesheetManager = new Domain.TimeSheetManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            var presenceour = timesheetManager.GetyesterdayPresencHoursByUserId(currUser.ID);
            var workours = timesheetManager.GetyesterdayworkHoursByUserId(currUser.ID);
            return new HomeEntityAssembler().ToJson(presenceour, workours, User.Identity.Name);

        }


        [HttpGet("[action]")]
        public AllEntityJson GetThisMonthDataForHomePage()
        {
            TimeSheetManager timesheetManager = new Domain.TimeSheetManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            var presenceours = timesheetManager.GetThisMonthPresencHoursByUserId(currUser.ID, DateTime.Now);
            var workours = timesheetManager.GetWorkHoursByUser(currUser.ID, DateTime.Now);
            return new HomeEntityAssembler().ToJson(presenceours, workours);
        }

        [HttpPost("[action]")]
        public AllEntityJson GetThisMonthData(TimeSheetValueJson workHourJson)
        {
            TimeSheetManager timesheetManager = new Domain.TimeSheetManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            var presenceours = timesheetManager.GetThisMonthPresencHoursByUserId(currUser.ID, workHourJson.Date);
            var workours = timesheetManager.GetWorkHoursByUser(currUser.ID, workHourJson.Date);
            return new HomeEntityAssembler().ToJson(presenceours, workours);
        }

        [HttpPost("[action]")]
        public IEnumerable<WorkHourOnProjecstJson> GetThisPeriodProjects(List<TimeSheetValueJson> workHourJsons)
        {
            List<WorkHourOnProjecstJson> result = new List<WorkHourOnProjecstJson>();
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currUser);
            DateTime fromDate = workHourJsons[0].Date;
            DateTime toDate = workHourJsons[workHourJsons.Count() - 1].Date;
            var all = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
            foreach (var item in all.GroupBy(x => x.ProjectId).Select(y => y.FirstOrDefault()).ToList())
            {
                var addItem = new WorkHourOnProjecstJson();
                addItem.ProjectId = item.ProjectId;
                addItem.Title = item.Project.Title;
                var hour = all.Where(a => a.ProjectId == item.ProjectId).Sum(d => d.Hours);
                addItem.Hour = DateUtility.ConvertToTimeSpan(hour);
                result.Add(addItem);
            }

            return result;
        }

        [HttpPost("[action]")]
        public AllEntityJson GetThisPeriodData(List<TimeSheetValueJson> workHourJsons)
        {
            User currUser = new UserHelper().GetCurrent(this._uow);
            TimeSheetManager timesheetManager = new Domain.TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currUser);
            DateTime fromDate = workHourJsons[0].Date;
            DateTime toDate = workHourJsons[workHourJsons.Count() - 1].Date;
            var presenceours = timesheetManager.GetThisPeriodPresencHoursByUserId(currUser.ID, fromDate, toDate);
            var workours = timesheetManager.GetThisPeriodhworkHoursByUserId(currUser.ID, fromDate, toDate);
            return new HomeEntityAssembler().ToJson(presenceours, workours);
        }

        [HttpPost("[action]")]
        public IEnumerable<WorkHourOnProjecstJson> GetThisPeriodProjectsByUserId(GetThisMonthDataByUserJson json)
        {
            List<WorkHourOnProjecstJson> result = new List<WorkHourOnProjecstJson>();
            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            User currUser = userManager.GetByID(Guid.Parse(json.userid));
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currUser);

            DateTime fromDate = json.values[0].Date;
            DateTime toDate = json.values[json.values.Count() - 1].Date;

            var all = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
            foreach (var item in all.GroupBy(x => x.ProjectId).Select(y => y.FirstOrDefault()).ToList())
            {
                var addItem = new WorkHourOnProjecstJson();
                addItem.ProjectId = item.ProjectId;
                addItem.Title = item.Project.Title;
                var hour = all.Where(a => a.ProjectId == item.ProjectId).Sum(d => d.Hours);
                addItem.Hour = DateUtility.ConvertToTimeSpan(hour);
                result.Add(addItem);
            }

            return result;
        }

        [HttpPost("[action]")]
        public AllEntityJson GetThisPeriodDataByUserId(GetThisMonthDataByUserJson json)
        {
            UserManager userManager = new UserManager(this._uow);
            User currUser = userManager.GetByID(Guid.Parse(json.userid));
            TimeSheetManager timesheetManager = new Domain.TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currUser);

            DateTime fromDate = json.values[0].Date;
            DateTime toDate = json.values[json.values.Count() - 1].Date;

            var presenceours = timesheetManager.GetThisPeriodPresencHoursByUserId(currUser.ID, fromDate, toDate);
            var workours = timesheetManager.GetThisPeriodhworkHoursByUserId(currUser.ID, fromDate, toDate);
            return new HomeEntityAssembler().ToJson(presenceours, workours);

        }

        [HttpPost("[action]")]
        public AllEntityJson GetThisMonthDataByUser(GetThisMonthDataByUserJson json)
        {
            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager timesheetManager = new Domain.TimeSheetManager(this._uow);
            User currUser = userManager.GetByID(Guid.Parse(json.userid.ToString()));
            var presenceours = timesheetManager.GetThisMonthPresencHoursByUserId(currUser.ID, json.value.Date);
            var workours = timesheetManager.GetWorkHoursByUser(currUser.ID, json.value.Date);
            return new HomeEntityAssembler().ToJson(presenceours, workours);

        }

        [HttpPost("[action]")]
        public IEnumerable<WorkHourOnProjecstJson> GetThisMonthProjectsByUserID(GetThisMonthDataByUserJson json)
        {
            List<WorkHourOnProjecstJson> result = new List<WorkHourOnProjecstJson>();
            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            //SyncWithPWA(uow);
            User User = userManager.GetByID(Guid.Parse(json.userid));
            var all = timeSheetManager.GetWorkHoursByUser(User.ID, json.value.Date);
            foreach (var item in all.GroupBy(x => x.ProjectId).Select(y => y.FirstOrDefault()).ToList())
            {
                var addItem = new WorkHourOnProjecstJson();
                addItem.ProjectId = item.ProjectId;
                addItem.Title = item.Project.Title;
                var hour = all.Where(a => a.ProjectId == item.ProjectId).Sum(d => d.Hours);
                addItem.Hour = DateUtility.ConvertToTimeSpan(hour);
                result.Add(addItem);
            }
            return result;
        }
        #endregion

        #region Confirm Methods

        [HttpGet("[action]")]
        public IEnumerable<UserJson> GetUsersInCurrentUserOrganisation()
        {
            var manager = new UserManager(this._uow);
            var user = new UserHelper().GetCurrent(this._uow);
            var result = manager.GetMyEmployees(user);
            return new UserAssembler().ToJsons(result);
        }


        [HttpGet("[action]")]
        public IEnumerable<TimeSheetJson> GetTimeSheetsByUserIdForFirstTime(Guid userID)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            UserManager userManager = new UserManager(this._uow);
            ProjectManager projectManager = new Domain.ProjectManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            User currentUser = new UserHelper().GetCurrent(this._uow);
            User user = userManager.GetByID(userID);
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currentUser);



            DateTime fromDate = DateTime.Now.AddDays(-7);
            DateTime toDate = DateTime.Now;



            if (displayPeriod.IsWeekly)
            {
                fromDate = DateTime.Today.StartOfWeek(DayOfWeek.Saturday);
                toDate = DateTime.Today.EndOfWeek(DayOfWeek.Friday);
            }
            else
            {
                toDate = fromDate.AddDays(displayPeriod.NumOfDays);
            }

            IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(user, fromDate, toDate);
            IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(user, fromDate, toDate);

            result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user,this._uow);
            return result;

        }


        [HttpPost("[action]")]
        public IEnumerable<TimeSheetJson> GetTimeSheetsByUserId(GetThisMonthDataByUserJson json)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            UserManager userManager = new UserManager(this._uow);
            ProjectManager projectManager = new Domain.ProjectManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            User currentUser = new UserHelper().GetCurrent(this._uow);
            User user = userManager.GetByID(Guid.Parse(json.userid.ToString()));
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currentUser);
            DateTime fromDate = DateTime.Now.AddDays(-7);
            DateTime toDate;
            if (json.values != null)
            {
                if (json.values.Count > 0)
                {
                    fromDate = json.values[0].Date;
                    toDate = json.values[json.values.Count() - 1].Date;
                }
            }


            if (displayPeriod.IsWeekly)
            {
                fromDate = DateTime.Today.StartOfWeek(DayOfWeek.Saturday);
                toDate = DateTime.Today.EndOfWeek(DayOfWeek.Friday);
            }
            else
            {
                toDate = fromDate.AddDays(displayPeriod.NumOfDays);
            }

            IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(user, fromDate, toDate);
            IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(user, fromDate, toDate);

            result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user,this._uow);
            return result;

        }

        [HttpPost("[action]")]
        public string ApproveWorkHour(ApproveAndDenyJson data)
        {
            IEnumerable<WorkHour> result;

            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            result = timeSheetManager.GetByDateAndTaskId(data.date, Guid.Parse(data.id)).ToList();


            foreach (var item in result)
            {
                if (timeSheetManager.IsUserOrganisationMnager(item, User.Identity.Name) && timeSheetManager.IsUserProjectMnager(item, User.Identity.Name) && item.WorkflowStage.Order == 2)
                {
                    for (int i = 0; i < 2; i++)
                    {
                        timeSheetManager.ApproveWorkHour(item);
                        HistoryUtilities.RegisterApproveHistory(data, item,this._uow);
                    }
                }
                else
                {
                    timeSheetManager.ApproveWorkHour(item);
                    HistoryUtilities.RegisterApproveHistory(data, item,this._uow);
                }

            }


            return "عملیات تایید با موفقیت انجام گردید";
        }

        [HttpPost("[action]")]
        public string DenyWorkHour(ApproveAndDenyJson data)
        {
            IEnumerable<WorkHour> result;
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);

            result = timeSheetManager.GetByDateAndTaskId(data.date, Guid.Parse(data.id)).ToList();
            foreach (var item in result)
            {
                timeSheetManager.DenyWorkHour(item);
                HistoryUtilities.RegisterDenyHistory(data, item,this._uow);

            }


            return "عملیات رد با موفقیت انجام گردید";
        }

        [HttpPost("[action]")]
        public IEnumerable<WorkHourJson> GetRegistereCurrentPerioddWorkHours(List<TimeSheetValueJson> workHourJsons)
        {
            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            DateTime fromDate = workHourJsons[0].Date;
            DateTime toDate = workHourJsons[workHourJsons.Count() - 1].Date;
            var result = timeSheetManager.GetRegisteredWorkHours(currUser.ID)
                .Where(x => x.Date >= fromDate && x.Date <= toDate)
                .OrderBy(c => c.Date).ToList();
            return new WorkHourAssembler().ToJsons(result);
        }


        [HttpGet("[action]")]
        public IEnumerable<WorkHourJson> GetRegisteredWorkHours()
        {
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            var currentUser = new UserHelper().GetCurrent(this._uow);
            return new WorkHourAssembler().ToJsons(timeSheetManager.GetRegisteredWorkHours(currentUser.ID).OrderBy(c => c.Date));
        }

        [HttpPost("[action]")]
        public IEnumerable<TimeSheetJson> GetTimeSheetsByDateAndNumberOfDayConfirm(PeriodNumberDateJson period)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            UserManager userManager = new UserManager(this._uow);
            ProjectManager projectManager = new Domain.ProjectManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            var displayPeriod = DisplayPeriodUtilities.ConvertPeriodNumberDateJsonToDisplayPeriod(period,this._uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            User user = userManager.GetByID(Guid.Parse(period.UserId));
            displayPeriodMnager.Save(displayPeriod);

            DateTime fromDate = displayPeriod.StartDate;
            DateTime toDate = fromDate.AddDays(displayPeriod.NumOfDays);
            IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(user, fromDate, toDate);
            IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(user, fromDate, toDate);
            result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user,this._uow);

            return result;
        }

        [HttpPost("[action]")]
        public IEnumerable<TimeSheetJson> GetNextPeriodConfirm(TimeSheetValueJson workHourJson)
        {



            List<TimeSheetJson> result = new List<TimeSheetJson>();
            if (workHourJson == null)
            {
                workHourJson = new TimeSheetValueJson();
                workHourJson.Date = DateTime.Now.AddDays(-7);

            }

            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            User user = userManager.GetByID(Guid.Parse(workHourJson.UserId));
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currUser);
            DateTime toDate = workHourJson.Date.AddDays(1);

            DateTime fromDate;
            var type = workHourJson.Value.GetType();
            if (displayPeriod != null)
            {
                fromDate = displayPeriod.StartDate;
                if (displayPeriod.IsWeekly)
                {
                    var Condition = workHourJson.Value.Equals(true) || workHourJson.Date.AddDays(7) < DateTime.Now;
                    if (DateTime.Now > workHourJson.Date && Condition)
                    {
                        fromDate = toDate.StartOfWeek(DayOfWeek.Saturday);
                        toDate = toDate.EndOfWeek(DayOfWeek.Friday);
                        IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                        IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);

                        result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user,this._uow);
                    }
                    else
                    {

                        fromDate = DateTime.Now.StartOfWeek(DayOfWeek.Saturday);
                        toDate = DateTime.Now.EndOfWeek(DayOfWeek.Friday);
                        IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                        IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
                        result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user,this._uow);
                    }

                }
                else
                {
                    toDate = fromDate.AddDays(displayPeriod.NumOfDays);
                    IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                    if (presHours.Count() < displayPeriod.NumOfDays)
                    {
                        fromDate = DateTime.Now;
                        toDate = fromDate.AddDays(displayPeriod.NumOfDays);
                        presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                    }
                    IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
                    result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user,this._uow);
                }
            }
            else
            {
                fromDate = DateTime.Now.StartOfWeek(DayOfWeek.Saturday);
                toDate = DateTime.Now.EndOfWeek(DayOfWeek.Friday);
                IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
                result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user,this._uow);



            }








            return result;






        }

        [HttpPost("[action]")]
        public IEnumerable<TimeSheetJson> GetCurrentPeriodConfirm(List<TimeSheetValueJson> workHourJsons)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();

            UserManager userManager = new UserManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            User user = userManager.GetByID(Guid.Parse(workHourJsons[0].UserId));


            DateTime fromDate = workHourJsons[0].Date;

            DateTime toDate = workHourJsons[workHourJsons.Count() - 1].Date; ;

            IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
            IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
            result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user,this._uow);

            return result;






        }

        [HttpPost("[action]")]
        public IEnumerable<TimeSheetJson> GetPreviousPeriodConfirm(WorkHourJson workHourJson)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            if (workHourJson == null)
            {
                workHourJson = new WorkHourJson();
                workHourJson.Date = DateTime.Now;
            }
            var startDate = workHourJson.Date;
            UserManager userManager = new UserManager(this._uow);
            ProjectManager projectManager = new Domain.ProjectManager(this._uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(this._uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currUser);
            User user = userManager.GetByID(Guid.Parse(workHourJson.UserId));
            var dt = startDate.AddDays(-1);

            DateTime fromDate = dt.AddDays(-displayPeriod.NumOfDays);
            DateTime toDate = dt;

            if (displayPeriod.IsWeekly)
            {
                fromDate = dt.StartOfWeek(DayOfWeek.Saturday);
                toDate = dt.EndOfWeek(DayOfWeek.Friday);

                IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
                result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user,this._uow);

            }
            else
            {

                IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
                if (presHours.Count() < displayPeriod.NumOfDays)
                {
                    fromDate = timeSheetManager.GetFirstPresenceHour().Date;
                    toDate = fromDate.AddDays(displayPeriod.NumOfDays);
                    presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                }
                result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user,this._uow);
            }

            return result;



        }

        [HttpGet("[action]")]
        public IEnumerable<TimeSheetJson> ChangeDisplayPeriodToWeeklyConfirm(Guid UserId)
        {
            UserManager um = new UserManager(this._uow);
            var user = um.GetByID(UserId);

            var currentUser = new UserHelper().GetCurrent(this._uow);
            DisplayPeriodManager dpm = new DisplayPeriodManager(this._uow);
            DisplayPeriod dp = new DisplayPeriod();
            dp = dpm.GetDisplayPeriod(currentUser);
            dp.IsWeekly = true;
            dpm.Edit(dp);
            var inputArg = new GetThisMonthDataByUserJson();
            inputArg.userid = user.ID.ToString();
            return GetTimeSheetsByUserId(inputArg);
        }

        #endregion

    }
}
