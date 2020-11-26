using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class TimeSheetManager
    {
        private IUnitOfWork _UOW;
        public TimeSheetManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }
        public WorkHour GetByID(Guid id)
        {
            return _UOW.WorkHourRepository.GetByID(id);
        }

        public IEnumerable<WorkHour> GetByProjectID(Guid projectId)
        {
            return _UOW.WorkHourRepository.GetByProjectID(projectId);
        }
        public IEnumerable<WorkHour> GetByProjectID(Guid projectId,DateTime from,DateTime to)
        {
            return _UOW.WorkHourRepository.GetByProjectID(projectId);
        }
        public IEnumerable<WorkHour> GetSentWorkHours(string userName)
        {
            var userManager = new UserManager(_UOW);
            var curuser = userManager.GetByUserName(userName);
            return _UOW.WorkHourRepository.GetSentWorkHours(curuser.ID);
        }
        public IEnumerable<WorkHour> GetyesterdayworkHoursByUserId(Guid UserId)
        {
            return _UOW.WorkHourRepository.GetYesterdayByUserId(UserId);
        }
        public IEnumerable<WorkHour> GetThisPeriodhworkHoursByUserId(Guid UserId,DateTime from,DateTime to)
        {
            return _UOW.WorkHourRepository.GetThisPeriodByUserId(UserId,from,to);
        }
        public void DeleteWorkHour(Guid id)
        {
            var s = new WorkHourHistoryManager(_UOW).DeleteByworkHourId(id);
            _UOW.WorkHourRepository.Delete(id);
            _UOW.SaveChanges();

        }
        public IEnumerable<WorkHour> GetWorkHoursByUser(User user, DateTime? fromDate = null, DateTime? toDate = null)
        {

            fromDate = fromDate ?? DateTime.MinValue;
            toDate = toDate ?? DateTime.MaxValue;
            return _UOW.WorkHourRepository.GetByEpmloyeeID(user.ID, fromDate, toDate);
        }
        public IEnumerable<WorkHour> GetWorkHoursByUser(User user)
        {
            return _UOW.WorkHourRepository.GetByEpmloyeeID(user.ID);
        }
        public IEnumerable<WorkHour> GetWorkHoursByUser(Guid userId,DateTime date)
        {
            var month = DateUtility.GetPersianManth(date);
            var year = DateUtility.GetPersianYear(date);
            var from = DateUtility.GetMiladiDate(year.ToString() + "/" + month + "/" + "1");
            var to = DateTime.MinValue;
            if (Convert.ToInt16(month) > 6)
                to = DateUtility.GetMiladiDate(year.ToString() + "/" + month + "/" + "30");
            else
                to = DateUtility.GetMiladiDate(year.ToString() + "/" + month + "/" + "31");
            return _UOW.WorkHourRepository.GetByEpmloyeeID(userId ,from,to );
        }

        public void SaveWorkHour(WorkHour workHour)
        {

            var erros = new Validations().ValidateRegisterWorkHour(workHour);
            if (erros.Any())
                throw new ValidationException(erros);
            workHour.PreviousStage = workHour.WorkflowStageID;
            if (_UOW.WorkHourRepository.IsExistById(workHour.ID))
                EditWorkHour(workHour);
            else
                AddWorkHour(workHour);
            _UOW.SaveChanges();
        }
        public IEnumerable<WorkHour> GetUnConfirmedWorkHours(DateTime date , Guid userId)
        {

            return _UOW.WorkHourRepository.GetUnConfirmedWorkHours(date, userId);
        }
        public IEnumerable<WorkHour> GetConfirmedWorkHours(DateTime date, Guid userId)
        {

            return _UOW.WorkHourRepository.GetConfirmedWorkHours(date, userId);
        }
        public void SendWorkHour(WorkHour workHour)
        {
            StageController stage = new StageController(_UOW);
            stage.SetNextStageID(workHour);
            
            _UOW.WorkHourRepository.Edit(workHour);
            _UOW.SaveChanges();

        }
        void AddWorkHour(WorkHour entity)
        {
            _UOW.WorkHourRepository.Add(entity);
        }
        void EditWorkHour(WorkHour entity)
        {
            _UOW.WorkHourRepository.Edit(entity);
        }
        public IEnumerable<WorkHour> GetBydateAndUserId(DateTime date, Guid userId)
        {

            return _UOW.WorkHourRepository.GetBydateAndUserId(date, userId);

        }
        public IEnumerable<WorkHour> GetRegisteredWorkHours(Guid UserId)
        {

            return _UOW.WorkHourRepository.GetRegisteredWorkHours(UserId);
        }
        public IEnumerable< WorkHour> GetByDateAndTaskId(DateTime date,Guid Taskid)
       {
            return _UOW.WorkHourRepository.GetByDateAndTaskId(date, Taskid);
       }
        /// <summary>
        /// WorkHour متد مشخص کردن مدیر پروژه بودن کاربر جاری توسط آبجکت 
        /// </summary>
        /// <param name="workHour"></param>
        /// <returns></returns>
        public bool IsUserProjectMnager(WorkHour workHour,string userName)
        {
            var userManager = new UserManager(_UOW);
            var projectManager = new ProjectManager(_UOW);
            var currentUser = userManager.GetByUserName(userName);
            var project = projectManager.GetByID(workHour.ProjectId);
            if (currentUser.ID == project.OwnerID)
            {
                return true;
            }
            else
            {
                return false;
            }

        }
        /// <summary>
        /// WorkHour متد مشخص کردن مدیر ستادی بودن کاربر جاری توسط آبجکت 
        /// </summary>
        /// <param name="workHour"></param>
        /// <returns></returns>
        public bool IsUserOrganisationMnager(WorkHour workHour,string userName)
        {
            var userManager = new UserManager(_UOW);
            var orgManager = new OrgUnitManager(_UOW);
            var currentUser = userManager.GetByUserName(userName);
            var orgId = userManager.GetByID(workHour.EmployeeID).OrganizationUnit.ID;
            var orgmanager = orgManager.GetByID(orgId);

            if (orgmanager.ManagerID == currentUser.ID)
            {
                return true;
            }
            else
            {
                return false;
            }


        }
        /// <summary>
        ///وضعیت تایید ساعت کار با توجه به کاربر جاری  
        /// </summary>
        /// <param name="workHour"></param>
        /// <returns>" "</returns>
        /// <returns>"Approve "</returns>
        /// <returns>"NotApprove "</returns>
        /// <returns>"Nothing "</returns>
        public string ApprovementStatus(WorkHour workHour , string userName)
        {
            var result = string.Empty;
            var workflowManager = new WorkflowManager(_UOW);
            var stage = workflowManager.GetByID(workHour.WorkflowStageID);
            

            if (IsUserProjectMnager(workHour, userName) && IsUserOrganisationMnager(workHour, userName) && stage.Order == 2)
                 return "NotApprove";
            if (IsUserProjectMnager(workHour, userName) && IsUserOrganisationMnager(workHour, userName) && stage.Order == 3)
                return "NotApprove";
            if (IsUserProjectMnager(workHour, userName) && IsUserOrganisationMnager(workHour, userName) && stage.Order > 3)
                return "Approve";

            if (IsUserProjectMnager(workHour, userName) && stage.Order == 2)
                return  "NotApprove";
            if (IsUserProjectMnager(workHour, userName) && stage.Order >= 3)
                return  "Approve";
            if (IsUserOrganisationMnager(workHour, userName) && stage.Order <= 2 )
                return "Nothing";
            if (IsUserOrganisationMnager(workHour, userName) && stage.Order == 3 )
                return "NotApprove";
            if (IsUserOrganisationMnager(workHour, userName) && stage.Order > 3)
                return "Approve";

            return result;

        }
        public void ApproveWorkHour(WorkHour wh)
        {
         var stagecontroller =     new StageController(_UOW);
            stagecontroller.SetNextStageID(wh);
            _UOW.SaveChanges();

        }
        public void DenyWorkHour(WorkHour wh)
        {
           
            var stagecontroller = new StageController(_UOW);
           

            stagecontroller.SetPreviusStage(wh);
            _UOW.SaveChanges();

        }
        public IEnumerable<WorkHour> GetApproveWorkHoursByUserId(User user,string curUserName)
        {
            var whs = GetWorkHoursByUser(user);
            List<WorkHour> result = new List<WorkHour>();
            foreach (var wh in whs)
            {
                if (ApprovementStatus(wh, curUserName) == "Approve")
                {
                    result.Add(wh);
                }
            }
            return result;

          
        }
        public IEnumerable<WorkHour> GetNotApproveWorkHoursByUserId(User user,string curUserName)
        {
            var whs = GetWorkHoursByUser(user);
            List<WorkHour> result = new List<WorkHour>();
            foreach (var wh in whs)
            {
                if (ApprovementStatus(wh, curUserName) == "NotApprove")
                {
                    result.Add(wh);
                }
            }
            return result;


        }
        public IEnumerable<PresenceHour> GetPresHoursByUser(User user, DateTime fromDate, DateTime toDate)
        {

            var Missions = _UOW.HourlyMissionRepository.GetAllByUserID(user.ID, fromDate, toDate);
            var result = _UOW.PresHourRepository.GetByEpmloyeeID(user.ID, fromDate, toDate).ToList();
            var currentDay = fromDate;
            while (currentDay <= toDate)
            {
                if (result.Any(x => x.Date.Date == currentDay.Date))
                {
                    currentDay = currentDay.AddDays(1);
                    continue;
                }
                var persent = new PresenceHour();
                persent.Date = currentDay;
                persent.EmployeeID = user.ID;
                persent.ID = Guid.NewGuid();
                persent.Hours = 0;
                result.Add(persent);
            }
            foreach (var mision in Missions)
            {
                if (!result.Any(x => x.Date.Date == mision.Date.Date))
                    result.Add(new PresenceHour() {ID = Guid.NewGuid(), Date = mision.Date, Hours = mision.Hours,EmployeeID=user.ID,Employee=user });

                result.First(x => x.Date.Date == mision.Date.Date).Hours += mision.Hours;
                    
            }

            return result;
        }
        public PresenceHour GetPresenceHourByUserIdAndDate(Guid UserId, DateTime date)
        {
            return _UOW.PresHourRepository.GetByUserIdAndDate(UserId, date);
        }
        public IEnumerable<PresenceHour> GetThisMonthPresencHoursByUserId(Guid UserId,DateTime date)
        {
            var month = DateUtility.GetPersianManth(date);
            var year = DateUtility.GetPersianYear(date);
            var from = DateUtility.GetMiladiDate(year.ToString() + "/" + month + "/" + "1");
            var to = DateTime.MinValue;
            if (Convert.ToInt16(month) > 6)
                to = DateUtility.GetMiladiDate(year.ToString() + "/" + month + "/" + "30");
            else
                to = DateUtility.GetMiladiDate(year.ToString() + "/" + month + "/" + "31");
            return _UOW.PresHourRepository.GetByEpmloyeeID(UserId,from,to);
        }
        public IEnumerable<PresenceHour> GetThisPeriodPresencHoursByUserId(Guid UserId, DateTime from, DateTime to)
        {
            return _UOW.PresHourRepository.GetThisPeriodByUserId(UserId, from, to);
        }
        public PresenceHour GetyesterdayPresencHoursByUserId(Guid UserId)
        {
            return _UOW.PresHourRepository.GetYesterdayByUserId(UserId);
        }
        public PresenceHour GetFirstPresenceHour()
        {
            return _UOW.PresHourRepository.GetFirstDate();
        }

        public List<WorkHour> GetByUserIdsAndProjectIds(List<Guid> userids, List<Guid> ProjectIds, DateTime from , DateTime to)
        {
            var FilterusersworkHours =new List<WorkHour>();
            var FilterprojectsworkHours = new List<WorkHour>();

            foreach (var userid in userids)
            {
                foreach (var FilterusersworkHour in _UOW.WorkHourRepository.GetByEpmloyeeID(userid, from, to))
                {
                    FilterusersworkHours.Add(FilterusersworkHour);
                } 
            }

            foreach (var projectid in ProjectIds)
            {
                foreach (var FilterprojectsworkHour in FilterusersworkHours.ToList())
                {
                    if (projectid == FilterprojectsworkHour.ProjectId)
                    {
                        FilterusersworkHours.Add(FilterprojectsworkHour);
                    }
                    
                }
            }
            return FilterusersworkHours;
        }


    }
}
