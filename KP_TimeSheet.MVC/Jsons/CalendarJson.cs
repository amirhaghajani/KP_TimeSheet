using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class CalendarJson
    {

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

        public ICollection<HoliDayJson> Holidays { get; set; }

        public string AssignStatus { get; set; }
    }
}