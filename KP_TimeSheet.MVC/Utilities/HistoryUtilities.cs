using KP.TimeSheets.Domain;
using KP.TimeSheets.Persistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    static class HistoryUtilities
    {
        public static void RegisterApproveHistory(ApproveAndDenyJson approveAndDenyJson, WorkHour worhHour)
        {
            UnitOfWork uow = new UnitOfWork();
            var history = new WorkHourHistory();
            var userManager = new UserManager(uow);
            var historyManager = new WorkHourHistoryManager(uow);
            history.Action = "Approve";
            history.Date = DateTime.Now;
            history.Description = approveAndDenyJson.description;
            history.ManagerID = new UserHelper().GetCurrent().ID;
            history.WorkHourID = worhHour.ID;
            history.StageID = worhHour.WorkflowStageID;
            historyManager.Add(history);
        }


        public static void RegisterDenyHistory(ApproveAndDenyJson approveAndDenyJson, WorkHour worhHour)
        {
            UnitOfWork uow = new UnitOfWork();
            var history = new WorkHourHistory();
          
            var historyManager = new WorkHourHistoryManager(uow);
            history.Action = "Deny";
            history.Date = DateTime.Now;
            history.Description = approveAndDenyJson.description;
            history.ManagerID = new UserHelper().GetCurrent().ID;
            history.WorkHourID = worhHour.ID;
            history.StageID = worhHour.WorkflowStageID;
            historyManager.Add(history);
        }


        public static void RegisterSendHistory(WorkHour workHour)
        {
            UnitOfWork uow = new UnitOfWork();
            var history = new WorkHourHistory();
           
            var historyManager = new WorkHourHistoryManager(uow);
            history.Action = "Send";
            history.Date = DateTime.Now;
            history.Description = "ارسال کارکرد به مدیر";
            history.ManagerID = new UserHelper().GetCurrent().ID;
            history.WorkHourID = workHour.ID;
            history.StageID = workHour.WorkflowStageID;
            historyManager.Add(history);
        }


        public static void RegisterSaveHistory(WorkHour workHour )
        {
            UnitOfWork uow = new UnitOfWork();
            var history = new WorkHourHistory();
            var userManager = new UserManager(uow);
            var historyManager = new WorkHourHistoryManager(uow);
            history.Action = "Register";
            history.Date = DateTime.Now;
            history.Description = "ثبت کارکرد جدید";
            history.ManagerID = new UserHelper().GetCurrent().ID;
            history.WorkHourID = workHour.ID;
            history.StageID = workHour.WorkflowStageID;
            historyManager.Add(history);
        }

    }

   
}