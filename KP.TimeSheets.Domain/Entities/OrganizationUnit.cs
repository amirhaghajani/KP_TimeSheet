using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class OrganizationUnit
    {

        #region Attributes & Properties

        /// <summary>
        /// شناسه واحد سازمانی
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// عنوان واحد سازمانی
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// شناسه واحد سازمانی پدر یا بالاسری 
        /// </summary>
        public Guid? ParentID { get; set; }

        public Guid? ManagerID { get; set; }

        public User Manager { get; set; }

        public virtual ICollection<User> Employees { get; set; }

        #endregion

    }
}
