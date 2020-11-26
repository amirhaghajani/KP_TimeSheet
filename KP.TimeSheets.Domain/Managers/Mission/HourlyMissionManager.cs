using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class HourlyMissionManager
    {

        private IUnitOfWork _UOW;

        public HourlyMissionManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;


        }

        public void Add(HourlyMission hourlyMission)
        {

            WorkflowManager wm = new WorkflowManager(_UOW);
            hourlyMission.WorkflowStageID = wm.GetByOrder(3).ID;
            hourlyMission.PreviousStage = wm.FirstStage().ID;
            hourlyMission.ID = Guid.NewGuid();
            hourlyMission.Date = DateUtility.GetMiladiDate(hourlyMission.PersianMissionDate);
            hourlyMission.From = DateUtility.ConvertStringTimeToDateTime(hourlyMission.PersianTimeFrom);
            hourlyMission.To = DateUtility.ConvertStringTimeToDateTime(hourlyMission.PersianTimeTo);
            hourlyMission.Hours = DateUtility.SubtarctToANdFromDateTimeToDouble(hourlyMission.From, hourlyMission.To);
            hourlyMission.RegisterDate = DateTime.Now;
            _UOW.HourlyMissionRepository.Add(hourlyMission);
            _UOW.SaveChanges();
        }

        public void Delete(HourlyMission hourlyMission)
        {
            _UOW.HourlyMissionRepository.Delete(hourlyMission);
            _UOW.SaveChanges();
        }

        public void DeleteByID(Guid id)
        {
            _UOW.HourlyMissionRepository.DeleteByID(id);
            _UOW.SaveChanges();
        }

        public void Edit(HourlyMission hourlyMission)
        {
            _UOW.HourlyMissionRepository.Add(hourlyMission);
            _UOW.SaveChanges();
        }

        public IEnumerable<HourlyMission> GetAll()
        {
            return _UOW.HourlyMissionRepository.GetAll();

        }

        public IEnumerable<HourlyMission> GetAllByUserID(Guid UserID)
        {
            WorkflowManager wfm = new WorkflowManager(_UOW);
            var managerStageId = wfm.GetByOrder(3).ID;
            return _UOW.HourlyMissionRepository.GetAllByUserID(UserID).Where(x => x.WorkflowStageID == managerStageId);

        }

        public IEnumerable<HourlyMission> GetByOrganisationID(Guid? organId)
        {
            return _UOW.HourlyMissionRepository.GetByOrganisationID(organId);
        }

        public HourlyMission GetByID(Guid id)
        {
            return _UOW.HourlyMissionRepository.GetByID(id);
        }

        public bool IsExist(HourlyMission hourlyMission)
        {
            return _UOW.HourlyMissionRepository.IsExist(hourlyMission);
        }

        public void Approve(HourlyMission hourlyMission)
        {
            hourlyMission.PersianMissionDate = DateUtility.GetPersianDate(DateTime.Now);
            hourlyMission.PersianTimeFrom = DateUtility.GetPersianDate(DateTime.Now);
            hourlyMission.PersianTimeTo = DateUtility.GetPersianDate(DateTime.Now);
            StageController stageController = new StageController(_UOW);
            stageController.SetToOrder(hourlyMission, 4);
            _UOW.HourlyMissionRepository.Edit(hourlyMission);

        }

        public void Deny(HourlyMission hourlyMission)
        {
            hourlyMission.PersianMissionDate = DateUtility.GetPersianDate(DateTime.Now);
            hourlyMission.PersianTimeFrom = DateUtility.GetPersianDate(DateTime.Now);
            hourlyMission.PersianTimeTo = DateUtility.GetPersianDate(DateTime.Now);
            StageController stageController = new StageController(_UOW);
            stageController.SetToOrder(hourlyMission, 1);
            _UOW.HourlyMissionRepository.Edit(hourlyMission);
        }

        public void Resend(HourlyMission hourlyMission)
        {
            hourlyMission.PersianMissionDate = DateUtility.GetPersianDate(DateTime.Now);
            hourlyMission.PersianTimeFrom = DateUtility.GetPersianDate(DateTime.Now);
            hourlyMission.PersianTimeTo = DateUtility.GetPersianDate(DateTime.Now);
            StageController stageController = new StageController(_UOW);
            stageController.SetToOrder(hourlyMission, 3);
            _UOW.HourlyMissionRepository.Edit(hourlyMission);


        }
    }
}
