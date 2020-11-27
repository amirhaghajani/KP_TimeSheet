using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{ 
    public class ProjectJson
    {
        /// <summary>
        /// شناسه پروژه
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// عنوان پروژهُ
        /// </summary>
        public string Title { get; set; }
        public Guid? OwnerId { get; set; }
        public Guid? CalendarId { get; set; }
        public string OwnerFullName { get; set; }
        public string CalendarTitle { get; set; }


    }


}