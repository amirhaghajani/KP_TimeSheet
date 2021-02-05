
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class WorkHour : IHaveStage
    {

        #region Attributes & Properties

        /// <summary>
        /// شناسه ساعت کارکرد
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// تاریخ ساعت کارکرد
        /// </summary>
        public DateTime Date { get; set; }


        /// <summary>
        /// شناسه کارمند مرتبط با ساعت کارکرد 
        /// </summary>
        public Guid EmployeeID { get; set; }

        /// <summary>
        /// شئی کارمند مرتبط با ساعت کارکرد 
        /// </summary>
        public User Employee { get; set; }

        /// <summary>
        /// شناسه مرتبط با فعالیت که ساعت کارکرد برای آن ثبت شده است. 
        /// </summary>
        public Guid TaskID { get; set; }

        /// <summary>
        /// شئی مرتبط با فعالیت که ساعت کارکرد برای آن ثبت شده است.  
        /// </summary>
        public Task Task { get; set; }

        /// <summary>
        /// شناسه مرتبط با فعالیت که ساعت کارکرد برای آن ثبت شده است. 
        /// </summary>
        public Guid ProjectId { get; set; }

        /// <summary>
        /// شئی مرتبط با فعالیت که ساعت کارکرد برای آن ثبت شده است.  
        /// </summary>
        public Project Project { get; set; }

        /// <summary>
        /// میزان ساعت کاری
        /// </summary>
        public int Minutes { get; set; }

        /// <summary>
        /// شناسه مرحله گردش کار جاری مرتبط با ساعت کارکرد 
        /// </summary>
        public Guid WorkflowStageID { get; set; }

        /// <summary>
        /// شئی مرحله گردش کار جاری مرتبط با ساعت کارکرد 
        /// </summary>
        public WorkflowStage WorkflowStage { get; set; }

        /// <summary>
        /// توضیحات ساعت کارکرد 
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// آخرین اقدام انجام شده بر روی ساعت کارکرد 
        /// </summary>
        public string Action { get; set; }

        /// <summary>
        /// استیج مرحله قبل 
        /// </summary>
        public Guid? PreviousStage { get; set; }

        #endregion

    }
}
