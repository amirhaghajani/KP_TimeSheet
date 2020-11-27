using Newtonsoft.Json.Linq;
using KP.TimeSheets.Domain;
using KP.TimeSheets.Persistance;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace KP.TimeSheets.MVC
{
    public class TimeSheetsAPIController : ControllerBase
    {
        #region Register Methods



        [HttpPost]
        public IEnumerable<WorkHourHistoryJson> GetHistoryWorkHour(WorkHourJson WorkHourJson)
        {
            var result = new List<WorkHourHistoryJson>();
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            WorkHourHistoryManager historyManagerh = new WorkHourHistoryManager(uow);
            User currUser = new UserHelper().GetCurrent();
            result = new WorkHourHistoryAssembler().ToJsons(historyManagerh.GetByWorkHourID(WorkHourJson.ID)).ToList();
            return result;
        }

        [HttpGet]
        public IEnumerable<TimeSheetJson> ChangeDisplayPeriodToWeekly()
        {

            UnitOfWork uow = new UnitOfWork();
            UserManager um = new UserManager(uow);
            var currentUser = new UserHelper().GetCurrent();
            DisplayPeriodManager dpm = new DisplayPeriodManager(uow);
            DisplayPeriod dp = new DisplayPeriod();
            dp = dpm.GetDisplayPeriod(currentUser);
            dp.IsWeekly = true;
            dpm.Edit(dp);
            return GetTimeSheets();
        }

        [HttpPost]
        public IEnumerable<TimeSheetJson> GetTimeSheetsByDateAndNumberOfDay(PeriodNumberDateJson period)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            ProjectManager projectManager = new Domain.ProjectManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
            var displayPeriod = DisplayPeriodUtilities.ConvertPeriodNumberDateJsonToDisplayPeriod(period);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent();
            displayPeriodMnager.Save(displayPeriod);
            DateTime fromDate = displayPeriod.StartDate;
            DateTime toDate = fromDate.AddDays(displayPeriod.NumOfDays);
            IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
            IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
            result = TimeSheetAssembler.ToJsonsForRegister(presHours, workHours);

            return result;
        }

        [HttpPost]
        public IEnumerable<WorkHourJson> GetCurrentPeriodSentWorkHours(List<TimeSheetValueJson> workHourJsons)
        {
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            User currUser = new UserHelper().GetCurrent();
            DateTime fromDate = workHourJsons[0].Date;
            DateTime toDate = workHourJsons[workHourJsons.Count() - 1].Date;
            return new WorkHourAssembler().ToJsons(timeSheetManager.GetSentWorkHours(currUser.UserName).Where(x => x.Date >= fromDate && x.Date <= toDate).OrderBy(c => c.Date));

        }

        [HttpPost]
        public IEnumerable<WorkHourJson> GetWorkHoursByDate(WorkHourJson WorkHourJson)
        {
            var result = new List<WorkHourJson>();
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            User currUser = new UserHelper().GetCurrent();
            result = new WorkHourAssembler().ToJsons(timeSheetManager.GetWorkHoursByUser(currUser, WorkHourJson.Date, WorkHourJson.Date)).ToList();
            return result;
        }

        [HttpGet]
        public IEnumerable<WorkHourJson> GetSentWorkHours()
        {
            var userName = User.Identity.Name;
            UnitOfWork uow = new UnitOfWork();
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            return new WorkHourAssembler().ToJsons(timeSheetManager.GetSentWorkHours(userName).OrderBy(c => c.Date));
        }

        [HttpGet]
        public IEnumerable<TimeSheetJson> GetTimeSheets()
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            ProjectManager projectManager = new Domain.ProjectManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
            User currUser = new UserHelper().GetCurrent();
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

        [HttpPost]
        public IEnumerable<WorkHourOnProjecstJson> GetThisMonthProjects(TimeSheetValueJson json)
        {
            List<WorkHourOnProjecstJson> result = new List<WorkHourOnProjecstJson>();
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent();

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

        [HttpPost]
        public string GetCurrentUser()
        {
            return User.Identity.Name;
        }

        [HttpPost]
        public IEnumerable<TimeSheetJson> GetCurrentPeriod(List<TimeSheetValueJson> workHourJsons)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            User currUser = new UserHelper().GetCurrent();
            DateTime fromDate = workHourJsons[0].Date;
            DateTime toDate = workHourJsons[workHourJsons.Count() - 1].Date;
            IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
            IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
            result = TimeSheetAssembler.ToJsonsForRegister(presHours, workHours);
            return result;
        }

        [HttpPost]
        public IEnumerable<TimeSheetJson> GetNextPeriod(TimeSheetValueJson workHourJson)
        {

            List<TimeSheetJson> result = new List<TimeSheetJson>();
            if (workHourJson == null)
            {
                workHourJson = new TimeSheetValueJson();
                workHourJson.Date = DateTime.Now.AddDays(-7);

            }

            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent();
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

        [HttpPost]
        public IEnumerable<TimeSheetJson> GetPreviousPeriod(WorkHourJson workHourJson)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            if (workHourJson == null)
            {
                workHourJson = new WorkHourJson();
                workHourJson.Date = DateTime.Now;
            }
            var startDate = workHourJson.Date;
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            ProjectManager projectManager = new Domain.ProjectManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent();
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

        [HttpPost]
        public List<string> SaveWorkHours(WorkHourJson workHourJson)
        {

            List<string> result = new List<string>();

            try
            {
                UnitOfWork uow = new UnitOfWork();
                UserManager userManager = new UserManager(uow);
                TaskManager taskManager = new TaskManager(uow);
                ProjectManager prjManager = new ProjectManager(uow);
                TimeSheetManager tsManager = new TimeSheetManager(uow);
                Validations validate = new Validations();
                User currUser = new UserHelper().GetCurrent();
                WorkHour workHour = workHourJson.ToWorkHour();
                workHour.Task = taskManager.GetByID(workHour.TaskID);
                workHour.TaskID = workHour.Task.ID;
                workHour.Project = prjManager.GetByID(workHourJson.ProjectID);
                workHour.ProjectId = workHour.Project.ID;
                workHour.EmployeeID = currUser.ID;
                workHour.Employee = userManager.GetByID(currUser.ID);
                workHour.WorkflowStage = new WorkflowManager(uow).FirstStage();
                workHour.WorkflowStageID = workHour.WorkflowStage.ID;
                workHour.Description = workHourJson.Description;
                 tsManager.SaveWorkHour(workHour);
                 HistoryUtilities.RegisterSaveHistory(workHour);
            }

            catch (ValidationException ex)
            {

                result= ex.Errors;
            }
            return result;
        }

        [HttpPost]
        public List<string> SendWorkHour(WorkHourJson workHourJson)//JObject jsonObject
        {
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            TimeSheetManager WHM = new TimeSheetManager(uow);
            User currUser = new UserHelper().GetCurrent();
            Validations validate = new Validations();
            var WorkHour = WHM.GetByID(workHourJson.ID);
            List<string> result = new List<string>();
            result = validate.ValidateRegisterWorkHour(WorkHour);

            if (result.Count() == 0)
            {
                if (WorkHour.WorkflowStage.IsFirst)
                {
                    WHM.SendWorkHour(WorkHour);
                    HistoryUtilities.RegisterSendHistory(WorkHour);
                    result.Add("ارسال کارکرد با موفقیت انجام گردید");
                }
            }

            return result;
        }

        [HttpPost]
        public List<string> SendWorkHours(WorkHourJson workHourJson)//JObject jsonObject
        {

            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            TimeSheetManager WHM = new TimeSheetManager(uow);
            User currUser = new UserHelper().GetCurrent();
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
                    HistoryUtilities.RegisterSendHistory(wh);
                    result.Add("عملیات ارسال کارکرد ها با موفقیت انجام گردید");
                }
            }

            return result;
        }

        [HttpPost]
        public IEnumerable<WorkHourJson> GetUnConfirmedWorkHours(WorkHourJson workHourJson)//JObject jsonObject)
        {
            UnitOfWork uow = new UnitOfWork();
            TimeSheetManager WHM = new TimeSheetManager(uow);
            User currUser = new UserHelper().GetCurrent();
            return new WorkHourAssembler().ToJsons(WHM.GetUnConfirmedWorkHours(workHourJson.Date, currUser.ID));
        }

        [HttpPost]
        public PresenceHour GetPresenceHourByDate(WorkHourJson workHourJson)//JObject jsonObject)
        {
            UnitOfWork uow = new UnitOfWork();
            TimeSheetManager WHM = new TimeSheetManager(uow);
            User currUser = new UserHelper().GetCurrent();
            return WHM.GetPresenceHourByUserIdAndDate(currUser.ID, workHourJson.Date);
        }

        [HttpPost]
        public IEnumerable<WorkHourJson> GetConfirmedWorkHours(WorkHourJson workHourJson)//JObject jsonObject)
        {
            UnitOfWork uow = new UnitOfWork();
            TimeSheetManager WHM = new TimeSheetManager(uow);
            User currUser = new UserHelper().GetCurrent();
            return new WorkHourAssembler().ToJsons(WHM.GetConfirmedWorkHours(workHourJson.Date, currUser.ID));
        }

        [HttpPost]
        public bool DeleteWorkHours(WorkHourJson workHourJson)//JObject jsonObject)
        {
            UnitOfWork uow = new UnitOfWork();
            TimeSheetManager WHM = new TimeSheetManager(uow);
            WHM.DeleteWorkHour(workHourJson.ID);
            return true;
        }

        [HttpPost]
        public string CurrentUser()//JObject jsonObject)
        {
            string UserName = User.Identity.Name;
            return UserName;
        }

        [HttpGet]
        public AllEntityJson GetYesterdayData()
        {

            UnitOfWork uow = new UnitOfWork();
            TimeSheetManager timesheetManager = new Domain.TimeSheetManager(uow);
            User currUser = new UserHelper().GetCurrent();
            var presenceour = timesheetManager.GetyesterdayPresencHoursByUserId(currUser.ID);
            var workours = timesheetManager.GetyesterdayworkHoursByUserId(currUser.ID);
            return new HomeEntityAssembler().ToJson(presenceour, workours, User.Identity.Name);

        }


        [HttpGet]
        public AllEntityJson GetThisMonthDataForHomePage()
        {
            UnitOfWork uow = new UnitOfWork();
            TimeSheetManager timesheetManager = new Domain.TimeSheetManager(uow);
            User currUser = new UserHelper().GetCurrent();
            var presenceours = timesheetManager.GetThisMonthPresencHoursByUserId(currUser.ID, DateTime.Now);
            var workours = timesheetManager.GetWorkHoursByUser(currUser.ID, DateTime.Now);
            return new HomeEntityAssembler().ToJson(presenceours, workours);
        }

        [HttpPost]
        public AllEntityJson GetThisMonthData(TimeSheetValueJson workHourJson)
        {
            UnitOfWork uow = new UnitOfWork();
            TimeSheetManager timesheetManager = new Domain.TimeSheetManager(uow);
            User currUser = new UserHelper().GetCurrent();
            var presenceours = timesheetManager.GetThisMonthPresencHoursByUserId(currUser.ID, workHourJson.Date);
            var workours = timesheetManager.GetWorkHoursByUser(currUser.ID, workHourJson.Date);
            return new HomeEntityAssembler().ToJson(presenceours, workours);
        }

        [HttpPost]
        public IEnumerable<WorkHourOnProjecstJson> GetThisPeriodProjects(List<TimeSheetValueJson> workHourJsons)
        {
            List<WorkHourOnProjecstJson> result = new List<WorkHourOnProjecstJson>();
            UnitOfWork uow = new UnitOfWork();
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
            User currUser = new UserHelper().GetCurrent();
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

        [HttpPost]
        public AllEntityJson GetThisPeriodData(List<TimeSheetValueJson> workHourJsons)
        {

            UnitOfWork uow = new UnitOfWork();
            User currUser = new UserHelper().GetCurrent();
            TimeSheetManager timesheetManager = new Domain.TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currUser);
            DateTime fromDate = workHourJsons[0].Date;
            DateTime toDate = workHourJsons[workHourJsons.Count() - 1].Date;
            var presenceours = timesheetManager.GetThisPeriodPresencHoursByUserId(currUser.ID, fromDate, toDate);
            var workours = timesheetManager.GetThisPeriodhworkHoursByUserId(currUser.ID, fromDate, toDate);
            return new HomeEntityAssembler().ToJson(presenceours, workours);
        }

        [HttpPost]
        public IEnumerable<WorkHourOnProjecstJson> GetThisPeriodProjectsByUserId(GetThisMonthDataByUserJson json)
        {
            List<WorkHourOnProjecstJson> result = new List<WorkHourOnProjecstJson>();
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
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

        [HttpPost]
        public AllEntityJson GetThisPeriodDataByUserId(GetThisMonthDataByUserJson json)
        {

            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            User currUser = userManager.GetByID(Guid.Parse(json.userid));
            TimeSheetManager timesheetManager = new Domain.TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
            DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currUser);

            DateTime fromDate = json.values[0].Date;
            DateTime toDate = json.values[json.values.Count() - 1].Date;

            var presenceours = timesheetManager.GetThisPeriodPresencHoursByUserId(currUser.ID, fromDate, toDate);
            var workours = timesheetManager.GetThisPeriodhworkHoursByUserId(currUser.ID, fromDate, toDate);
            return new HomeEntityAssembler().ToJson(presenceours, workours);

        }

        [HttpPost]
        public AllEntityJson GetThisMonthDataByUser(GetThisMonthDataByUserJson json)
        {

            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            TimeSheetManager timesheetManager = new Domain.TimeSheetManager(uow);
            User currUser = userManager.GetByID(Guid.Parse(json.userid.ToString()));
            var presenceours = timesheetManager.GetThisMonthPresencHoursByUserId(currUser.ID, json.value.Date);
            var workours = timesheetManager.GetWorkHoursByUser(currUser.ID, json.value.Date);
            return new HomeEntityAssembler().ToJson(presenceours, workours);

        }

        [HttpPost]
        public IEnumerable<WorkHourOnProjecstJson> GetThisMonthProjectsByUserID(GetThisMonthDataByUserJson json)
        {
            List<WorkHourOnProjecstJson> result = new List<WorkHourOnProjecstJson>();
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
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

        [HttpGet]
        public IEnumerable<UserJson> GetUsersInCurrentUserOrganisation()
        {
            var manager = new UserManager(new UnitOfWork());
            var user = new UserHelper().GetCurrent();
            var result = manager.GetMyEmployees(user);
            return new UserAssembler().ToJsons(result);
        }


        [HttpGet]
        public IEnumerable<TimeSheetJson> GetTimeSheetsByUserIdForFirstTime(Guid userID)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            ProjectManager projectManager = new Domain.ProjectManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
            User currentUser = new UserHelper().GetCurrent();
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

            result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user);
            return result;

        }


        [HttpPost]
        public IEnumerable<TimeSheetJson> GetTimeSheetsByUserId(GetThisMonthDataByUserJson json)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            ProjectManager projectManager = new Domain.ProjectManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
            User currentUser = new UserHelper().GetCurrent();
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

            result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user);
            return result;

        }

        [HttpPost]
        public string ApproveWorkHour(ApproveAndDenyJson data)
        {
            IEnumerable<WorkHour> result;
            UnitOfWork uow = new UnitOfWork();

            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            result = timeSheetManager.GetByDateAndTaskId(data.date, Guid.Parse(data.id)).ToList();


            foreach (var item in result)
            {
                if (timeSheetManager.IsUserOrganisationMnager(item, User.Identity.Name) && timeSheetManager.IsUserProjectMnager(item, User.Identity.Name) && item.WorkflowStage.Order == 2)
                {
                    for (int i = 0; i < 2; i++)
                    {
                        timeSheetManager.ApproveWorkHour(item);
                        HistoryUtilities.RegisterApproveHistory(data, item);
                    }
                }
                else
                {
                    timeSheetManager.ApproveWorkHour(item);
                    HistoryUtilities.RegisterApproveHistory(data, item);
                }

            }


            return "عملیات تایید با موفقیت انجام گردید";
        }

        [HttpPost]
        public string DenyWorkHour(ApproveAndDenyJson data)
        {
            IEnumerable<WorkHour> result;
            UnitOfWork uow = new UnitOfWork();
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);

            result = timeSheetManager.GetByDateAndTaskId(data.date, Guid.Parse(data.id)).ToList();
            foreach (var item in result)
            {
                timeSheetManager.DenyWorkHour(item);
                HistoryUtilities.RegisterDenyHistory(data, item);

            }


            return "عملیات رد با موفقیت انجام گردید";
        }

        [HttpPost]
        public IEnumerable<WorkHourJson> GetRegistereCurrentPerioddWorkHours(List<TimeSheetValueJson> workHourJsons)
        {
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            User currUser = new UserHelper().GetCurrent();
            DateTime fromDate = workHourJsons[0].Date;
            DateTime toDate = workHourJsons[workHourJsons.Count() - 1].Date;
            var result = timeSheetManager.GetRegisteredWorkHours(currUser.ID)
                .Where(x => x.Date >= fromDate && x.Date <= toDate)
                .OrderBy(c => c.Date).ToList();
            return new WorkHourAssembler().ToJsons(result);
        }


        [HttpGet]
        public IEnumerable<WorkHourJson> GetRegisteredWorkHours()
        {
            UnitOfWork uow = new UnitOfWork();

            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            var currentUser = new UserHelper().GetCurrent();
            return new WorkHourAssembler().ToJsons(timeSheetManager.GetRegisteredWorkHours(currentUser.ID).OrderBy(c => c.Date));
        }

        [HttpPost]
        public IEnumerable<TimeSheetJson> GetTimeSheetsByDateAndNumberOfDayConfirm(PeriodNumberDateJson period)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            ProjectManager projectManager = new Domain.ProjectManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
            var displayPeriod = DisplayPeriodUtilities.ConvertPeriodNumberDateJsonToDisplayPeriod(period);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent();
            User user = userManager.GetByID(Guid.Parse(period.UserId));
            displayPeriodMnager.Save(displayPeriod);

            DateTime fromDate = displayPeriod.StartDate;
            DateTime toDate = fromDate.AddDays(displayPeriod.NumOfDays);
            IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(user, fromDate, toDate);
            IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(user, fromDate, toDate);
            result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user);

            return result;
        }

        [HttpPost]
        public IEnumerable<TimeSheetJson> GetNextPeriodConfirm(TimeSheetValueJson workHourJson)
        {



            List<TimeSheetJson> result = new List<TimeSheetJson>();
            if (workHourJson == null)
            {
                workHourJson = new TimeSheetValueJson();
                workHourJson.Date = DateTime.Now.AddDays(-7);

            }

            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent();
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

                        result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user);
                    }
                    else
                    {

                        fromDate = DateTime.Now.StartOfWeek(DayOfWeek.Saturday);
                        toDate = DateTime.Now.EndOfWeek(DayOfWeek.Friday);
                        IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                        IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
                        result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user);
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
                    result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user);
                }
            }
            else
            {
                fromDate = DateTime.Now.StartOfWeek(DayOfWeek.Saturday);
                toDate = DateTime.Now.EndOfWeek(DayOfWeek.Friday);
                IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
                IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
                result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user);



            }








            return result;






        }

        [HttpPost]
        public IEnumerable<TimeSheetJson> GetCurrentPeriodConfirm(List<TimeSheetValueJson> workHourJsons)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();


            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent();
            User user = userManager.GetByID(Guid.Parse(workHourJsons[0].UserId));


            DateTime fromDate = workHourJsons[0].Date;

            DateTime toDate = workHourJsons[workHourJsons.Count() - 1].Date; ;

            IEnumerable<PresenceHour> presHours = timeSheetManager.GetPresHoursByUser(currUser, fromDate, toDate);
            IEnumerable<WorkHour> workHours = timeSheetManager.GetWorkHoursByUser(currUser, fromDate, toDate);
            result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user);

            return result;






        }

        [HttpPost]
        public IEnumerable<TimeSheetJson> GetPreviousPeriodConfirm(WorkHourJson workHourJson)
        {
            List<TimeSheetJson> result = new List<TimeSheetJson>();
            if (workHourJson == null)
            {
                workHourJson = new WorkHourJson();
                workHourJson.Date = DateTime.Now;
            }
            var startDate = workHourJson.Date;
            UnitOfWork uow = new UnitOfWork();
            UserManager userManager = new UserManager(uow);
            ProjectManager projectManager = new Domain.ProjectManager(uow);
            TimeSheetManager timeSheetManager = new TimeSheetManager(uow);
            DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(uow);
            //SyncWithPWA(uow);
            User currUser = new UserHelper().GetCurrent();
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
                result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user);

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
                result = TimeSheetAssembler.ToJsonsForConfirm(presHours, workHours, user);
            }

            return result;



        }

        [HttpGet]
        public IEnumerable<TimeSheetJson> ChangeDisplayPeriodToWeeklyConfirm(Guid UserId)
        {
            UnitOfWork uow = new UnitOfWork();
            UserManager um = new UserManager(uow);
            var user = um.GetByID(UserId);

            var currentUser = new UserHelper().GetCurrent();
            DisplayPeriodManager dpm = new DisplayPeriodManager(uow);
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
