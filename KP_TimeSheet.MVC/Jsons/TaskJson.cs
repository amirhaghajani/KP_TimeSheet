using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{ 
    public class TaskJson
    {
        /// <summary>
        /// شناسه فعالیت
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// عنوان فعالیت
        /// </summary>
        public string Title { get; set; }

    }


}