using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
   public class StageController
    {
       

        public StageController(IUnitOfWork unitOfWork)
        {
            _uow = unitOfWork;
        }

        private IUnitOfWork _uow;

        public void SetNextStageID(IHaveStage entity)
        {
            WorkflowManager wfm = new WorkflowManager(_uow);
            if (entity.WorkflowStage.IsLast)
                throw new Exception("Can not set next stage for last stage.");
         var stage = wfm.GetByOrder(entity.WorkflowStage.Order+1);
            entity.WorkflowStage = stage;
            entity.PreviousStage = entity.WorkflowStageID;
            entity.WorkflowStageID = stage.ID;
        }


        public void SetPreviusStage(IHaveStage entity)
        {
            if (entity.WorkflowStage.IsFirst)
                throw new Exception("Can not set previus stage for first stage");
            var stage = _uow.WorkflowStageRepository.GetByOrder(entity.WorkflowStage.Order - 1);
            entity.WorkflowStage = stage;
            entity.WorkflowStageID = stage.ID;
            
        }

        public void SetToOrder(IHaveStage entity,int order)
        {
           
            var stage = _uow.WorkflowStageRepository.GetByOrder(order);
            entity.WorkflowStage = stage;
            entity.WorkflowStageID = stage.ID;

        }


    }
}
