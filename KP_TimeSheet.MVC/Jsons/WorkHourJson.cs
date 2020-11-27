using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{ 
    public class WorkHourJson
    {
        /// <summary>
        /// شناسه ساعت کارکرد
        /// </summary>
        public Guid ID { get; set; }


        /// <summary>
        /// شناسه ساعت کارکرد
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// تاریخ ساعت کارکرد
        /// </summary>
        public DateTime Date { get; set; }

        /// <summary>
        /// شناسه کارمند مرتبط با ساعت کارکرد 
        /// </summary>
        public Guid EmployeeID { get; set; }

        public string UserName { get; set; }
        /// <summary>
        /// شناسه مرتبط با فعالیت که ساعت کارکرد برای آن ثبت شده است. 
        /// </summary>
        public Guid TaskID { get; set; }


        public string TaskTitle { get; set; }

        /// <summary>
        /// شناسه مرتبط با پروژه فعالیتی که ساعت کارکرد برای آن ثبت شده است. 
        /// </summary>
        public Guid ProjectID { get; set; }

        public string ProjectTitle { get; set; }

        public string PersianDate { get; set; }
        /// <summary>
        /// میزان ساعت کاری
        /// </summary>
        public object Hours { get; set; }

        /// <summary>
        /// شناسه مرتبط با مرحله جاری گردش کار ساعت کارکرد 
        /// </summary>
        public Guid WorkflowStageID { get; set; }

        public string WorkFlowStageTitle { get; set; }

        /// <summary>
        /// آخرین اقدام صورت گرفته برای ساعت کارکرد
        /// </summary>
        public string Action { get; set; }

        public string UserId { get; set; }

    }


}