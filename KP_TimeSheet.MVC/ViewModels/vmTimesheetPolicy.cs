using System;
using System.Collections.Generic;

namespace KP.TimeSheets.MVC.ViewModels
{
    public class vmTimesheetPolicy
    {
        public Guid id { get; set; }
        public bool isDeactivated{get;set;}
        public string userTitle { get; set; }
        public Guid? userId { get; set; }


        public string createDate { get; set; }

        public string start { get; set; }

        public string finish { get; set; }


        public string validity { get; set; }


        public bool isOpen { get; set; }

        public bool userMustHasHozoor { get; set; }

    }

}