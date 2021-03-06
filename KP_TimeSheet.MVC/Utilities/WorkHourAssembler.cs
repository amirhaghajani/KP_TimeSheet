﻿using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class WorkHourAssembler
    {

        public IEnumerable<WorkHourJson> ToJsons(IEnumerable<WorkHour> entities)
        {
            var result = new List<WorkHourJson>();
            if (entities.ToList().Count() > 0)
            {
                foreach (var item in entities)
                {
                    result.Add(ToJson(item));
                }
            }
            return result;
        }
        public WorkHourJson ToJson(WorkHour entity)
        {
            var result = new WorkHourJson();
            result.ID = entity.ID;
            result.Action = entity.Action;
            result.PersianDate = DateUtility.GetPersianDate(entity.Date);
            result.Description = entity.Description;
            result.UserName = entity.Employee.UserName;
            result.Minutes = entity.Minutes;
            result.ProjectTitle = entity.Project.Title;
            result.TaskTitle = entity.Task.Title;
            result.WorkFlowStageTitle = entity.WorkflowStage.Title;
            result.WorkFlowStageType = entity.WorkflowStage.Type;
            result.ProjectID = entity.ProjectId;
            result.TaskID = entity.TaskID;
            return result;
        }


    }
}