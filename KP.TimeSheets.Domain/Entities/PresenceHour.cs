using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class PresenceHour
    {

        #region Attributes & Properties
        /// <summary>
        /// شناسه ساعت حضور
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// تاریخ ساعت حضور
        /// </summary>
        public DateTime Date { get; set; }

        /// <summary>
        /// شناسه کارمند مرتبط با ساعت حضور 
        /// </summary>
        public Guid EmployeeID { get; set; }

        /// <summary>
        /// شئی کارمند مرتبط با ساعت حضور 
        /// </summary>
        public User Employee { get; set; }

        /// <summary>
        /// میزان ساعت حضور
        /// </summary>
        public double Hours { get; set; }


        /// <summary>
        ///  ساعت ورود
        /// </summary>
        public string InTime { get; set; }

        /// <summary>
        ///  ساعت خروج
        /// </summary>
        public string OutTime { get; set; }

        #endregion

    }
}
