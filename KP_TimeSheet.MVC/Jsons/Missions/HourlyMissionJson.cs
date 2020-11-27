using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class HourlyMissionJson
    {
          public Guid ID { get; set; }

        [DisplayName("نام کابر")]
        public string UserTitle { get; set; }
        [DisplayName("ساعت شروع")]
        public string From { get; set; }
        [DisplayName("ساعت پایان")]
        public string TO { get; set; }
        [DisplayName("تاریخ ثبت")]
        public string RegisterDate { get; set; }

        [DisplayName("عنوان پروژه")]
        public string ProjectTitle { get; set; }
        public Guid ProjectID { get; set; }

        [DisplayName("شماره پرسنلی")]
        public string PersonnelNumber { get; set; }
        [DisplayName("واحد سازمانی")]

 
        public string Organisation { get; set; }

        [DisplayName("تاریخ ماموریت")]
        public string MissionDate { get; set; }

    }
}