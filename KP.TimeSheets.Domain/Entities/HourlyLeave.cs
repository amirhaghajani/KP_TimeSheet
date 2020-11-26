using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
   
    public class HourlyLeave :IHaveStage
    {
      

        [DisplayName("ساعت شروع")]
        [Required(ErrorMessage = "کاربر گرامی لطفا ساعت شروع را انتخاب کنید ")]
        [NotMapped]
        public string PersianTimeFrom { get; set; }

        [DisplayName("ساعت پایان")]
        [Required(ErrorMessage = "کاربر گرامی لطفا ساعت پایان را انتخاب کنید ")]
        [NotMapped]
        public string PersianTimeTo { get; set; }

        [DisplayName("تاریخ مرخصی")]
        [Required(ErrorMessage = "کاربر گرامی لطفا تاریخ مرخصی را انتخاب کنید ")]
        [NotMapped]
        public string PersianLeaveDate { get; set; }

        public OrganizationUnit Organisation { get; set; }
        public Guid? OrganisationId { get; set; }
        public Guid ID { get; set; }

        public DateTime RegisterDate { get; set; }

       

        [DisplayName("تاریخ مرخصی")]
        [Column(TypeName = "DateTime2")]
        public DateTime LeaveDate { get; set; }


        [DisplayName("پروژه")]
        public Project Project { get; set; }


        [DisplayName("پروژه")]
        public Guid? ProjectID { get; set; }

        [DisplayName("ساعت شروع")]
        [Column(TypeName = "DateTime2")]
        public DateTime From { get; set; }

        

        [DisplayName("ساعت پایان")]
        [Column(TypeName = "DateTime2")]
        public DateTime To { get; set; }
       
        [DisplayName("کاربر نام")]
        public User User { get; set; }
        [DisplayName(" نام کاربر")]
        public Guid UserId { get; set; }

        [DisplayName("مرحله تایید")]
        public WorkflowStage WorkflowStage { get; set ; }
        [DisplayName("مرحله تایید")]
        public Guid WorkflowStageID { get ; set ; }
        [DisplayName("مرحله قبلی تایید")]
        public Guid? PreviousStage { get ; set ; }
    }
}
