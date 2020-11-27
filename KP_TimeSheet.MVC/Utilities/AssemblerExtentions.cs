using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public static class AssemblerExtentions
    {
        #region Project Extension

        public static ProjectJson ToJson(this Project entity)
        {
            var result = new ProjectJson();
            result.ID = entity.ID;
            result.Title = entity.Title;
            result.CalendarId = entity.CalendarID;
            result.OwnerId = entity.OwnerID;
            result.OwnerFullName = entity.Owner !=null ? entity.Owner.UserTitle : "فاقد مدیر";
            result.CalendarTitle =  entity.Calendar != null ? entity.Calendar.Title : "فاقد تقویم";
            return result;
        }

        public static IEnumerable<ProjectJson> ToJsons(this IEnumerable<Project> entities)
        {
            List<ProjectJson> result = new List<ProjectJson>();
                foreach (var entity in entities)
                    result.Add(ToJson(entity));
           
            return result;
        }

        #endregion

        #region Task Extension

        public static TaskJson ToJson(this Task entity)
        {
            var result = new TaskJson();

            result.ID = entity.ID;
            result.Title = entity.Title;


            return result;
        }

        public static IEnumerable<TaskJson> ToJsons(this IEnumerable<Task> entities)
        {
            List<TaskJson> result = new List<TaskJson>();
           
                foreach (var entity in entities)
                    result.Add(ToJson(entity));
           
            return result;
        }

        #endregion

        #region WorkHours Extension

        public static WorkHourJson ToJson(this WorkHour entity)
        {
            var result = new WorkHourJson();
           
                result.ID = entity.ID;
                result.Date = entity.Date;
                result.TaskID = entity.Task.ID;
                result.Hours = entity.Hours;
          
            return result;
        }

        public static IEnumerable<WorkHourJson> ToJsons(this IEnumerable<WorkHour> entities)
        {
            List<WorkHourJson> result = new List<WorkHourJson>();
           
                foreach (var entity in entities)
                    result.Add(ToJson(entity));
         
            return result;
        }

        public static WorkHour ToWorkHour(this WorkHourJson jsonObject)
        {
            WorkHour result = new WorkHour();
            
                result.ID =  Guid.NewGuid();
                result.Date = jsonObject.Date;
                result.EmployeeID = jsonObject.EmployeeID;
                result.TaskID = jsonObject.TaskID;
                result.ProjectId = jsonObject.ProjectID;
                result.Hours = Math.Round(TimeSpan.Parse(jsonObject.Hours.ToString()).TotalHours, 2);
                result.WorkflowStageID = jsonObject.WorkflowStageID;
           
              
           
            return result;
        }

        #endregion
    }
}