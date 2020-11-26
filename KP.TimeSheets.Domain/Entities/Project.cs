using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class Project
    {

        #region Attributes & Properties

        /// <summary>
        /// شناسه پروژه
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// عنوان پروژه
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// شناسه کاربر مرتبط با پروژه بعنوان مالک/مدیر آن
        /// </summary>
        public Guid? OwnerID { get; set; }

        /// <summary>
        /// شئی کاربر مرتبط با پروژه بعنوان مالک/مدیر آن
        /// </summary>
        public User Owner { get; set; }

        /// <summary>
        /// شناسه تقویم مرتبط با پروژه 
        /// </summary>
        public Guid? CalendarID { get; set; }

        /// <summary>
        /// شئی تقویم مرتبط با پروژه 
        /// </summary>
        public Calendar Calendar { get; set; }

        /// <summary>
        /// مجموعه ای از فعالیت های مرتبط با پروژه
        /// </summary>
        public ICollection<Task> Tasks { get; set; }

        /// <summary>
        /// مجموعه ای از فعالیت های مرتبط با پروژه
        /// </summary>
        public virtual ICollection<WorkHour> WorkHours { get; set; }



        #endregion

    }
}
