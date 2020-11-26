using System;
using System.Collections.Generic;

namespace KP.TimeSheets.Domain
{
    public interface ICalendarRepository
    {

        /// <summary>
        /// بدست آوردن تمامی تقویم ها
        /// </summary>
        /// <returns>شئی قابل شمارش از تقویم ها</returns>
        IEnumerable<Calendar> GetAll();

        /// <summary>
        /// بدست آوردن تقویم بر اساس شناسه آن
        /// </summary>
        /// <param name="calendarID">شناسه تقویم</param>
        /// <returns>تقویمی که در بررسی پایگاه داده بدست می آید.</returns>
        Calendar GetByID(Guid calendarID);

        /// <summary>
        /// اضافه کردن تقویم جدید به پایگاه داده
        /// </summary>
        /// <param name="entity">موجودیت مرتبط با تقویم جدید</param>
        void Add(Calendar entity);

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="calendarID"></param>
        void Delete(Guid calendarID);

        /// <summary>
        /// بروزرسانی تقویم
        /// </summary>
        /// <param name="calendar"></param>
        void Edit(Calendar calendar);

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="calendarID">شناسه تقویم </param>
        /// <returns></returns>
        bool IsExistById(Guid calendarID);
    }
}
