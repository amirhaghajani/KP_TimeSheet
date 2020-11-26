using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
namespace KP.TimeSheets.Persistance
{
    internal class PresHourRepository : IPresHourRepository
    {

        #region Attributes & Properties

      
        string _PWAConnString;
        RASContext _RASContext;
       

        #endregion

        #region Constructors

        public PresHourRepository(string pwaConnString, RASContext rasContext)
        {
            _PWAConnString = pwaConnString;
            _RASContext = rasContext;
        }

        #endregion

        #region CRUD Methods

        /// <summary>
        /// بدست آوردن ساعت حضور بر اساس شناسه آن
        /// </summary>
        /// <param name="presenceHourID">شناسه ساعت حضور</param>
        /// <returns>ساعت حضوری که در بررسی پایگاه داده بدست می آید.</returns>
        public PresenceHour GetByID(Guid presenceHourID)
        {
            return _RASContext.PresenceHours.FirstOrDefault(item => item.ID.Equals(presenceHourID));
        }

        /// <summary>
        /// بدست آوردن ساعت حضور بر اساس شناسه کارمند و بازه تاریخی 
        /// </summary>
        /// <param name="employeeID">شناسه کارمند</param>
        /// <param name="fromDate">از تاریخ</param>
        /// <param name="toDate">تا تاریخ</param>
        /// <returns>ساعات حضوری که در بررسی پایگاه داده بدست می آید.</returns>
        public IEnumerable<PresenceHour> GetByEpmloyeeID(Guid employeeID, DateTime? fromDate = null, DateTime? toDate = null)
        {
            fromDate = fromDate ?? DateTime.MinValue;
            toDate = toDate ?? DateTime.MaxValue;
            return _RASContext.PresenceHours.Where(ph => (ph.EmployeeID.Equals(employeeID) && ph.Date >= fromDate && ph.Date <= toDate));
        }

        /// <summary>
        /// اضافه کردن ساعت حضور جدید به پایگاه داده
        /// </summary>
        /// <param name="presenceHour">موجودیت مرتبط با ساعت حضور جدید</param>
        public void Add(PresenceHour presenceHour)
        {
            if (presenceHour.ID == Guid.Empty)
                presenceHour.ID = Guid.NewGuid();
            _RASContext.PresenceHours.Add(presenceHour);
        }

        // <summary>
        /// بروزرسانی ساعت حضور
        /// </summary>
        /// <param name="presenceHour">موجودیت ساعت حضور</param>
        public void Edit(PresenceHour presenceHour)
        {
            var entity = _RASContext.PresenceHours.Find(presenceHour.ID);
            entity.Hours = presenceHour.Hours;
        }

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="presenceHourID">شناسه ساعت حضور</param>
        public void Delete(Guid presenceHourID)
        {
            var result = _RASContext.PresenceHours.Find(presenceHourID);
            _RASContext.PresenceHours.Remove(result);
        }

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="presenceHourID">شناسه ساعت حضور</param>
        /// <returns></returns>
        public bool IsExistById(Guid presenceHourID)
        {
            return _RASContext.PresenceHours.Any(x => x.ID == presenceHourID);
        }

        /// <summary>
        /// وارد کردن داده های پروژه از PWA
        /// </summary>
       

        public PresenceHour GetByUserIdAndDate(Guid userId,DateTime date)
        {
            return DefaultQuery().FirstOrDefault(x => x.Date == date && x.EmployeeID == userId);
        }

        public PresenceHour GetYesterdayByUserId(Guid UserId)
        {
            var yesterday = DateTime.Today.AddDays(-1);
            var entity= _RASContext.PresenceHours.FirstOrDefault(x => x.EmployeeID == UserId && x.Date == yesterday);
            if (entity != null)
                return entity;
            entity = new PresenceHour();
            entity.Date = yesterday;
            entity.EmployeeID = UserId;
            entity.Hours = 0;
            return entity;
        }
        public IEnumerable<PresenceHour> GetThisPeriodByUserId(Guid UserId, DateTime from, DateTime to)
        {
            
            return _RASContext.PresenceHours.Where(x => x.EmployeeID == UserId && x.Date >=from && x.Date <=to);
        }

        public PresenceHour GetFirstDate()
        {
            return _RASContext.PresenceHours.OrderBy(x => x.Date).First(); 
        }


        public IQueryable<PresenceHour> DefaultQuery()
        {
          return  _RASContext.PresenceHours
                .Include(x=>x.Employee) ;
        }

       






        #endregion

    }
}
