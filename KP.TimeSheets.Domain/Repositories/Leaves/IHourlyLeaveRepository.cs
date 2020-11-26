using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
   public interface IHourlyLeaveRepository
    {
        HourlyLeave GetByID(Guid id);

        IEnumerable<HourlyLeave> GetAll();

        IEnumerable<HourlyLeave> GetAllByUserID(Guid UserId);
        IEnumerable<HourlyLeave> GetByOrganisationID(Guid? organId);
        void Add(HourlyLeave hourlyLeave);

        void Edit(HourlyLeave hourlyLeave);

        void Delete(HourlyLeave hourlyLeave);

        void DeleteByID(Guid id);

        bool IsExist(HourlyLeave hourlyLeave);

    }
}
