using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Persistance
{
    internal class DisplayPeriodRepository : IDisplayPeriodRepository
    {

        #region Attributes & Properties

       
        string _PWAConnString;
        RASContext _RASContext;
       



        #endregion

        #region Constructors

        public DisplayPeriodRepository(string pwaConnString, RASContext rasContext)
        {
           
            _PWAConnString = pwaConnString;
            _RASContext = rasContext;
        }

        #endregion

        #region CRUD Methods

        /// <summary>
        /// بدست آوردن دوره نمایش بر اساس شناسه آن
        /// </summary>
        /// <param name="displayPeriodID">شناسه دوره نمایش</param>
        /// <returns>دوره نمایش که در بررسی پایگاه داده بدست می آید.</returns>
        public DisplayPeriod GetByID(Guid displayPeriodID)
        {
            return _RASContext.DisplayPeriods.FirstOrDefault(item => item.ID.Equals(displayPeriodID));
        }

        ///// <summary>
        ///// بدست آوردن دوره نمایش جاری یا فعال بر اساس شناسه کارمند
        ///// </summary>
        ///// <param name="employeeID">شناسه دوره نمایش</param>
        ///// <returns>دوره نمایش که در بررسی پایگاه داده بدست می آید.</returns>
        //public DisplayPeriod GetCurrent(Guid employeeID)
        //{
        //    //return _RASContext.DisplayPeriods
        //    //    .Where(ph => (ph.EmployeeID.Equals(employeeID) && ph.StartDate <= DateTime.Now))
        //    //    .OrderByDescending(ph => ph.StartDate)
        //    //    .FirstOrDefault();

        //    return _RASContext.DisplayPeriods
        //       .FirstOrDefault(ph => ph.EmployeeID.Equals(employeeID));
        //}

        /// <summary>
        /// بدست آوردن دوره نمایش بر اساس شناسه کارمند
        /// </summary>
        /// <param name="employeeID">شناسه کارمند</param>
        /// <returns>دوره نمایش که در بررسی پایگاه داده بدست می آید.</returns>
        public DisplayPeriod GetByEpmloyeeID(Guid employeeID)
        {
            return _RASContext.DisplayPeriods.FirstOrDefault(ph => ph.EmployeeID.Equals(employeeID));
        }

        ///// <summary>
        ///// بدست آوردن دوره های نمایش بر اساس شناسه کارمند
        ///// </summary>
        ///// <param name="employeeID">شناسه کارمند</param>
        ///// <returns>دوره های نمایش که در بررسی پایگاه داده بدست می آید.</returns>
        //public IEnumerable<DisplayPeriod> GetByEpmloyeeID(Guid employeeID)
        //{
        //    return _RASContext.DisplayPeriods.Where(ph => ph.EmployeeID.Equals(employeeID));
        //}

        /// <summary>
        /// اضافه کردن دوره نمایش جدید به پایگاه داده
        /// </summary>
        /// <param name="DisplayPeriod">موجودیت مرتبط با دوره نمایش جدید</param>
        public void Add(DisplayPeriod DisplayPeriod)
        {
            if (DisplayPeriod.ID == Guid.Empty)
                DisplayPeriod.ID = Guid.NewGuid();
            _RASContext.DisplayPeriods.Add(DisplayPeriod);
        }

        /// <summary>
        /// بروزرسانی دوره نمایش
        /// </summary>
        /// <param name="DisplayPeriod">موجودیت دوره نمایش</param>
        public void Edit(DisplayPeriod DisplayPeriod)
        {

            var entity = _RASContext.DisplayPeriods.Find(DisplayPeriod.ID);
            FillEntity(entity, DisplayPeriod);

        }


        public void FillEntity(DisplayPeriod entity, DisplayPeriod displayPeriod)
        {
           
            entity.EmployeeID = displayPeriod.EmployeeID;
            entity.ID = displayPeriod.ID;
            entity.IsWeekly = displayPeriod.IsWeekly;
            entity.NumOfDays = displayPeriod.NumOfDays;
            entity.StartDate = displayPeriod.StartDate;
        }

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="DisplayPeriodID">شناسه دوره نمایش</param>
        public void Delete(Guid DisplayPeriodID)
        {
            var result = _RASContext.DisplayPeriods.Find(DisplayPeriodID);
            _RASContext.DisplayPeriods.Remove(result);
        }

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="DisplayPeriodID">شناسه دوره نمایش</param>
        /// <returns></returns>
        public bool IsExistById(Guid DisplayPeriodID)
        {
            return _RASContext.DisplayPeriods.Any(x => x.ID == DisplayPeriodID);
        }

        #endregion

    }
}
