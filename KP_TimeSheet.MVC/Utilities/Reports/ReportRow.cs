using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class ReportRow
    {
        public ReportRow()
        {
            Values = new List<FieldValue>();
        }

        public Guid ID { get; set; }
        public List<FieldValue> Values { get; set; }

        public string Title { get; set; }

     

    }
}