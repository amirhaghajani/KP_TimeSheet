using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class TreelistColumnJson
    {
        public string field { get; set; }
        public string title { get; set; }
        public string template { get; set; }
        public bool hidden { get; set; }
        public int width { get; set; }
        public string headerTemplate { get; set; }
        public bool filterable { get; set; }
    }
}