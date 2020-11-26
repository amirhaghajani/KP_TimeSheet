using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public interface IHolidayRepository
    {
        #region Public Methods

        IEnumerable<Holiday> GetAll();

        /// <summary>
        /// بدست آوردن تقویم بر اساس شناسه آن
        /// </summary>
        /// <param name="holidayID">شناسه تقویم</param>
        /// <returns>تقویمی که در بررسی پایگاه داده بدست می آید.</returns>
        Holiday GetByID(Guid holidayID);

        /// <summary>
        /// اضافه کردن تقویم جدید به پایگاه داده
        /// </summary>
        /// <param name="entity">موجودیت مرتبط با تقویم جدید</param>
        /// <returns>تقویمی که پس از اضافه شده به پایگاه داده بازگردانده می شود.</returns>
        void Add(List<Holiday> holidays);


        /// <summary>
        /// حذف تقویم با شماره تقویم از پایگاه داده
        /// </summary>
        /// <param name="calendarID"></param>
        void Delete(Guid HolidayID);

        /// <summary>
        /// واکشی یک آیتم برای ویرایش
        /// </summary>
        /// <param name="calendarID"></param>
        /// <returns></returns>
        void Edit(Holiday holiday);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        bool IsExistById(Guid id);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="calenderId"></param>
        /// <returns></returns>
         IEnumerable<Holiday> ExistItemsByCalenderId(Guid calenderId);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="holidayes"></param>
        void DeleteRange(List<Holiday> holidayes);

        #endregion
    }
}
