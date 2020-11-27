using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class LeaveJson
    {
        public Guid ID { get; set; }


        public string Title { get; set; }

        public bool IsHour { get; set; }

        public string PersianStartDate { get; set; }


        public string PersianFinishDate { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime FinishDate { get; set; }

        public string LeaveDiscription { get; set; }

        public string StartTime { get; set; }

        public string FinishTime { get; set; }

        public string UserName { get; set; }
    }
}