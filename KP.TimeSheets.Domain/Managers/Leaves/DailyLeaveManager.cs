using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
  public  class DailyLeaveManager 
    {
        private IUnitOfWork _UOW;

        public DailyLeaveManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;


        }
        public void Add(DailyLeave dailyLeave)
        {
            dailyLeave.ID = Guid.NewGuid();
            dailyLeave.WorkflowStageID = new WorkflowManager(_UOW).GetByOrder(3).ID;
            dailyLeave.PreviousStage = new WorkflowManager(_UOW).FirstStage().ID;
            dailyLeave.From = DateUtility.GetMiladiDate(dailyLeave.PersianDateFrom);
            dailyLeave.To = DateUtility.GetMiladiDate(dailyLeave.PersianDateTo);
            dailyLeave.RegisterDate = DateTime.Now;
            _UOW.DailyLeaveRepository.Add(dailyLeave);
            _UOW.SaveChanges();
        }

        public void Delete(DailyLeave dailyLeave)
        {
            _UOW.DailyLeaveRepository.Delete(dailyLeave);
            _UOW.SaveChanges();
        }

        public void DeleteByID(Guid id)
        {
            _UOW.DailyLeaveRepository.DeleteByID(id);
            _UOW.SaveChanges();
        }

        public void Edit(DailyLeave dailyLeave)
        {
             _UOW.DailyLeaveRepository.Edit(dailyLeave);
            _UOW.SaveChanges();
        }

        public IEnumerable<DailyLeave> GetAllByUserID(Guid UserID )
        {
            WorkflowManager wfm = new WorkflowManager(_UOW);
            var managerStageId = wfm.GetByOrder(3).ID;
            return _UOW.DailyLeaveRepository.GetAllByUserID(UserID).Where(x=>x.WorkflowStageID == managerStageId);
        }

        public IEnumerable<DailyLeave> GetByOrganisationID(Guid? organId)
        {
            return _UOW.DailyLeaveRepository.GetByOrganisationID(organId);
        }
        public IEnumerable<DailyLeave> GetAll()
        {
            return _UOW.DailyLeaveRepository.GetAll();
        }

        public DailyLeave GetByID(Guid id)
        {
          return _UOW.DailyLeaveRepository.GetByID(id);
        }

        public bool IsExist(DailyLeave dailyLeave)
        {
          return  _UOW.DailyLeaveRepository.IsExist(dailyLeave);
        }



        public void Approve(DailyLeave dailyLeave)
        {
            dailyLeave.PersianDateFrom = DateUtility.GetPersianDate(DateTime.Now);
            dailyLeave.PersianDateTo = DateUtility.GetPersianDate(DateTime.Now);
            StageController stageController = new StageController(_UOW);
            stageController.SetToOrder(dailyLeave, 4);
            _UOW.DailyLeaveRepository.Edit(dailyLeave);


        }


        public void Resend(DailyLeave dailyLeave)
        {
            dailyLeave.PersianDateFrom = DateUtility.GetPersianDate(DateTime.Now);
            dailyLeave.PersianDateTo = DateUtility.GetPersianDate(DateTime.Now);
            StageController stageController = new StageController(_UOW);
            stageController.SetToOrder(dailyLeave, 3);
            _UOW.DailyLeaveRepository.Edit(dailyLeave);


        }

        public void Deny(DailyLeave dailyLeave)
        {
            StageController stageController = new StageController(_UOW);
            dailyLeave.PersianDateFrom = DateUtility.GetPersianDate(DateTime.Now);
            dailyLeave.PersianDateTo = DateUtility.GetPersianDate(DateTime.Now);
            stageController.SetToOrder(dailyLeave, 1);
            _UOW.DailyLeaveRepository.Edit(dailyLeave);
           
        }



    }
}
