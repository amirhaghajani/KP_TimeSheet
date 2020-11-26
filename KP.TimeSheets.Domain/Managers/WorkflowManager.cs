using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class WorkflowManager
    {

        private IUnitOfWork _UOW;

        public WorkflowManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }


       

      

        public IEnumerable<WorkflowStage> GetAll()
        {
            return _UOW.WorkflowStageRepository.GetAll();
        }

        public WorkflowStage GetByID(Guid ID)
        {
            WorkflowStage result = null;
            try
            {
                result = _UOW.WorkflowStageRepository.GetByID(ID);
            }
            catch
            {

            }
            return result;
        }

        public WorkflowStage FirstStage()
        {
            return _UOW.WorkflowStageRepository.GetFirst();
        }


        public WorkflowStage NextStage(WorkflowStage workflowStage)
        {
            WorkflowStage result = null;
           
                result = _UOW.WorkflowStageRepository.GetNext(workflowStage);
           
            return result;
        }

        public WorkflowStage PreviousStage(WorkflowStage workflowStage)
        {
            
             var   result = _UOW.WorkflowStageRepository.GetPrevious(workflowStage);
            
            return result;
        }

        public WorkflowStage GetByOrder(int order)
        {
            WorkflowStage result = null;
           
                result = _UOW.WorkflowStageRepository.GetByOrder(order);
           
            return result;
        }


       

        #region Private Methods

        #endregion

        public enum Actions
        {
            [Description("ثبت موقت")]
            TempRegistration = 1
        }

    }
}
