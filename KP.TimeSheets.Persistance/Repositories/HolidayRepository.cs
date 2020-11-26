using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Persistance
{
    internal class HolidayRepository : IHolidayRepository
    {
        #region Attributes & Properties

      
        string _PWAConnString;
        RASContext _RASContext;

        #endregion

        #region Constructors

        public HolidayRepository(string pwaConnString, RASContext rasContext)
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
        public IEnumerable<Holiday> GetAll()
        {
            return DefaultQuery().ToList();
        }

        /// <summary>
        /// بدست آوردن تقویم بر اساس شناسه آن
        /// </summary>
        /// <param name="holidayID">شناسه تقویم</param>
        /// <returns>تقویمی که در بررسی پایگاه داده بدست می آید.</returns>
        public Holiday GetByID(Guid holidayID)
        {
            return _RASContext.Holidays.FirstOrDefault(item => item.ID.Equals(holidayID));
        }

        /// <summary>
        /// اضافه کردن تقویم جدید به پایگاه داده
        /// </summary>
        /// <param name="entity">موجودیت مرتبط با تقویم جدید</param>
        /// <returns>تقویمی که پس از اضافه شده به پایگاه داده بازگردانده می شود.</returns>
        public void Add(List<Holiday> holidays)
        {

            var holidayEntity = new List<Holiday>();
            FillHolidayEntitys(holidayEntity, holidays);
            _RASContext.Holidays.AddRange(holidayEntity);
        }

        /// <summary>
        /// حذف تقویم با شماره تقویم از پایگاه داده
        /// </summary>
        /// <param name="calendarID"></param>
        public void Delete(Guid HolidayID)
        {
            var result = _RASContext.Holidays.Find(HolidayID);
            _RASContext.Holidays.Remove(result);
        }

        /// <summary>
        /// واکشی یک آیتم برای ویرایش
        /// </summary>
        /// <param name="calendarID"></param>
        /// <returns></returns>
        public void Edit(Holiday holiday)
        {
            var entity = _RASContext.Holidays.Find(holiday.ID);
            entity=FillHolidayEntity(holiday);
        }

        public bool IsExistById(Guid id)
        {
            return _RASContext.Holidays.Any(x => x.ID == id);
        }

        public IEnumerable<Holiday> ExistItemsByCalenderId(Guid calenderId)
        {
            return _RASContext.Holidays.Where(x => x.CalendarID == calenderId).ToList();
        }

        public void DeleteRange(List<Holiday> holidayes)
        {
            _RASContext.Holidays.RemoveRange(holidayes);
        }

        #endregion

        #region Private Methods


        private IQueryable<Holiday> DefaultQuery()
        {
            return _RASContext.Holidays;
        }



        private Holiday FillHolidayEntity(Holiday holiday)
        {
            var entity = new Holiday();
            entity.CalendarID = holiday.CalendarID;
            entity.Date = holiday.Date;
            entity.ID = holiday.ID;
            return entity;

        }
        private void FillHolidayEntitys(List<Holiday> entitys, List<Holiday> holidays)
        {
            foreach (var holiday in holidays)
                entitys.Add(FillHolidayEntity(holiday));
            

        }
        #endregion
    }
}
