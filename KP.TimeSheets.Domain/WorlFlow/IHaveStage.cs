using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
   public interface IHaveStage
    {
        WorkflowStage WorkflowStage { get; set; }
         Guid WorkflowStageID { get; set; }
         Guid? PreviousStage { get; set; }
    }
}
