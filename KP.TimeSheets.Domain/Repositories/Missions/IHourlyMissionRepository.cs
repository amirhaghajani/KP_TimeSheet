using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
   public interface IHourlyMissionRepository
    {

        HourlyMission GetByID(Guid id);

        IEnumerable<HourlyMission> GetAll();

        IEnumerable<HourlyMission> GetAllByUserID(Guid UserID);

        IEnumerable<HourlyMission> GetAllByUserID(Guid UserID, DateTime From, DateTime To);

        IEnumerable<HourlyMission> GetByOrganisationID(Guid? organId);

        void Add(HourlyMission hourlyMission);

        void Edit(HourlyMission hourlyMission);

        void Delete(HourlyMission hourlyMission);

        void DeleteByID(Guid id);

        bool IsExist(HourlyMission hourlyMission);

    }
}
