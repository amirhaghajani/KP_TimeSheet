using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Persistance
{
    internal class WorkflowStageRepository : IWorkflowStageRepository
    {
       private  RASContext _RASContext;

        public WorkflowStageRepository( RASContext rasContext)
        {
           
            if (rasContext == null)
            {
                throw new Exception("RAS Context can not be null.");
            }
            _RASContext = rasContext;
        }

      

        #region CRUD Methods

        /// <summary>
        /// بدست آوردن تمامی مراحل گردش کار
        /// </summary>
        /// <returns>شئی قابل شمارش از مراحل گردش کار</returns>
        public IEnumerable<WorkflowStage> GetAll()
        {
            return _RASContext.WorkflowStages.ToList();
        }

        /// <summary>
        /// بدست آوردن مرحله گردش کار بر اساس شناسه آن
        /// </summary>
        /// <param name="workflowStageID">شناسه مرحله گردش کار</param>
        /// <returns>مرحله گردش کاری که در بررسی پایگاه داده بدست می آید.</returns>
        public WorkflowStage GetByID(Guid workflowStageID)
        {
            return _RASContext.WorkflowStages.FirstOrDefault(item => item.ID.Equals(workflowStageID));
        }

        /// <summary>
        /// اضافه کردن مرحله گردش کار جدید به پایگاه داده
        /// </summary>
        /// <param name="workflowStage">موجودیت مرتبط با مرحله گردش کار جدید</param>
        public void Add(WorkflowStage workflowStage)
        {
            _RASContext.WorkflowStages.Add(workflowStage);
        }

        /// <summary>
        /// بروزرسانی مرحله گردش کار
        /// </summary>
        /// <param name="workflowStage">موجودیت مرتبط با مرحله گردش کار</param>
        public void Edit(WorkflowStage workflowStage)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="workflowStageID">شناسه مرحله گردش کار</param>
        public void Delete(WorkflowStage workflowStageID)
        {
            var result = _RASContext.WorkflowStages.Find(workflowStageID);
            _RASContext.WorkflowStages.Remove(result);
        }

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="workflowStageID">شناسه مرحله گردش کار</param>
        /// <returns></returns>
        public bool IsExistById(Guid workflowStageID)
        {
            return _RASContext.WorkflowStages.Any(x => x.ID == workflowStageID);
        }

        /// <summary>
        /// بدست آوردن مرحله بعدی گردش کار
        /// </summary>
        /// <param name="workflowStage">مرحله گردش کار</param>
        /// <returns>مرحله گردش کاری که در بررسی پایگاه داده بدست می آید.</returns>
        public WorkflowStage GetNext(WorkflowStage workflowStage)
        {
            return _RASContext.WorkflowStages.FirstOrDefault(ws => ws.Order.Equals(workflowStage.Order+1));
        }

        /// <summary>
        /// بدست آوردن مرحله قبلی گردش کار
        /// </summary>
        /// <param name="workflowStage">مرحله گردش کار</param>
        /// <returns>مرحله گردش کاری که در بررسی پایگاه داده بدست می آید.</returns>
        public WorkflowStage GetPrevious(WorkflowStage workflowStage)
        {
            return _RASContext.WorkflowStages.FirstOrDefault(ws => ws.Order.Equals(workflowStage.Order - 1));
        }

        public WorkflowStage GetFirst()
        {
            return _RASContext.WorkflowStages.OrderBy(ws => ws.Order).First();
        }


        public WorkflowStage GetByOrder(int order)
        {
           return  _RASContext.WorkflowStages.First(x => x.Order == order);
        }

        #endregion


    }
}
