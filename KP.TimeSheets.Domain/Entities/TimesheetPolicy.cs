
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class TimesheetPolicy
    {
        public Guid Id { get; set; }
        public bool isDeactivated{get;set;}
        public User User { get; set; }
        public Guid? UserId { get; set; }

        public DateTime CreateDate { get; set; }
        public DateTime Start { get; set; }
        public DateTime Finish { get; set; }
        public DateTime Validity { get; set; }


        public bool IsDefault { get; set; }

        public bool IsOpen { get; set; }

        public bool UserMustHasHozoor { get; set; }
    }
}
