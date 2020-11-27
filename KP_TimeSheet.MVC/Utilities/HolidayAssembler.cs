using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class HolidayAssembler
    {
        public static HoliDayJson ToJson(Holiday holiday)
        {
            var json = new HoliDayJson();
            json.CalendarID = holiday.CalendarID;
            json.ID = holiday.ID;
            json.Date = DateUtility.GetPersianDate(holiday.Date);
            return json;
        }


        public static List<HoliDayJson> ToJsons(IEnumerable<Holiday> holiDays)
        {
            var jsons = new List<HoliDayJson>();
            foreach (var holiDay in holiDays)
                jsons.Add(ToJson(holiDay));

            return jsons;
        }

        public static Holiday ToHoliday(HoliDayJson json,Guid id)
        {
            var holiday = new Holiday();
            holiday.CalendarID = id;
            if (json.ID == Guid.Empty)
                holiday.ID = Guid.NewGuid();
            else
                holiday.ID = json.ID;
            holiday.Date = DateUtility.GetMiladiDate(json.Date);
            return holiday;
        }
        public static List<Holiday> ToHolidays(IEnumerable<HoliDayJson> jsons, Guid id)
        {
            var holidays = new List<Holiday>();
            foreach (var json in jsons)
                holidays.Add(ToHoliday(json,id));
            return holidays;
        }
    }
}