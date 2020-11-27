using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class HourlyLeaveAssembler
    {

        public ICollection<HourlyLeaveJson> ToJsons(List<HourlyLeave> hourlyLeaves)
        {
            List<HourlyLeaveJson> result = new List<HourlyLeaveJson>();

            foreach (var hourlyLeave in hourlyLeaves)
            {
                result.Add(ToJson(hourlyLeave));
            }
            return result;
        }


        public HourlyLeaveJson ToJson(HourlyLeave hourlyLeave)
        {
            HourlyLeaveJson result = new HourlyLeaveJson();
            result.ID = hourlyLeave.ID;
            result.RegisterDate = DateUtility.GetPersianDate(hourlyLeave.RegisterDate);
            result.LeaveDate = DateUtility.GetPersianDate(hourlyLeave.LeaveDate);
            result.From = DateUtility.ConvertDateTimeToTime(hourlyLeave.From);
            result.TO = DateUtility.ConvertDateTimeToTime(hourlyLeave.To);
            result.Organisation = hourlyLeave.OrganisationId != null ? hourlyLeave.Organisation.Title : "فاقد واحد سازمانی";
            result.PersonnelNumber = hourlyLeave.User.Code != null ? hourlyLeave.User.Code : "فاقد کد پرسنلی";
            result.ProjectTitle = hourlyLeave.Project != null ? hourlyLeave.Project.Title : "فاقد پروژه";
            result.UserTitle = hourlyLeave.User.UserTitle;
            return result;
        }

    }
}