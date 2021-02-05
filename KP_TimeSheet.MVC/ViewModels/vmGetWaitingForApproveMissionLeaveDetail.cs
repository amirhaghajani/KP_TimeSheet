using System;
using System.Collections.Generic;

namespace KP.TimeSheets.MVC.ViewModels
{
    public class vmGetWaitingForApproveMissionLeaveDetail
    {
        public Guid id{get;set;}

        public string description{get;set;}
        public bool isSend{get;set;}

        public string from {get;set;}
        public string from_day {get;set;}

        public string to {get;set;}
        public string to_day {get;set;}
    }

}