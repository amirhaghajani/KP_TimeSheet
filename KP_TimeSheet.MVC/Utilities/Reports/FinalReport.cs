using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class FinalReport
    {
        public FinalReport()
        {
            Rowes = new List<ReportRow>();
            Fields = new List<Field>();
        }

        public List<ReportRow> Rowes { get; set; }
        public List<Field> Fields { get; set; }

        public string HeaderTitle { get; set; }

        public string FirstColumnTitle { get; set; }
    }
}