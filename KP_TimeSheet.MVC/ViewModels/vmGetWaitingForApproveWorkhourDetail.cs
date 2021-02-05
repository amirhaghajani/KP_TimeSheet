using System;
using System.Collections.Generic;

namespace KP.TimeSheets.MVC.ViewModels
{
    public class vmGetWaitingForApproveWorkhourDetail
    {
        public Guid workHourId{get;set;}
        public DateTime date{get;set;}
        public Guid projectId{get;set;}
        public string projectTitle{get;set;}
        public int minutes{get;set;}
        public string title{get;set;}
        public string description{get;set;}
        public bool isSend{get;set;}

        public string date_persian {get;set;}
        public string day_persian {get;set;}
    }

}