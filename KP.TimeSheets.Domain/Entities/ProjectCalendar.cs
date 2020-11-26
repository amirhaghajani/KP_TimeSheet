using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class ProjectCalendar
    {
        #region Attributes & Properties

        /// <summary>
        /// شناسه ارتباط پروژه با تقویم.
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// شناسه پروژه که با تقویم مرتبط می گردد.
        /// </summary>
        public Guid ProjectID { get; set; }

        /// <summary>
        /// شئی پروژه که با تقویم مرتبط می گردد.
        /// </summary>
        public Project Project { get; set; }

        /// <summary>
        /// شناسه تقویم که با پروژه مرتبط می گردد.
        /// </summary>
        public Guid CalendarID { get; set; }

        /// <summary>
        /// شئی تقویم که با پروژه مرتبط می گردد.
        /// </summary>
        public Calendar Calendar { get; set; }

        

        #endregion
    }
}
