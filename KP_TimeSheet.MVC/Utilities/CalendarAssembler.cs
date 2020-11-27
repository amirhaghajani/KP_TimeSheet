using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using KP.TimeSheets.Persistance;

namespace KP.TimeSheets.MVC
{
    public class CalendarAssembler
    {
        public static CalendarJson ToJson(Calendar calendar)
        {

            UnitOfWork uow = new UnitOfWork();
            ProjectManager projectManager = new ProjectManager(uow);
            var json = new CalendarJson();
            json.ID = calendar.ID;
            json.IsFridayWD = calendar.IsFridayWD;
            json.IsMondayWD = calendar.IsMondayWD;
            json.IsSaturdayWD = calendar.IsSaturdayWD;
            json.IsSundayWD = calendar.IsSundayWD;
            json.IsThursdayWD = calendar.IsThursdayWD;
            json.IsWednesdayWD = calendar.IsWednesdayWD;
            json.Title = calendar.Title;
            json.IsTuesdayWD = calendar.IsTuesdayWD;
            json.Holidays = HolidayAssembler.ToJsons(calendar.Holidays);
            json.AssignStatus = projectManager.GetAll().Any(x => x.CalendarID == calendar.ID) ? "تخصیص داده شده" : "فاقد تخصیص";
            return json;
        }


        public static List<CalendarJson> ToJsons(IEnumerable<Calendar> calendars)
        {
            var jsons = new List<CalendarJson>();
            foreach (var calendar in calendars)
                jsons.Add(ToJson(calendar));

            return jsons;
        }

        public static Calendar ToCalender(CalendarJson json)
        {
            var calendar = new Calendar();
            calendar.ID = json.ID;
            calendar.IsFridayWD = json.IsFridayWD;
            calendar.IsMondayWD = json.IsMondayWD;
            calendar.IsSaturdayWD = json.IsSaturdayWD;
            calendar.IsSundayWD = json.IsSundayWD;
            calendar.IsThursdayWD = json.IsThursdayWD;
            calendar.IsWednesdayWD = json.IsWednesdayWD;
            calendar.Title = json.Title;
            calendar.IsTuesdayWD = json.IsTuesdayWD;
            calendar.Holidays = HolidayAssembler.ToHolidays(json.Holidays, calendar.ID);

            
            return calendar;
        }

    }
}