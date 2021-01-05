using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class AllEntityJson
    {
        public int Presence { get; set; }
        public int Work { get; set; }
        public int Defference { get; set; }
        public int Presencepercent { get; set; }
        public int Workpercent { get; set; }
        public int Defferencepercent { get; set; }
        public string CurrentUser { get; set; }
    }
}