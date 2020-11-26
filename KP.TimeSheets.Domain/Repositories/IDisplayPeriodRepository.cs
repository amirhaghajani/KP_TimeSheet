using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public interface IDisplayPeriodRepository
    {

        /// <summary>
        /// بدست آوردن دوره نمایش بر اساس شناسه آن
        /// </summary>
        /// <param name="displayPeriodID">شناسه دوره نمایش</param>
        /// <returns>دوره نمایش که در بررسی پایگاه داده بدست می آید.</returns>
        DisplayPeriod GetByID(Guid displayPeriodID);

        ///// <summary>
        ///// بدست آوردن دوره نمایش جاری یا فعال بر اساس شناسه کارمند
        ///// </summary>
        ///// <param name="employeeID">شناسه دوره نمایش</param>
        ///// <returns>دوره نمایش که در بررسی پایگاه داده بدست می آید.</returns>
        //DisplayPeriod GetCurrent(Guid employeeID);

        ///// <summary>
        ///// بدست آوردن دوره های نمایش بر اساس شناسه کارمند
        ///// </summary>
        ///// <param name="employeeID">شناسه کارمند</param>
        ///// <returns>دوره های نمایش که در بررسی پایگاه داده بدست می آید.</returns>
        //IEnumerable<DisplayPeriod> GetByEpmloyeeID(Guid employeeID);

        /// <summary>
        /// بدست آوردن دوره نمایش بر اساس شناسه کارمند
        /// </summary>
        /// <param name="employeeID">شناسه کارمند</param>
        /// <returns>دوره نمایش که در بررسی پایگاه داده بدست می آید.</returns>
        DisplayPeriod GetByEpmloyeeID(Guid employeeID);

        /// <summary>
        /// اضافه کردن دوره نمایش جدید به پایگاه داده
        /// </summary>
        /// <param name="DisplayPeriod">موجودیت مرتبط با دوره نمایش جدید</param>
        void Add(DisplayPeriod DisplayPeriod);

        /// <summary>
        /// بروزرسانی دوره نمایش
        /// </summary>
        /// <param name="DisplayPeriod">موجودیت دوره نمایش</param>
        void Edit(DisplayPeriod DisplayPeriod);

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="DisplayPeriodID">شناسه دوره نمایش</param>
        void Delete(Guid DisplayPeriodID);

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="DisplayPeriodID">شناسه دوره نمایش</param>
        /// <returns></returns>
        bool IsExistById(Guid DisplayPeriodID);

    }
}
