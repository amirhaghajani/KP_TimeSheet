using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class Task
    {

        #region Attributes & Properties

        /// <summary>
        /// شناسه فعالیت
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// عنوان پروژه
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// شناسه پروژه مرتبط یا فعالیت. 
        /// </summary>
        public Guid? ProjectID { get; set; }

        /// <summary>
        /// شئی پروژه مرتبط فعالیت. 
        /// </summary>
        public Project Project { get; set; }

        /// <summary>
        /// شناسه فعالیت پدر
        /// </summary>
        public Guid? ParentTaskID { get; set; }

        /// <summary>
        /// شئی مرتبط فعالیت پدر 
        /// </summary>
        public Task ParentTask { get; set; }

        /// <summary>
        /// مجموعه ای از فعالیت های زیر مجموعه این فعالیتُ
        /// </summary>
        public ICollection<Task> Childs { get; set; }

        /// <summary>
        /// مجموعه ای از ساعت کاری(کارکردها) مرتبط با این فعالیت
        /// </summary>
        public ICollection<WorkHour> WorkHours { get; set; }

        /// <summary>
        /// مجموعه ای از انتساب های این فعالیت
        /// </summary>
        public ICollection<Assignment> Assignments { get; set; }

        #endregion

    }
}
