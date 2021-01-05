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
    public class HourlyMission : IHaveStage
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
        public string PersianMissionDate { get; set; }
        public Guid ID { get; set; }

        public OrganizationUnit Organisation { get; set; }
        public Guid? OrganisationId { get; set; }
        public DateTime RegisterDate { get; set; }

        public int  Minutes { get; set; }

        [Column(TypeName = "DateTime2")]
        public DateTime Date { get; set; }
        [Column(TypeName = "DateTime2")]
        public DateTime From { get; set; }
        [Column(TypeName = "DateTime2")]
        public DateTime To { get; set; }
        public User User { get; set; }
        public Guid UserID { get; set; }
        public Project Project { get; set; }
        [DisplayName("پروژه")]
        public Guid? ProjectID { get; set; }
        public WorkflowStage WorkflowStage { get ; set ; }
        public Guid WorkflowStageID { get ; set ; }
        public Guid? PreviousStage { get ; set; }
    }
}
