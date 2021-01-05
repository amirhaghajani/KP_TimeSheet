using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;


namespace KP.TimeSheets.Persistance
{
    internal class WorkHourRepository : IWorkHourRepository
    {

       
       
        //string _PWAConnString;
        RASContext _RASContext;

        public WorkHourRepository( RASContext rasContext)
        {
            //_PWAConnString = pwaConnString;
            _RASContext = rasContext;
        }

      

       

        /// <summary>
        /// بدست آوردن ساعت کاری بر اساس شناسه آن
        /// </summary>
        /// <param name="workHourID">شناسه ساعت کاری</param>
        /// <returns>ساعت کاری که در بررسی پایگاه داده بدست می آید.</returns>
        public WorkHour GetByID(Guid id)
        {
             return DefaultQuery().First(x => x.ID == id);
        }

        public IEnumerable< WorkHour> GetByProjectID(Guid projectId)
        {
            return DefaultQuery().Where(x => x.ProjectId == projectId);
        }
      

        public IEnumerable<WorkHour> GetByProjectID(Guid projectId, DateTime? from, DateTime? to)
        {
            return DefaultQuery().Where(x => x.ProjectId == projectId && x.Date >= from && x.Date <=to);
        }
        public IEnumerable<WorkHour> GetSentWorkHours(Guid UserId)
        {
            return DefaultQuery().Where(x=>x.EmployeeID == UserId && x.WorkflowStage.Order == 2);
        }


        // <summary>
        /// بدست آوردن ساعات کاری بر اساس شناسه کارمند و بازه تاریخی 
        /// </summary>
        /// <param name="employeeID">شناسه کارمند</param>
        /// <param name="fromDate">از تاریخ</param>
        /// <param name="toDate">تا تاریخ</param>
        /// <returns>ساعات کاری که در بررسی پایگاه داده بدست می آید.</returns>
        public IEnumerable<WorkHour> GetByEpmloyeeID(Guid employeeID, DateTime? fromDate, DateTime? toDate)
        {
            return DefaultQuery()
                .Where(wh => (wh.EmployeeID.Equals(employeeID)
                && wh.Date >= fromDate && wh.Date <= toDate));
        }
        public IEnumerable<WorkHour> GetByEpmloyeeID(Guid employeeID)
        {
            return DefaultQuery().Where(wh => (wh.EmployeeID.Equals(employeeID)));
        }

        /// <summary>
        /// اضافه کردن ساعت کاری جدید به پایگاه داده
        /// </summary>
        /// <param name="workHour">موجودیت مرتبط با ساعت کاری جدید</param>
        public void Add(WorkHour workHour)
        {
            var entity = new WorkHour();
            entity.ID = Guid.NewGuid();
            FillEntity(workHour, entity);
            _RASContext.WorkHours.Add(entity);

        }

        /// <summary>
        /// بروزرسانی ساعت کاری
        /// </summary>
        /// <param name="workHour">موجودیت ساعت کاری</param>
        public void Edit(WorkHour workHour)
        {
            var entity = _RASContext.WorkHours.Find(workHour.ID);
            FillEntity(workHour, entity);
        }

        private static void FillEntity(WorkHour workHour, WorkHour entity)
        {
            entity.Date = workHour.Date;
            entity.ProjectId = workHour.ProjectId;
            entity.EmployeeID = workHour.EmployeeID;
            entity.TaskID = workHour.TaskID;
            entity.Minutes = workHour.Minutes;
            entity.PreviousStage = workHour.PreviousStage;
            entity.WorkflowStageID = workHour.WorkflowStageID;
            entity.ID = workHour.ID;
            entity.Action = workHour.Action;
            entity.Description = workHour.Description;
            
        }

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="workHourID">شناسه ساعت کاری</param>
        public void Delete(Guid workHourID)
        {
            var result = _RASContext.WorkHours.Find(workHourID);
            _RASContext.WorkHours.Remove(result);
        }

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="workHourID">شناسه ساعت حضور</param>
        /// <returns></returns>
        public bool IsExistById(Guid workHourID)
        {
            return _RASContext.WorkHours.Any(x => x.ID == workHourID);
        }

        public IEnumerable<WorkHour> GetThisMonthByUserId(Guid employeeID, DateTime date)
        {
            var thisMonth = date.Month;
            return _RASContext.WorkHours.Where(x => x.EmployeeID == employeeID && x.Date.Month == thisMonth);
        }

        public IEnumerable<WorkHour> GetThisPeriodByUserId(Guid employeeID, DateTime from, DateTime to)
        {
            return _RASContext.WorkHours.Where(x => x.EmployeeID == employeeID && x.Date >= from && x.Date <= to);
        }

        public IEnumerable<WorkHour> GetYesterdayByUserId(Guid employeeID)
        {
            var yesterday = DateTime.Today.AddDays(-1);
            return _RASContext.WorkHours.Where(x => x.EmployeeID == employeeID && x.Date == yesterday);

        }
        // <summary>
        /// بدست آوردن ساعات کاری بر اساس تاریخ و ایدی کارمند 
        /// </summary>
        /// <param name="employeeID">شناسه کارمند</param>
        /// <param name="fromDate">از تاریخ</param>
        /// <param name="toDate">تا تاریخ</param>
        /// <returns>ساعات کاری که در بررسی پایگاه داده بدست می آید.</returns>
        public IEnumerable<WorkHour> GetBydateAndUserId(DateTime? date, Guid userId)
        {
            return _RASContext.WorkHours.Include("WorkflowStage").Where(x => x.EmployeeID == userId && x.Date == date);
        }


        public void SetNewStage(WorkHour workHour)
        {
            var entity = _RASContext.WorkHours.Find(workHour.ID);

            entity.WorkflowStage = workHour.WorkflowStage;
            entity.WorkflowStageID = workHour.WorkflowStageID;

        }




        IEnumerable<WorkHour> IWorkHourRepository.GetBydateAndUserId(DateTime date, Guid userId)
        {
            return DefaultQuery().Where(x => x.Date == date && x.EmployeeID == userId);
        }

        public IEnumerable<WorkHour> GetRegisteredWorkHours(Guid UserId)
        {
            var entity = _RASContext.WorkflowStages.FirstOrDefault(X => X.IsFirst);
            return  DefaultQuery().Where(x => x.EmployeeID == UserId && x.WorkflowStageID == entity.ID);
        }

        public IEnumerable<WorkHour> GetUnConfirmedWorkHours(DateTime date,Guid UserId)
        {
           
            return DefaultQuery().Where(x => x.Date == date && x.WorkflowStage.Order == 1 && x.EmployeeID == UserId); ;
        }

       

        public IEnumerable< WorkHour> GetByDateAndTaskId(DateTime date, Guid Taskid)
        {
            return DefaultQuery().Where(x => x.Date == date &&  x.TaskID == Taskid);
        }


        public IQueryable<WorkHour> DefaultQuery()
        {
            return _RASContext.WorkHours
                .Include(x => x.Employee)
                .Include(y => y.Project)
                .Include(z => z.Task)
                .Include(s=>s.WorkflowStage);
        }

      
        public IEnumerable<WorkHour> GetConfirmedWorkHours(DateTime date, Guid userId)
        {
            return DefaultQuery().Where(x => x.Date == date && x.WorkflowStage.Order > 1 && x.EmployeeID == userId);
        }
    }
}
