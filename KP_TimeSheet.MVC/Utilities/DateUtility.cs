using System;
using System.Collections.Generic;
using System.Globalization;

namespace KP.TimeSheets.MVC
{
    public class DateUtility
    {

        public static DateTime ConvertStringTimeToDateTime(string time)
        {
            string[] splitedTime = time.ToString().Split(':');
            return new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, int.Parse(splitedTime[0]), int.Parse(splitedTime[1]), 0, 0);
        }

        public static string ConvertDateTimeToTime(DateTime date)
        {
            string result;
            result = date.Hour.ToString() + ":" + date.Minute.ToString();
            return result;
        }

        static DateTime _defDD = new DateTime().AddYears(2000);
        public static string ConvertToTimeSpan(double time)
        {
            var minutes = time * 60;
            var hour =(int) minutes / 60;
            var minute = minutes % 60;
            return hour + ":" + minute.ToString("00");
        }

        public static string GetPersianDate(DateTime? date)
        {
            if (!date.HasValue)
                return string.Empty;
            if (date.Value == DateTime.MaxValue || date.Value == DateTime.MinValue)
                return string.Empty;
            PersianCalendar pc = new PersianCalendar();
            var month = pc.GetMonth(date.Value) < 10 ? "0" + pc.GetMonth(date.Value).ToString() : pc.GetMonth(date.Value).ToString();
            var day = pc.GetDayOfMonth(date.Value) < 10 ? "0" + pc.GetDayOfMonth(date.Value).ToString() : pc.GetDayOfMonth(date.Value).ToString();
            return pc.GetYear(date.Value) + "/" + month + "/" + day;
        }

        public static int GetPersianMonth(DateTime? date)
        {

            PersianCalendar pc = new PersianCalendar();
            if (!date.HasValue)
                return 0;
            if (date.Value == DateTime.MaxValue || date.Value == DateTime.MinValue)
                return 0;

            return pc.GetMonth(date.Value);

        }


        public static string GetPersinaManth(DateTime date)
        {

            if (date == DateTime.MaxValue || date == DateTime.MinValue)
                return string.Empty;
            PersianCalendar pc = new PersianCalendar();
            var month = pc.GetMonth(date) < 10 ? "0" + pc.GetMonth(date).ToString() : pc.GetMonth(date).ToString();
            return month;



        }

        public static string GetPersianManth(DateTime date)
        {

            if (date == DateTime.MaxValue || date == DateTime.MinValue)
                return string.Empty;
            PersianCalendar pc = new PersianCalendar();
            var month = pc.GetMonth(date) < 10 ? "0" + pc.GetMonth(date).ToString() : pc.GetMonth(date).ToString();
            return month;
        }

        public static string GetPersianYear(DateTime date)
        {
            if (date == DateTime.MaxValue || date == DateTime.MinValue)
                return string.Empty;
            PersianCalendar pc = new PersianCalendar();
            return pc.GetYear(date).ToString();
        }

        public static string GetShortPersianYearMonth(DateTime? date)
        {
            if (!date.HasValue)
                return string.Empty;

            if (date == DateTime.MaxValue || date == DateTime.MinValue)
                return string.Empty;

            PersianCalendar pc = new PersianCalendar();
            string strPersianYear = pc.GetYear(date.Value).ToString();
            return (pc.GetYear(date.Value) < 1400) ? strPersianYear.Substring(2) : strPersianYear;
        }

        public static string GetShortPersianDate(DateTime? date)
        {
            if (!date.HasValue)
                return string.Empty;
            var strDate = GetPersianDate(date);
            return strDate.Substring(2);
        }


        public static int GetPersianDayOfMonth(DateTime date)
        {
            PersianCalendar pc = new PersianCalendar();
            return pc.GetDayOfMonth(date);
        }


        public static List<string> GetCalenderOfMounth(DateTime date)
        {
            List<string> calender = new List<string>();

            PersianCalendar pc = new PersianCalendar();
            var s = pc.GetMonth(date);

            if (pc.GetMonth(date) <= 6)
            {
                for (int i = 1; i <= 31; i++)
                {
                    calender.Add(pc.GetYear(date) + "/" + pc.GetMonth(date) + "/" + i);
                }
            }
            if (pc.GetMonth(date) >= 7 && pc.GetMonth(date) <= 11)
            {
                for (int i = 1; i <= 30; i++)
                {
                    calender.Add(pc.GetYear(date) + "/" + pc.GetMonth(date) + "/" + i);
                }

            }
            if (pc.GetMonth(date) == 12 && pc.IsLeapYear(pc.GetYear(date)))
            {
                for (int i = 1; i <= 30; i++)
                {
                    calender.Add(pc.GetYear(date) + "/" + pc.GetMonth(date) + "/" + i);
                }
            }
            if (pc.GetMonth(date) == 12 && !pc.IsLeapYear(pc.GetYear(date)))
            {
                for (int i = 1; i <= 29; i++)
                {
                    calender.Add(pc.GetYear(date) + "/" + pc.GetMonth(date) + "/" + i);
                }
            }
            return calender;

        }

        public static DateTime GetMiladiDate(string date)
        {
            PersianCalendar pc = new PersianCalendar();
            string[] splitedDate = date.Split('/');
            int year = Convert.ToInt32(splitedDate[0]);
            int month = Convert.ToInt32(splitedDate[1]);
            int DDLDay = Convert.ToInt32(splitedDate[2]);
            if (month == 12 && DDLDay == 30)
                DDLDay = 29;
            return pc.ToDateTime(year, month, DDLDay, 0, 0, 0, 0);
        }



    }
}