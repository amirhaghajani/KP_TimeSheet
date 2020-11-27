using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class HomeEntityAssembler
    {

       public AllEntityJson ToJson(PresenceHour presenceHour, IEnumerable<WorkHour> workHours,string userName)
        {
            var result = new AllEntityJson();
            double whHour = (workHours != null && workHours.ToList().Count >= 0) ? workHours.Sum(x => x.Hours) : 0;
            double pHour = presenceHour.Hours;
            double diferrent = pHour - whHour;
            result.Presencepercent = pHour;
            result.Workpercent = whHour;
            result.Defferencepercent = diferrent;
            result.Presence = DateUtility.ConvertToTimeSpan(pHour);
            result.Work = DateUtility.ConvertToTimeSpan(whHour);
            result.Defference = DateUtility.ConvertToTimeSpan(diferrent);
            result.CurrentUser =  userName;
            return result;
        }


        public AllEntityJson ToJson(IEnumerable<PresenceHour> presenceHours, IEnumerable<WorkHour> workHours)
        {
            var result = new AllEntityJson();
            double whHour = (workHours != null && workHours.ToList().Count >= 0) ? workHours.Sum(x => x.Hours) : 0;
            double pHour = (presenceHours != null && presenceHours.ToList().Count >= 0) ? presenceHours.Sum(x => x.Hours) : 0;
            double diferrent = pHour - whHour;
            result.Presencepercent = pHour;
            result.Workpercent = whHour;
            result.Defferencepercent = diferrent;
            result.Presence = DateUtility.ConvertToTimeSpan(pHour);
            result.Work =DateUtility.ConvertToTimeSpan(whHour);
            result.Defference = DateUtility.ConvertToTimeSpan(diferrent);
            return result;
        }

    }
}