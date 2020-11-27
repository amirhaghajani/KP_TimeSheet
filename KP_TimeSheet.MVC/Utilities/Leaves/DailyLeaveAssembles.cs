using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class DailyLeaveAssembles
    {

        public ICollection<DailyLeaveJson> ToJsons(List<DailyLeave> dailyLeaves)
        {
            List<DailyLeaveJson> result = new List<DailyLeaveJson>();

            foreach (var dailyLeave in dailyLeaves)
            {
                result.Add(ToJson(dailyLeave));
            }
            return result;
        }


        public DailyLeaveJson ToJson(DailyLeave dailyLeave)
        {
            DailyLeaveJson result = new DailyLeaveJson();
            result.ID = dailyLeave.ID;
            result.RejisterDate = DateUtility.GetPersianDate(dailyLeave.RegisterDate);
            result.From = DateUtility.GetPersianDate(dailyLeave.From);
            result.TO = DateUtility.GetPersianDate(dailyLeave.To);
            result.Organisation = dailyLeave.OrganisationId != null? dailyLeave.Organisation.Title : "فاقد واحد سازمانی";
            result.PersonnelNumber = dailyLeave.User.Code != null ?  dailyLeave.User.Code : "فاقد کد پرسنلی";
            result.ProjectTitle = dailyLeave.Project!=null? dailyLeave.Project.Title:"فاقد پروژه";
            result.Type = dailyLeave.Type != null ? dailyLeave.Type.ToString() :"فاقد نوع";
            result.Successor = dailyLeave.Successor != null ? dailyLeave.Successor.UserTitle.ToString() : "فاقد جانشین";
            result.UserTitle = dailyLeave.User.UserTitle;
            return result;
        }

    }
}