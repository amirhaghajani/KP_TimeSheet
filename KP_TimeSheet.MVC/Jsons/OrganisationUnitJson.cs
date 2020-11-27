using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class OrganisationUnitJson
    {
        public Guid ID { get; set; }
        public string Title { get; set; }
        public string ManagerFullName { get; set; }
        public Guid? ManagerID { get; set; }
        public Guid? ParentId { get; set; }
        public List<UserJson> Users { get; set; }


    }
}