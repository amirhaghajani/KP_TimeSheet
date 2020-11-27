using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class HourlyLeaveJson
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

        [DisplayName("تاریخ مرخصی")]
        public string LeaveDate { get; set; }


    }
}