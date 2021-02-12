using System;

namespace KP.TimeSheets.Persistance.QueryEntities
{
    public class EmployeeTimeSheetFromDB
    {
        public string Type{get;set;}
        public Guid? TaskId { get; set; }
        public DateTime? Date { get; set; }
        public System.Byte? DayOfWeek { get; set; }
        public string PersianDate { get; set; }
        public Guid? ProjectId { get; set; }
        public string ProjectTitle { get; set; }
        public int? Minutes { get; set; }
        public int? Hozoor { get; set; }
        public string Title { get; set; }
        public string State { get; set; }
        public bool? IsOpen { get; set; }
        public string DayTimeString { get; set; }
        public bool? UserMustHasHozoor {get;set;}
    }

}