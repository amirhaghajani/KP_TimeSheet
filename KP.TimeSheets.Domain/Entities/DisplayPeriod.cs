using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class DisplayPeriod
    {

        #region Attributes & Properties

        /// <summary>
        /// شناسه دوره نمایش مرتبط با برگه زمانی
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// تاریخ شروع دوره نمایش مرتبط با برگه زمانی
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// نمایش هفتگی دوره نمایش مرتبط با برگه زمانی
        /// </summary>
        public bool IsWeekly { get; set; }

        /// <summary>
        /// تعداد روزهای دوره نمایش مرتبط با برگه زمانی
        /// </summary>
        public int NumOfDays { get; set; }

        /// <summary>
        /// شناسه کارمند مرتبط با دوره نمایش 
        /// </summary>
        public Guid EmployeeID { get; set; }

        /// <summary>
        /// شئی کارمند مرتبط با دوره نمایش 
        /// </summary>
        public User Employee { get; set; }


        #endregion

    }
}
