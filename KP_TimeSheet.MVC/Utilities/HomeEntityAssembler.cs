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
            int whHour = (workHours != null && workHours.ToList().Count >= 0) ? workHours.Sum(x => x.Minutes) : 0;
            int pHour = presenceHour.Minutes;
            int diferrent = pHour - whHour;
            result.Presencepercent = pHour;
            result.Workpercent = whHour;
            result.Defferencepercent = diferrent;
            result.Presence = pHour;
            result.Work = whHour;
            result.Defference = diferrent;
            result.CurrentUser =  userName;
            return result;
        }


        public AllEntityJson ToJson(IEnumerable<PresenceHour> presenceHours, IEnumerable<WorkHour> workHours)
        {
            var result = new AllEntityJson();
            int whHour = (workHours != null && workHours.ToList().Count >= 0) ? workHours.Sum(x => x.Minutes) : 0;
            int pHour = (presenceHours != null && presenceHours.ToList().Count >= 0) ? presenceHours.Sum(x => x.Minutes) : 0;
            int diferrent = pHour - whHour;
            result.Presencepercent = pHour;
            result.Workpercent = whHour;
            result.Defferencepercent = diferrent;
            result.Presence = pHour;
            result.Work = whHour;
            result.Defference = diferrent;
            return result;
        }

    }
}