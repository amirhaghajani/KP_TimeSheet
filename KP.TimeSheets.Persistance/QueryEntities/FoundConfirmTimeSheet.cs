using System;

namespace KP.TimeSheets.Persistance.QueryEntities
{
    public class FoundConfirmTimeSheet
    {
        public Guid? WorkoutId { get; set; }
        public DateTime Date { get; set; }
        public System.Byte DayOfWeek{get;set;}
        public string PersianDate{get;set;}
        public Guid? ProjectId { get; set; }
        public string ProjectTitle { get; set; }
        public double? Hours { get; set; }
        public double? Hozoor { get; set; }
        public string Title { get; set; }
        public string State { get; set; }
    }

}