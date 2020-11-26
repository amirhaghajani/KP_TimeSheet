using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class Assignment
    {

        #region Attributes & Properties

        /// <summary>
        /// شناسه انتساب
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// شناسه پروژه مرتبط یا فعالیت. 
        /// </summary>
        public Guid? ProjectID { get; set; }

        /// <summary>
        /// شناسه فعالیت
        /// </summary>
        public Guid TaskID { get; set; }

        /// <summary>
        /// شئی مرتبط با فعالیت 
        /// </summary>
        public Task Task { get; set; }

        /// <summary>
        /// شناسه کاربر(منبع) مرتبط با انتساب
        /// </summary>
        public Guid ResourceID { get; set; }

        /// <summary>
        /// شئی کاربر(منبع) مرتبط با انتساب
        /// </summary>
        public User Resource { get; set; }

        #endregion

    }
}
