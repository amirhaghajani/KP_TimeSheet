using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class CalendarManager
    {

        #region Attributes & Properties

        private IUnitOfWork _UOW;

        #endregion

        #region Constructors

        public CalendarManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }


        #endregion

        #region Public Methods

        public IEnumerable<Calendar> GetAll()
        {
            return _UOW.CalendarRepository.GetAll();
        }

        public Calendar GetByID(Guid calendarID)
        {
            return _UOW.CalendarRepository.GetByID(calendarID);
        }

        public void SaveCalendar(Calendar calendar)
        {
            if (_UOW.CalendarRepository.IsExistById(calendar.ID))
            {
                EditCalendar(calendar);
                RemoveHolidayes(calendar.ID);
                AddHolidays(calendar.Holidays.ToList());
            }
            else
                AddClendar(calendar);

            _UOW.SaveChanges();

        }

        public void Remove(Guid calendarID)
        {
            _UOW.CalendarRepository.Delete(calendarID);
            _UOW.SaveChanges();
        }
 
        public Calendar BuildCalendar()
        {
            var calendar = new Calendar();
            //calendar.Created = DateTime.Now;
            calendar.Holidays = new List<Holiday>();
            calendar.ID = Guid.NewGuid();
            calendar.Title = string.Empty;
            return calendar;
        }

        #endregion

        #region Private Methods

        void AddClendar(Calendar entity)
        {
            AddHolidays(entity.Holidays.ToList());
            _UOW.CalendarRepository.Add(entity);
        }

        void EditCalendar(Calendar calendar)
        {
            _UOW.CalendarRepository.Edit(calendar);
        }

        void AddHolidays(List<Holiday> entitys)
        {
            _UOW.HolidayRepository.Add(entitys);
        }

        void RemoveHolidayes(Guid calenderid)
        {
            var entitys = _UOW.HolidayRepository.ExistItemsByCalenderId(calenderid).ToList();
            _UOW.HolidayRepository.DeleteRange(entitys);
        }


        #endregion


    }
}
