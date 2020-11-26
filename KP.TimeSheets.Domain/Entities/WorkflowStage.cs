using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class WorkflowStage
    {

        #region Attributes & Properties

        /// <summary>
        /// شناسه مرحله گردش کار
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// عنوان مرحله گردش کار. 
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// ترییب مرحله گردش کار
        /// </summary>
        public int Order { get; set; }

        /// <summary>
        /// نوع مرحله گردش کار 
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        ///  مجموعه ای از ساعات کاری(کارکرد) که در این مرحله گردش کار قرار دارند.
        /// </summary>
        public ICollection<WorkHour> WorkHours { get; set; }


        public bool IsFirst { get; set; }

        public bool IsLast { get; set; }

        /// <summary>
        ///  مجموعه ای ازتاریخچه مرتبط با کاربر.
        /// </summary>
        public ICollection<WorkHourHistory> WorkHourHistories { get; set; }

        #endregion

    }
}
