using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public interface IWorkflowStageRepository
    {

        /// <summary>
        /// بدست آوردن تمامی مراحل گردش کار
        /// </summary>
        /// <returns>شئی قابل شمارش از مراحل گردش کار</returns>
        IEnumerable<WorkflowStage> GetAll();

        /// <summary>
        /// بدست آوردن مرحله گردش کار بر اساس شناسه آن
        /// </summary>
        /// <param name="workflowStageID">شناسه مرحله گردش کار</param>
        /// <returns>مرحله گردش کاری که در بررسی پایگاه داده بدست می آید.</returns>
        WorkflowStage GetByID(Guid workflowStageID);

        /// <summary>
        /// اضافه کردن مرحله گردش کار جدید به پایگاه داده
        /// </summary>
        /// <param name="workflowStage">موجودیت مرتبط با مرحله گردش کار جدید</param>
        void Add(WorkflowStage workflowStage);

        /// <summary>
        /// بروزرسانی مرحله گردش کار
        /// </summary>
        /// <param name="workflowStage">موجودیت مرتبط با مرحله گردش کار</param>
        void Edit(WorkflowStage workflowStage);

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="workflowStageID">شناسه مرحله گردش کار</param>
        void Delete(WorkflowStage workflowStageID);

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="workflowStageID">شناسه مرحله گردش کار</param>
        /// <returns></returns>
        bool IsExistById(Guid workflowStageID);

        /// <summary>
        /// اولین مرحله گردش کار را باز می گرداند   
        /// </summary>
        /// <param name="workflowStage">مرحله گردش کار</param>
        /// <returns>مرحله گردش کاری که در بررسی پایگاه داده بدست می آید.</returns>
        WorkflowStage GetFirst();

        /// <summary>
        /// مرحله بعدی گردش کار را باز می گرداند   
        /// </summary>
        /// <param name="workflowStage">مرحله گردش کار</param>
        /// <returns>مرحله گردش کاری که در بررسی پایگاه داده بدست می آید.</returns>
        WorkflowStage GetNext(WorkflowStage workflowStage);

        /// <summary>
        /// بدست آوردن مرحله قبلی گردش کار
        /// </summary>
        /// <param name="workflowStage">مرحله گردش کار</param>
        /// <returns>مرحله گردش کاری که در بررسی پایگاه داده بدست می آید.</returns>
        WorkflowStage GetPrevious(WorkflowStage workflowStage);


        WorkflowStage GetByOrder(int order);

    }
}
