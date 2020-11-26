using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public interface IUnitOfWork
    {

        #region Attributes & Properties

        IUserRepository UserRepository { get; }

        ICalendarRepository CalendarRepository { get; }

        IHolidayRepository HolidayRepository { get; }

        IPWARepository PWARepository { get; }

        IProjectRepository ProjectRepository { get; }

        ITaskRepository TaskRepository { get; }

        IAssignmentRepository AssignmentRepository { get; }

        IOrgUnitRepository OrgUnitRepository { get; }

        IPresHourRepository PresHourRepository { get; }

        IWorkHourRepository WorkHourRepository { get; }

        IDisplayPeriodRepository DisplayPeriodRepository { get; }

        IWorkflowStageRepository WorkflowStageRepository { get; }

        IWorkHourHistoryRepository WorkHourHistoryRepository { get; }

        IHourlyLeaveRepository HourlyLeavesRepository { get; }

        IDailyLeaveRepository DailyLeaveRepository { get; }

        IHourlyMissionRepository HourlyMissionRepository { get; }



        #endregion



        void SaveChanges();


    }
}
