using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets
{
  public  class PresenceHourManager
    {

        private IUnitOfWork _UOW;
        public PresenceHourManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }

        public void Add(PresenceHour presenceHour)
        {
            _UOW.PresHourRepository.Add(presenceHour);
        }

        public void Delete(Guid presenceHourID)
        {
            _UOW.PresHourRepository.Delete(presenceHourID);
        }

        public void Edit(PresenceHour presenceHour)
        {
            _UOW.PresHourRepository.Edit(presenceHour);
        }

        public IEnumerable<PresenceHour> GetByEpmloyeeID(Guid employeeID, DateTime? fromDate = null, DateTime? toDate = null)
        {
          return  _UOW.PresHourRepository.GetByEpmloyeeID(employeeID, fromDate, toDate);
        }

        public PresenceHour GetByID(Guid presenceHourID)
        {
          return  _UOW.PresHourRepository.GetByID(presenceHourID);
        }

        public PresenceHour GetByUserIdAndDate(Guid userId, DateTime date)
        {
            return _UOW.PresHourRepository.GetByUserIdAndDate(userId, date);
        }

        public PresenceHour GetFirstDate()
        {
            return _UOW.PresHourRepository.GetFirstDate();
        }

        public IEnumerable<PresenceHour> GetThisPeriodByUserId(Guid UserId, DateTime from, DateTime to)
        {
            return _UOW.PresHourRepository.GetThisPeriodByUserId(UserId, from, to);
        }

        public PresenceHour GetYesterdayByUserId(Guid UserId)
        {
            return _UOW.PresHourRepository.GetYesterdayByUserId(UserId);
        }

        public bool IsExistById(Guid presenceHourID)
        {
            return _UOW.PresHourRepository.IsExistById(presenceHourID);
        }


       
    }
}
