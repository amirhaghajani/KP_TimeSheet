using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class FieldValue
    {
        public Guid FieldId { get; set; }
        public Guid RowId { get; set; }
        public string Value { get; set; }
        public double CalculativeValue { get; set; }

    }
}