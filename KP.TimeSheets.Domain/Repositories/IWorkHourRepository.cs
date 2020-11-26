using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public interface IWorkHourRepository
    {
        /// <summary>
        /// توسط آیدی تسک و تاریخ
        /// </summary>
        /// <param name="id">TaskId</param>
        /// <param name="date">Date</param>
        /// <returns></returns>
        IEnumerable< WorkHour> GetByDateAndTaskId(DateTime date, Guid Taskid);

        /// <summary>
        /// گرفتن ارسال شده ها
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        IEnumerable<WorkHour> GetSentWorkHours(Guid UserId);

        /// <summary>
        /// بدست آوردن ساعت کاری بر اساس شناسه آن
        /// </summary>
        /// <param name="id">شناسه ساعت کاری</param>
        /// <returns>ساعت کاری که در بررسی پایگاه داده بدست می آید.</returns>
        WorkHour GetByID(Guid id);

        IEnumerable<WorkHour> GetByProjectID(Guid projectId);

        IEnumerable<WorkHour> GetByProjectID(Guid projectId, DateTime? from, DateTime? to);
        // <summary>
        /// بدست آوردن ساعات کاری بر اساس شناسه کارمند و  تاریخ 
        /// </summary>
        /// <param name="userId">شناسه کارمند</param>
        /// <param name="Date">از تاریخ</param>
        /// <returns>ساعات کاری که در بررسی پایگاه داده بدست می آید.</returns>
        IEnumerable<WorkHour> GetBydateAndUserId(DateTime? date, Guid userId);

        // <summary>
        /// بدست آوردن ساعات کاری بر اساس شناسه کارمند و بازه تاریخی 
        /// </summary>
        /// <param name="employeeID">شناسه کارمند</param>
        /// <param name="fromDate">از تاریخ</param>
        /// <param name="toDate">تا تاریخ</param>
        /// <returns>ساعات کاری که در بررسی پایگاه داده بدست می آید.</returns>
        IEnumerable<WorkHour> GetByEpmloyeeID(Guid employeeID, DateTime? fromDate = null, DateTime? toDate = null);
        IEnumerable<WorkHour> GetByEpmloyeeID(Guid employeeID);
        // <summary>
        /// بدست آوردن ساعات کاری دیروز بر اساس شناسه کارمند  
        /// </summary>
        /// <param name="employeeID">شناسه کارمند</param>
        /// <returns>ساعات کاری که در بررسی پایگاه داده بدست می آید.</returns>
        IEnumerable<WorkHour> GetYesterdayByUserId(Guid employeeID);

        // <summary>
        /// بدست آوردن ساعات کاری دیروز بر اساس شناسه کارمند  
        /// </summary>
        /// <param name="employeeID">شناسه کارمند</param>
        /// <returns>ساعات کاری که در بررسی پایگاه داده بدست می آید.</returns>
        IEnumerable<WorkHour> GetThisMonthByUserId(Guid employeeID, DateTime date);

        // <summary>
        /// بدست آوردن ساعات کاری دوره جاری بر اساس شناسه کارمند  
        /// </summary>
        /// <param name="employeeID">شناسه کارمند</param>
        /// <returns>ساعات کاری که در بررسی پایگاه داده بدست می آید.</returns>
        IEnumerable<WorkHour> GetThisPeriodByUserId(Guid employeeID, DateTime from, DateTime to);

        /// <summary>
        /// اضافه کردن ساعت کاری جدید به پایگاه داده
        /// </summary>
        /// <param name="workHour">موجودیت مرتبط با ساعت کاری جدید</param>
        void Add(WorkHour workHour);

        /// <summary>
        /// بروزرسانی ساعت کاری
        /// </summary>
        /// <param name="workHour">موجودیت ساعت کاری</param>
        void Edit(WorkHour workHour);

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="workHourID">شناسه ساعت کاری</param>
        void Delete(Guid workHourID);

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="workHourID">شناسه ساعت حضور</param>
        /// <returns></returns>
        bool IsExistById(Guid workHourID);

        /// <summary>
        /// ست کردن استیج جدید
        /// </summary>
        /// <param name="workHourID">شناسه ساعت حضور</param>
        /// <returns></returns>
        void SetNewStage(WorkHour workHour);

        IEnumerable<WorkHour> GetUnConfirmedWorkHours(DateTime date, Guid UserId);

        IEnumerable<WorkHour> GetConfirmedWorkHours(DateTime date, Guid userId);
        IEnumerable<WorkHour> GetBydateAndUserId(DateTime date, Guid userId);

        IEnumerable<WorkHour> GetRegisteredWorkHours(Guid UserId);





    }
}
