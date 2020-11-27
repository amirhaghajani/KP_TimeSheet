using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class WorkHourHistoryAssembler
    {

        public IEnumerable<WorkHourHistoryJson> ToJsons(IEnumerable<WorkHourHistory> Entities)
        {
            List<WorkHourHistoryJson> result = new List<WorkHourHistoryJson>();

            foreach (var entity in Entities)
            {
                result.Add(ToJson(entity));
            }
            return result;
        }

        public WorkHourHistoryJson ToJson(WorkHourHistory entity)
        {
            WorkHourHistoryJson json = new WorkHourHistoryJson();

            json.Action = entity.Action;
            json.Description = entity.Description;
            json.ID = entity.ID;
            json.ManagerName = entity.Manager.UserTitle;
            json.PersianDate = DateUtility.GetPersianDate(entity.Date);
            json.Time = DateUtility.ConvertDateTimeToTime(entity.Date);
            json.StageTitle = entity.Stage.Title;

            return json;
        }
    }
}