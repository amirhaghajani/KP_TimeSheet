using System;

namespace KP.TimeSheets.Persistance.QueryEntities
{
    public class WaitingForApproveLeaveMissionDetail
    {
        public Guid Id{get;set;}
        public DateTime From{get;set;}
        public DateTime To{get;set;}

        public string Description{get;set;}
        public bool IsSend{get;set;}

        public string FromPersianDate{get;set;}
        public byte FromTimeDayOfTheWeek{get;set;}

        public string ToPersianDate{get;set;}
        public byte ToTimeDayOfTheWeek{get;set;}
    }
}
