using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class WorkHourHistoryJson
    {

        public Guid ID { get; set; }
        public string StageTitle { get; set; }
        public string PersianDate { get; set; }
        public string Time { get; set; }
        public string Description { get; set; }
        public string ManagerName { get; set; }
        public string Action { get; set; }




    }
}