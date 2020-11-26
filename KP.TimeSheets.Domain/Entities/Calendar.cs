using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class Calendar
    {

        #region Attributes & Properties

        /// <summary>
        /// شناسه تقویم
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// عنوان تقویم
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// شنبه روز کاری
        /// </summary>
        public bool? IsSaturdayWD { get; set; }

        /// <summary>
        /// یکشنبه روز کاری
        /// </summary>
        public bool? IsSundayWD { get; set; }

        /// <summary>
        /// دوشنبه روز کاری
        /// </summary>
        public bool? IsMondayWD { get; set; }

        /// <summary>
        /// سه شنبه روز کاری
        /// </summary>
        public bool? IsTuesdayWD { get; set; }

        /// <summary>
        /// چهارشنبه روز کاری
        /// </summary>
        public bool? IsWednesdayWD { get; set; }

        /// <summary>
        /// پنج شنبه روز کاری
        /// </summary>
        public bool? IsThursdayWD { get; set; }

        /// <summary>
        /// جمعه روز کاری
        /// </summary>
        public bool? IsFridayWD { get; set; }

        /// <summary>
        /// تاریخ ایجاد تقویم
        /// </summary>
        //public DateTime Created { get; set; }

        /// <summary>
        /// مجموعه ای از روزهای تعطیل مرتبط با تقویم
        /// </summary>
        public ICollection<Holiday> Holidays { get; set; }

        /// <summary>
        /// مجموعه ای از  تعطیل مرتبط با تقویم
        /// </summary>
        public ICollection<Project> Projects { get; set; }

        #endregion

    }
}
