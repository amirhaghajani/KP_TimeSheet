using KP.TimeSheets.Domain;

namespace KP.TimeSheets.Persistance
{
    public class UnitOfWork : IUnitOfWork
    {

        #region Attributes & Properties
        
        private string _PWAConnString;
        private IUserRepository _userRepository;
        private ICalendarRepository _calendarRepository;
        private IHolidayRepository _holidayRepository;
        private IPWARepository _pWARepository;
        private IProjectRepository _projectRepository;
        private ITaskRepository _taskRepository;
        private IAssignmentRepository _assignmentRepository;
        private IOrgUnitRepository _orgUnitRepository;
        private IPresHourRepository _presHourRepository;
        private IWorkHourRepository _workHourRepository;
        private IDisplayPeriodRepository _displayPeriodRepository;
        private IWorkflowStageRepository _workflowStageRepository;
        private IWorkHourHistoryRepository _workHourHistoryRepository;
        private IHourlyLeaveRepository _hourlyLeavesRepository;
        private IDailyLeaveRepository _dailyLeaveRepository;
        private IHourlyMissionRepository _hourlyMissionRepository;



        private RASContext _Context;

        public IUserRepository UserRepository
        {
            get
            {
                if(this._userRepository==null) this._userRepository=  new UserRepository( _PWAConnString, _Context);
                return _userRepository;
            }
        }

        public ICalendarRepository CalendarRepository
        {
            get
            {
                if(_calendarRepository==null) _calendarRepository= new CalendarRepository(_PWAConnString, _Context);
                return _calendarRepository;
            }
        }

        public IHolidayRepository HolidayRepository
        {
            get
            {
                if(_holidayRepository==null) _holidayRepository= new HolidayRepository( _PWAConnString, _Context);
                return _holidayRepository;
            }
        }

        public IPWARepository PWARepository
        {
            get
            {
                if(_pWARepository==null) _pWARepository= new PWARepository( _PWAConnString, _Context);
                return _pWARepository;
            }
        }

        public IProjectRepository ProjectRepository
        {
            get
            {
                if(_projectRepository==null) _projectRepository= new ProjectRepository( _PWAConnString, _Context);
                return _projectRepository;
            }
        }

        public ITaskRepository TaskRepository
        {
            get
            {
                if(_taskRepository==null) _taskRepository = new TaskRepository(_PWAConnString, _Context);
                return _taskRepository;
            }
        }

        public IAssignmentRepository AssignmentRepository
        {
            get
            {
                if(_assignmentRepository==null) _assignmentRepository= new AssignmentRepository(_PWAConnString, _Context);
                return _assignmentRepository;
            }
        }

        public IOrgUnitRepository OrgUnitRepository
        {
            get
            {
                if(_orgUnitRepository==null) _orgUnitRepository= new OrgUnitRepository(_PWAConnString, _Context);
                return _orgUnitRepository;
            }
        }

        public IPresHourRepository PresHourRepository
        {
            get
            {
                if(_presHourRepository==null) _presHourRepository= new PresHourRepository(_PWAConnString, _Context);
                return _presHourRepository;
            }
        }

        public IWorkHourRepository WorkHourRepository
        {
            get
            {
                if(_workHourRepository==null) _workHourRepository= new WorkHourRepository( _PWAConnString, _Context);
                return _workHourRepository;
            }
        }

        public IDisplayPeriodRepository DisplayPeriodRepository
        {
            get
            {
                if(_displayPeriodRepository==null) _displayPeriodRepository= new DisplayPeriodRepository(_PWAConnString, _Context);
                return _displayPeriodRepository;
            }
        }





        public IWorkflowStageRepository WorkflowStageRepository
        {
            get
            {
                if(_workflowStageRepository==null) _workflowStageRepository= new WorkflowStageRepository( _Context);
                return _workflowStageRepository;
            }
        }




        public IWorkHourHistoryRepository WorkHourHistoryRepository
        {
            get
            {
                if(_workHourHistoryRepository==null) _workHourHistoryRepository= new WorkHourHistoryRepository(_Context);
                return _workHourHistoryRepository;
            }
        }


        public IHourlyLeaveRepository HourlyLeavesRepository
        {
            get
            {
                if(_hourlyLeavesRepository==null) _hourlyLeavesRepository= new HourlyLeaveRepository(_Context);
                return _hourlyLeavesRepository;
            }
        }





        public IDailyLeaveRepository DailyLeaveRepository
        {
            get
            {
                if(_dailyLeaveRepository==null) _dailyLeaveRepository=new  DailyLeaveRepository(_Context);
                return _dailyLeaveRepository;
            }
        }


        public IHourlyMissionRepository HourlyMissionRepository
        {
            get
            {
                if(_hourlyMissionRepository==null) _hourlyMissionRepository= new HourlyMissionRepository(_Context);
                return _hourlyMissionRepository;
            }
        }
       








        #endregion

        #region Constructors

        public UnitOfWork()
        {
           
               
                // _PWAConnString = ConfigurationManager.ConnectionStrings["PWAConnectionString"].ConnectionString.ToString();
               
                // _Context = new RASContext();
               
          
        }

    

        #endregion

        #region Public Methods

        /// <summary>
        /// ثبت تغییرات انجام شده در شئی محتوایی
        /// </summary>
        public void SaveChanges()
        {
            _Context.SaveChanges();
        }

        #endregion

    }
}
