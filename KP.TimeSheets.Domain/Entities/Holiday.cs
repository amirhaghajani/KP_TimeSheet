using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class Holiday
    {

        #region Attributes & Properties

        /// <summary>
        /// شناسه روز تعطیل
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// تاریخ روز تعطیل
        /// </summary>
        public DateTime Date { get; set; }
        
        /// <summary>
        /// تقویم 
        /// </summary>
        public Calendar Calendar { get; set; }

        /// <summary>
        /// شناسه تقویم 
        /// </summary>
        public Guid CalendarID { get; set; }

        #endregion

    }
}
