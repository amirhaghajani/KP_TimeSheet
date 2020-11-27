using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class AllEntityJson
    {
        public string Presence { get; set; }
        public string Work { get; set; }
        public string Defference { get; set; }
        public double Presencepercent { get; set; }
        public double Workpercent { get; set; }
        public double Defferencepercent { get; set; }
        public string CurrentUser { get; set; }
    }
}