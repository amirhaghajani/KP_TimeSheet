using System;
using System.Collections.Generic;

namespace KP.TimeSheets.MVC.ViewModels
{

    public class vmApproveDenyRequest
    {

        public DateTime? date { get; set; }
        public bool isOpen { get; set; }
        public string dayTimeString { get; set; }
        public string date_persian { get; set; }
        public string day_persian { get; set; }
        public double? hozoor { get; set; }

        public List<vmGetTimeSheetResualt_Project> projects { get; set; }
        public List<vmGetTimeSheetResualt_Project> others { get; set; }

    }

}