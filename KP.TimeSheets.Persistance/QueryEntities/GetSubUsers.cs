using System;

namespace KP.TimeSheets.Persistance.QueryEntities
{
    public class GetSubUsers
    {
        public Guid UserId { get; set; }
        public string UserTitle { get; set; }
        public int? Minutes { get; set; }
    }

}