using System;

namespace KP.TimeSheets.Persistance.QueryEntities
{
    public class WaitingForApproveWorkHourDetail
    {
        public Guid WorkHourId{get;set;}
        public DateTime Date{get;set;}
        public Guid ProjectId{get;set;}
        public string ProjectTitle{get;set;}
        public int Minutes{get;set;}
        public string Title{get;set;}
        public string Description{get;set;}
        public bool IsSend{get;set;}

        public string PersianDate{get;set;}
        public byte TimeDayOfTheWeek{get;set;}
    }
}