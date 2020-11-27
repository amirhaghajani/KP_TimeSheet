using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class GetThisMonthDataByUserJson
    {
        public List<TimeSheetValueJson> values { get; set; }
        public TimeSheetValueJson value { get; set; }
        public string userid { get; set; }
    }
}