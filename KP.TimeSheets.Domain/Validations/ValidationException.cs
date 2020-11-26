using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
   public class ValidationException:Exception
    {
        public List<string> Errors { get; set; }

        public ValidationException(List<string> errors)
        {
            Errors = errors;
        }
    }
}
