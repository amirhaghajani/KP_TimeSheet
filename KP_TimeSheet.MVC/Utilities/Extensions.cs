using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public static class Extensions
    {

        #region Extensions Method fro DateTime

        public static string ToPersianDateString(this DateTime dt)
        {
            string result = string.Empty;
            try
            {
                PersianCalendar pc = new PersianCalendar();
                return (string.Format("{0}/{1}/{2}", 
                    pc.GetYear(dt), 
                    pc.GetMonth(dt).ToString().PadLeft(2,'0'), 
                    pc.GetDayOfMonth(dt).ToString().PadLeft(2,'0')));
            }
            catch
            {

            }
            return result;
        }

        public static string ToPersianDayOfWeek(this DateTime dt)
        {
            string result = string.Empty;
            try
            {
                if (dt.DayOfWeek == DayOfWeek.Saturday)
                    result = "شنبه";
                if (dt.DayOfWeek == DayOfWeek.Sunday)
                    result = "یک شنبه";
                if (dt.DayOfWeek == DayOfWeek.Monday)
                    result = "دوشنبه";
                if (dt.DayOfWeek == DayOfWeek.Tuesday)
                    result = "سه شنبه";
                if (dt.DayOfWeek == DayOfWeek.Wednesday)
                    result = "چهارشنبه";
                if (dt.DayOfWeek == DayOfWeek.Thursday)
                    result = "پنج شنبه";
                if (dt.DayOfWeek == DayOfWeek.Friday)
                    result = "جمعه";
            }
            catch
            {

            }
            return result;
        }

        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
            return dt.AddDays(-1 * diff).Date;
        }

        public static DateTime EndOfWeek(this DateTime dt, DayOfWeek endOfWeek)
        {
            int diff = (7 + (endOfWeek - dt.DayOfWeek)) % 7;
            return dt.AddDays(diff).Date;
        }

        #endregion

    }
}