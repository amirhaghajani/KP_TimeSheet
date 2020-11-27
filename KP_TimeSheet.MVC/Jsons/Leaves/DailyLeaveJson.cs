using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class DailyLeaveJson
    {
        public Guid ID { get; set; }
        [DisplayName("نام کابر")]
        public string UserTitle { get; set; }
        [DisplayName("تاریخ شروع")]
        public string From { get; set; }
        [DisplayName("تاریخ پایان")]
        public string TO { get; set; }

        [DisplayName("نام جانشین")]
        public string Successor { get; set; }
        [DisplayName("نام جانشین")]
        public Guid SuccessorID { get; set; }
        [DisplayName("عنوان پروژه")]
        public string ProjectTitle { get; set; }
        public Guid ProjectID { get; set; }

        [DisplayName("شماره پرسنلی")]
        public string PersonnelNumber { get; set; }
        [DisplayName("واحد سازمانی")]
        public string Organisation { get; set; }

        [DisplayName("تاریخ ثبت")]
        public string RejisterDate { get; set; }


        [DisplayName("نوع مرخصی")]
        public string Type { get; set; }


    }
}