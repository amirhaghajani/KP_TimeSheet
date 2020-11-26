using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class User
    {

        #region Attributes & Properties

        /// <summary>
        /// شناسه کاربر 
        /// میباشد. ResourceUID چنانچه کاربر بعنوان منبع در پراجکت سرور باشد این شناسه معادل همان شناسه منبع یا
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// کد/شماره پرسنلی کاربر
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// نام کاربر
        /// </summary>
        
        public string UserTitle { get; set; }

        /// <summary>
        /// نام کاربری
        /// </summary>
        public string UserName { get; set; }

       
        /// <summary>
        /// شناسه واحد سازمانی
        /// </summary>
        public Guid? OrganizationUnitID { get; set; }

        /// <summary>
        /// شئی واحد سازمانی
        /// </summary>
        public OrganizationUnit OrganizationUnit { get; set; }


        /// <summary>
        /// رابطه چند به چند کاربر و ارگان.
        /// </summary>
        public virtual ICollection<OrganizationUnit> Organisations { get; set; }

        /// <summary>
        ///  مجموعه ای از پروژه ها که کاربر بعنوان مالک/مدیر است.
        /// </summary>
        public ICollection<Project> Projects { get; set; }

        /// <summary>
        ///  مجموعه ای از ساعات حضور کاربر.
        /// </summary>
        public ICollection<PresenceHour> PresenceHours { get; set; }

        /// <summary>
        ///  مجموعه ای از ساعات کاری(کارکرد) کاربر.
        /// </summary>
        public ICollection<WorkHour> WorkHours { get; set; }

        /// <summary>
        ///  مجموعه ای از دوره های نمایش کاربر.
        /// </summary>
        public ICollection<DisplayPeriod> DisplayPeriods { get; set; }

        /// <summary>
        ///  مجموعه ای از انتساب های مرتبط با کاربر.
        /// </summary>
        public ICollection<Assignment> Assignments { get; set; }

        /// <summary>
        ///  مجموعه ای ازتاریخچه مرتبط با کاربر.
        /// </summary>
        public ICollection<WorkHourHistory> WorkHourHistories { get; set; }
        /// <summary>
        ///  مجموعه ای مرخصی ساعتی مرتبط با کاربر.
        /// </summary>
        public virtual ICollection<HourlyLeave> HourlyLeaves { get; set; }
        /// <summary>
        ///  مجموعه ای مرخصی روزانه مرتبط با کاربر.
        /// </summary>
        public virtual ICollection<DailyLeave> DailyLeaves { get; set; }
        /// <summary>
        ///  مجموعه ای ماموریت مرتبط با کاربر.
        /// </summary>
        public virtual ICollection<HourlyMission> HourlyMissions { get; set; }



        #endregion

    }
}
