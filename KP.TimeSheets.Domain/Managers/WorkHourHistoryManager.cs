using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
  public  class WorkHourHistoryManager
    {

        private IUnitOfWork _UOW;

        public WorkHourHistoryManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }

        public IEnumerable<WorkHourHistory> GetByWorkHourID(Guid workHourId)
        {
            return _UOW.WorkHourHistoryRepository.GetByWorkHourID(workHourId);
        }

        public void Add(WorkHourHistory history)
        {
            _UOW.WorkHourHistoryRepository.Add(history);
            _UOW.SaveChanges();
        }

        public void Delete(Guid historyID)
        {
            _UOW.WorkHourHistoryRepository.Delete(historyID);
          

        }

        public void Edit(WorkHourHistory history)
        {
            _UOW.WorkHourHistoryRepository.Edit(history);
            _UOW.SaveChanges();
        }

        public IEnumerable<WorkHourHistory> GetAll()
        {
            return _UOW.WorkHourHistoryRepository.GetAll();
        }

        public WorkHourHistory GetByID(Guid HistoryID)
        {
            return _UOW.WorkHourHistoryRepository.GetByID(HistoryID);
        }

       public List<string> DeleteByworkHourId(Guid workHourId){
            List<string> result = new List<string>();
            var histories = _UOW.WorkHourHistoryRepository.GetByWorkHourId(workHourId);
            foreach (var history in histories)
            {
                Delete(history.ID);
            }
            return result;
        }

    }
}
