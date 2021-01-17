using System;
using System.Collections.Generic;

namespace KP.TimeSheets.MVC.ViewModels
{

    public class vmGetTimeSheetResualt
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




    public class vmGetTimeSheetResualt_Project
    {
        public Guid? id { get; set; }
        public string title { get; set; }

        public List<vmGetTimeSheetResualt_Workout> workouts { get; set; }
    }

    public class vmGetTimeSheetResualt_Workout
    {
        public Guid? id { get; set; }
        public string title { get; set; }
        public string state { get; set; }
        public int? minutes { get; set; }
    }

}