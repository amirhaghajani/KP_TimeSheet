using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
   public class WorkHourHistory
    {
        public Guid ID { get; set; }
        public Guid? EntityId { get; set; }
        public WorkflowStage Stage { get; set; }
        public Guid? StageID { get; set; }
        public string Action { get; set; }
        public User Manager { get; set; }
        public Guid? ManagerID { get; set; }
        public string Description { get; set; }
        public string UserDescription{get;set;}

        [Column(TypeName = "DateTime2")]
        public DateTime Date { get; set; }
    }
}
