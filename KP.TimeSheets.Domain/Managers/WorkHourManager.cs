using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace KP.TimeSheets.Domain
{
    public class WorkHourManager
    {

        private IUnitOfWork _UOW;

        public WorkHourManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }
        public IEnumerable<WorkHour> GetBydateAndUserId(DateTime date, Guid userId)
        {
            return _UOW.WorkHourRepository.GetBydateAndUserId(date, userId);
        }

        public WorkHour GetById(Guid id)
        {
            return _UOW.WorkHourRepository.GetByID(id);
        }


        public void SetNewStage(WorkHour workHour)
        {
            _UOW.WorkHourRepository.SetNewStage(workHour);
        }
    }
}
