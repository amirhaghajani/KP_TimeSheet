using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class HourlyLeaveManager 
    {
        private IUnitOfWork _UOW;

        public HourlyLeaveManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }

        public void Add(HourlyLeave hourlyLeave)
        {

            WorkflowManager wm = new WorkflowManager(_UOW);
            hourlyLeave.WorkflowStageID = wm.GetByOrder(3).ID;  
            hourlyLeave.PreviousStage = wm.FirstStage().ID;
            hourlyLeave.ID = Guid.NewGuid();
            hourlyLeave.LeaveDate = DateUtility.GetMiladiDate(hourlyLeave.PersianLeaveDate);
            hourlyLeave.From = DateUtility.ConvertStringTimeToDateTime(hourlyLeave.PersianTimeFrom);
            hourlyLeave.To = DateUtility.ConvertStringTimeToDateTime(hourlyLeave.PersianTimeTo);
            hourlyLeave.RegisterDate = DateTime.Now;
            _UOW.HourlyLeavesRepository.Add(hourlyLeave);
            _UOW.SaveChanges();
        }

        public void Delete(HourlyLeave hourlyLeave)
        {
            _UOW.HourlyLeavesRepository.Delete(hourlyLeave);
            _UOW.SaveChanges();
        }

        public void DeleteByID(Guid id)
        {
            _UOW.HourlyLeavesRepository.DeleteByID(id);
            _UOW.SaveChanges();
        }

        public void Edit(HourlyLeave hourlyLeave)
        {
            _UOW.HourlyLeavesRepository.Edit(hourlyLeave);
            _UOW.SaveChanges();
        }

        public IEnumerable<HourlyLeave> GetAllByUserID(Guid UserID)
        {
            WorkflowManager wfm = new WorkflowManager(_UOW);
            var managerStageId = wfm.GetByOrder(3).ID;
            return _UOW.HourlyLeavesRepository.GetAllByUserID(UserID).Where(x => x.WorkflowStageID == managerStageId);
         
        }
        public IEnumerable<HourlyLeave> GetAll()
        {
           return _UOW.HourlyLeavesRepository.GetAll();
        }

        public HourlyLeave GetByID(Guid id)
        {
           return  _UOW.HourlyLeavesRepository.GetByID(id);
        }

        public IEnumerable<HourlyLeave> GetByOrganisationID(Guid? organId)
        {
            return _UOW.HourlyLeavesRepository.GetByOrganisationID(organId);
        }

        public bool IsExist(HourlyLeave hourlyLeave)
        {
            return _UOW.HourlyLeavesRepository.IsExist(hourlyLeave);
        }


        public void Approve(HourlyLeave hourlyLeave)
        {
            hourlyLeave.PersianLeaveDate = DateUtility.GetPersianDate(DateTime.Now);
            hourlyLeave.PersianTimeFrom = DateUtility.GetPersianDate(DateTime.Now);
            hourlyLeave.PersianTimeTo = DateUtility.GetPersianDate(DateTime.Now);
            StageController stageController = new StageController(_UOW);
            stageController.SetToOrder(hourlyLeave, 4);
            _UOW.HourlyLeavesRepository.Edit(hourlyLeave);
          
        }
        public void Resend(HourlyLeave hourlyLeave)
        {
            hourlyLeave.PersianLeaveDate = DateUtility.GetPersianDate(DateTime.Now);
            hourlyLeave.PersianTimeFrom = DateUtility.GetPersianDate(DateTime.Now);
            hourlyLeave.PersianTimeTo = DateUtility.GetPersianDate(DateTime.Now);
            StageController stageController = new StageController(_UOW);
            stageController.SetToOrder(hourlyLeave, 3);
            _UOW.HourlyLeavesRepository.Edit(hourlyLeave);


        }
        public void Deny(HourlyLeave hourlyLeave)
        {
            hourlyLeave.PersianLeaveDate = DateUtility.GetPersianDate(DateTime.Now);
            hourlyLeave.PersianTimeFrom = DateUtility.GetPersianDate(DateTime.Now);
            hourlyLeave.PersianTimeTo = DateUtility.GetPersianDate(DateTime.Now);
            StageController stageController = new StageController(_UOW);
            stageController.SetToOrder(hourlyLeave, 1);
            _UOW.HourlyLeavesRepository.Edit(hourlyLeave);
           
        }
    }
}
