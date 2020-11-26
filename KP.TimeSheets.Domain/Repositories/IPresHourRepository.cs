using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public interface IPresHourRepository
    {
        PresenceHour GetByUserIdAndDate(Guid userId, DateTime date);
        
        IEnumerable<PresenceHour> GetThisPeriodByUserId(Guid UserId, DateTime from, DateTime to);

        PresenceHour GetYesterdayByUserId(Guid UserId);
        /// <summary>
        /// بدست آوردن ساعت حضور بر اساس شناسه آن
        /// </summary>
        /// <param name="presenceHourID">شناسه ساعت حضور</param>
        /// <returns>ساعت حضوری که در بررسی پایگاه داده بدست می آید.</returns>
        PresenceHour GetByID(Guid presenceHourID);

        /// <summary>
        /// بدست آوردن ساعت حضور بر اساس شناسه کارمند و بازه تاریخی 
        /// </summary>
        /// <param name="employeeID">شناسه کارمند</param>
        /// <param name="fromDate">از تاریخ</param>
        /// <param name="toDate">تا تاریخ</param>
        /// <returns>ساعات حضوری که در بررسی پایگاه داده بدست می آید.</returns>
        IEnumerable<PresenceHour> GetByEpmloyeeID(Guid employeeID, DateTime? fromDate=null, DateTime? toDate=null);

        /// <summary>
        /// اضافه کردن ساعت حضور جدید به پایگاه داده
        /// </summary>
        /// <param name="presenceHour">موجودیت مرتبط با ساعت حضور جدید</param>
        void Add(PresenceHour presenceHour);

        /// <summary>
        /// بروزرسانی ساعت حضور
        /// </summary>
        /// <param name="presenceHour">موجودیت ساعت حضور</param>
        void Edit(PresenceHour presenceHour);

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="presenceHourID">شناسه ساعت حضور</param>
        void Delete(Guid presenceHourID);

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="presenceHourID">شناسه ساعت حضور</param>
        /// <returns></returns>
        bool IsExistById(Guid presenceHourID);

        /// <summary>
        /// وارد کردن داده های ساعت حضور از پایگاه داده سیستم کارت زنی
        /// </summary>

        PresenceHour GetFirstDate();

       
    }
}
