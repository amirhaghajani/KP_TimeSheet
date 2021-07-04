using System;

namespace KP.TimeSheets.MVC
{ 
    public class GetWorkHoursByDateJson
    {
        public DateTime date{get;set;}
        public Guid? taskId{get;set;}
        public Guid? projectId{get;set;}
        public Guid? userId{get;set;}
    }
}
