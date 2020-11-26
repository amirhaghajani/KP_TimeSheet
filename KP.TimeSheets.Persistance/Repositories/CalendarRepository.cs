using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace KP.TimeSheets.Persistance
{
    internal class CalendarRepository : ICalendarRepository
    {

        #region Attributes & Properties

      
        string _PWAConnString;
        RASContext _RASContext;
       
        


        #endregion

        #region Constructors

        public CalendarRepository( string pwaConnString, RASContext rasContext)
        {
           
          
            _PWAConnString = pwaConnString;
            _RASContext = rasContext;
        }

        #endregion

        #region CRUD Methods

        /// <summary>
        /// بدست آوردن تمامی تقویم ها
        /// </summary>
        /// <returns>شئی قابل شمارش از تقویم ها</returns>
        public IEnumerable<Calendar> GetAll()
        {
            return DefaultQuery().ToList();
        }

        /// <summary>
        /// بدست آوردن تقویم بر اساس شناسه آن
        /// </summary>
        /// <param name="calendarID">شناسه تقویم</param>
        /// <returns>تقویمی که در بررسی پایگاه داده بدست می آید.</returns>
        public Calendar GetByID(Guid calendarID)
        {
            return _RASContext.Calendars.FirstOrDefault(item => item.ID.Equals(calendarID));
        }

        /// <summary>
        /// اضافه کردن تقویم جدید به پایگاه داده
        /// </summary>
        /// <param name="entity">موجودیت مرتبط با تقویم جدید</param>
        /// <returns>تقویمی که پس از اضافه شده به پایگاه داده بازگردانده می شود.</returns>
        public void Add(Calendar calendar)
        {
            var CalendarEntity = new Calendar();         
            FillCalendarEntity(CalendarEntity, calendar);
            _RASContext.Calendars.Add(CalendarEntity);
        }

        /// <summary>
        /// حذف تقویم با شماره تقویم از پایگاه داده
        /// </summary>
        /// <param name="calendarID"></param>
        public void  Delete (Guid calendarID)
        {
            var result = _RASContext.Calendars.Find(calendarID);
            _RASContext.Calendars.Remove(result);
        }

        /// <summary>
        /// واکشی یک آیتم برای ویرایش
        /// </summary>
        /// <param name="calendarID"></param>
        /// <returns></returns>
        public void Edit(Calendar calendar)
        {
            var entity= _RASContext.Calendars.Find(calendar.ID);
            FillCalendarEntity(entity, calendar);
        }

        public bool IsExistById(Guid id)
        {
            return _RASContext.Calendars.Any(x => x.ID == id);
        }

        #endregion

        #region Private Methods


        private IQueryable<Calendar> DefaultQuery()
        {
            return _RASContext.Calendars.Include(x=>x.Holidays);
        }

        private void FillCalendarEntity(Calendar entity, Calendar calendar)
        {
            //entity.Created = calendar.Created;
            entity.ID = calendar.ID;
            entity.IsFridayWD = calendar.IsFridayWD;
            entity.IsSaturdayWD = calendar.IsSaturdayWD;
            entity.IsSundayWD = calendar.IsSundayWD;
            entity.IsThursdayWD = calendar.IsThursdayWD;
            entity.IsWednesdayWD = calendar.IsWednesdayWD;
            entity.IsMondayWD = calendar.IsMondayWD;
            entity.IsTuesdayWD = calendar.IsTuesdayWD;
            entity.Title = calendar.Title;
            
        }

        #endregion

    }
}
