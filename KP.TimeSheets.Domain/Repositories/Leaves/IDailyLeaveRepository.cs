using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
   public interface IDailyLeaveRepository
    {
        DailyLeave GetByID(Guid id);

        
        IEnumerable<DailyLeave> GetAll();
        IEnumerable<DailyLeave> GetAllByUserID(Guid UserID);

        IEnumerable<DailyLeave> GetByOrganisationID(Guid? organId);

        void Add(DailyLeave dailyLeave);

        void Edit(DailyLeave dailyLeave);

        void Delete(DailyLeave dailyLeave);

        void DeleteByID(Guid id);

        bool IsExist(DailyLeave dailyLeave);



    }
}
