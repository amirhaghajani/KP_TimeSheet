using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{ 
    public class TimeSheetValueJson
    {
        public Guid WorkHourId { get; set; }

        /// <summary>
        /// تاریخ میلادی برگه زمانی
        /// </summary>
        public DateTime Date { get; set; }

        /// <summary>
        /// تاریخ پارسی برگه زمانی
        /// </summary>
        public string PersianDate { get; set; }

        /// <summary>
        /// روز میلادی برگه زمانی
        /// </summary>
        public string Day { get; set; }

        /// <summary>
        /// روز پارسی برگه زمانی
        /// </summary>
        public string PersianDay { get; set; }

        /// <summary>
        /// عنوان برگه زمانی
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// میزان ساعت برگه زمانی
        /// </summary>
        public object  Value { get; set; }

        ///// <summary>
        ///// میزان ساعت برگه زمانی
        ///// </summary>
        //public decimal Hours { get; set; }


        public string UserId { get; set; }
    }


}