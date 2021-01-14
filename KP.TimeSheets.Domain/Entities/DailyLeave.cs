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
    public enum DailyLeaveType
    {
        [Display(Name = "استحقاقی")]
        Deserved=1,
        [Display(Name = "استعلاجی")]
        Cure=2,
        
        
        [Display(Name = "بدون حقوق")]
        WithOutSalary=3,
        

        [Display(Name = "سایر موارد")]
        OtherCases=4
    }
    public  class DailyLeave : IHaveStage
    {
        [Key]
        public Guid ID { get; set; }
        public DateTime RegisterDate { get; set; }


        [Column(TypeName = "DateTime2")]
        [DisplayName("تاریخ شروع")]
        public DateTime From { get; set; }


        [DisplayName("تاریخ شروع")]
        [Required(ErrorMessage = "کاربر گرامی لطفا تاریخ شروع را انتخاب کنید ")]
        [NotMapped]
        public string PersianDateFrom { get; set; }


        [DisplayName("تاریخ پایان")]
        [Column(TypeName = "DateTime2")]
        public DateTime To { get; set; }


        [DisplayName("تاریخ شروع")]
        [Required(ErrorMessage = "کاربر گرامی لطفا تاریخ پایان را انتخاب کنید ")]
        [NotMapped]
        public string PersianDateTo { get; set; }


        public OrganizationUnit Organisation { get; set; }
        public Guid? OrganisationId { get; set; }

        public User User { get; set; }
        public Guid UserID { get; set; }
        [DisplayName("جانشین")]
        public Guid? SuccessorID { get; set; }
        [DisplayName("جانشین")]
        public User Successor { get; set; }
        [DisplayName("پروژه")]
        public Project Project { get; set; }
        [DisplayName("پروژه")]
        public Guid? ProjectID { get; set; }
        [DisplayName("نوع مرخصی")]
        [Required(ErrorMessage = "کاربر گرامی لطفا نوع مرخصی را انتخاب کنید ")]
        public DailyLeaveType Type { get; set; }
      
        public WorkflowStage WorkflowStage { get ; set; }
        public Guid WorkflowStageID { get ; set ; }
        public Guid? PreviousStage { get; set ; }
       

    }
}
