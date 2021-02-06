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
        public static void RegisterApproveHistory(ApproveAndDenyJson approveAndDenyJson, WorkHour worhHour, IUnitOfWork uow,User currentUser)
        {
            var history = new WorkHourHistory();
            var userManager = new UserManager(uow);
            var historyManager = new WorkHourHistoryManager(uow);
            history.Action = "Approve";
            history.Date = DateTime.Now;
            history.Description = approveAndDenyJson.description;
            history.ManagerID = currentUser.ID;
            history.EntityId = worhHour.ID;
            history.StageID = worhHour.WorkflowStageID;
            historyManager.Add(history);
        }

        public static void RegisterApproveHistory(ApproveAndDenyJson approveAndDenyJson, IUnitOfWork uow,User currentUser)
        {
            var history = new WorkHourHistory();
            var userManager = new UserManager(uow);
            var historyManager = new WorkHourHistoryManager(uow);
            history.Action = "Approve";
            history.Date = DateTime.Now;
            history.Description = approveAndDenyJson.description;
            history.ManagerID = currentUser.ID;
            history.EntityId = new Guid(approveAndDenyJson.id);
            history.StageID = approveAndDenyJson.workflowStageID;
            historyManager.Add(history);
        }


        public static void RegisterDenyHistory(ApproveAndDenyJson approveAndDenyJson, WorkHour worhHour, IUnitOfWork uow,User currentUser)
        {
            var history = new WorkHourHistory();
          
            var historyManager = new WorkHourHistoryManager(uow);
            history.Action = "Deny";
            history.Date = DateTime.Now;
            history.Description = approveAndDenyJson.description;
            history.ManagerID = currentUser.ID;
            history.EntityId = worhHour.ID;
            history.StageID = worhHour.WorkflowStageID;
            historyManager.Add(history);
        }

        public static void RegisterDenyHistory(ApproveAndDenyJson approveAndDenyJson, IUnitOfWork uow,User currentUser)
        {
            var history = new WorkHourHistory();
          
            var historyManager = new WorkHourHistoryManager(uow);
            history.Action = "Deny";
            history.Date = DateTime.Now;
            history.Description = approveAndDenyJson.description;
            history.ManagerID = currentUser.ID;
            history.EntityId = new Guid(approveAndDenyJson.id);
            history.StageID = approveAndDenyJson.workflowStageID;
            historyManager.Add(history);
        }


        public static void RegisterSendHistory(WorkHour workHour, IUnitOfWork uow, User currentUser)
        {
            var history = new WorkHourHistory();
           
            var historyManager = new WorkHourHistoryManager(uow);
            history.Action = "Send";
            history.Date = DateTime.Now;
            history.Description = "ارسال کارکرد به مدیر";
            history.ManagerID = currentUser.ID;
            history.EntityId = workHour.ID;
            history.StageID = workHour.WorkflowStageID;
            historyManager.Add(history);
        }


        public static void RegisterSaveHistory(WorkHour workHour, IUnitOfWork uow,User currentUser )
        {
            var history = new WorkHourHistory();
            var userManager = new UserManager(uow);
            var historyManager = new WorkHourHistoryManager(uow);
            history.Action = "Register";
            history.Date = DateTime.Now;
            history.Description = "ثبت کارکرد جدید";
            history.UserDescription = workHour.Description;
            history.ManagerID = currentUser.ID;
            history.EntityId = workHour.ID;
            history.StageID = workHour.WorkflowStageID;
            historyManager.Add(history);
        }

    }

   
}