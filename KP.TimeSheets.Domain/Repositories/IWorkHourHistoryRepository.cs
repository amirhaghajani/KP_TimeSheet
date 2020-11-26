using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
 public  interface IWorkHourHistoryRepository
    {
       


        IEnumerable<WorkHourHistory> GetAll();

       
        WorkHourHistory GetByID(Guid HistoryID);

      
        void Add(WorkHourHistory history);

       
        void Delete(Guid historyID);

       
        void Edit(WorkHourHistory history);

        IEnumerable<WorkHourHistory> GetByWorkHourId(Guid workHourId);

        bool IsExistById(Guid historyID);
        IEnumerable<WorkHourHistory> GetByWorkHourID(Guid workHourId);
    }
}
