using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class HourlyMissionAssembler
    {

        public ICollection<HourlyMissionJson> ToJsons(List<HourlyMission> hourlyMission)
        {
            List<HourlyMissionJson> result = new List<HourlyMissionJson>();

            foreach (var hm in hourlyMission)
            {
                result.Add(ToJson(hm));
            }
            return result;
        }


        public HourlyMissionJson ToJson(HourlyMission hourlyMission)
        {
            HourlyMissionJson result = new HourlyMissionJson();
            result.ID = hourlyMission.ID;
            result.RegisterDate = DateUtility.GetPersianDate(hourlyMission.RegisterDate);
            result.MissionDate = DateUtility.GetPersianDate(hourlyMission.Date);
            result.From = DateUtility.ConvertDateTimeToTime(hourlyMission.From);
            result.TO = DateUtility.ConvertDateTimeToTime(hourlyMission.To);
            result.Organisation = hourlyMission.OrganisationId != null ? hourlyMission.Organisation.Title : "فاقد واحد سازمانی";
            result.PersonnelNumber = hourlyMission.User.Code != null ? hourlyMission.User.Code : "فاقد کد پرسنلی";
            result.ProjectTitle = hourlyMission.Project != null ? hourlyMission.Project.Title : "فاقد پروژه";
            result.UserTitle = hourlyMission.User.UserTitle;
            return result;
        }

    }
}