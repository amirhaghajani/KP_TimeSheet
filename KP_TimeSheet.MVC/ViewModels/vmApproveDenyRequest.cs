using System;
using System.Collections.Generic;

namespace KP.TimeSheets.MVC.ViewModels
{

    public class vmApproveDenyRequest
    {
        public string ver{get;set;}
        public int type{get;set;}
        public List<vmApproveDenyRequest_Item> approveIds{get;set;}
        public List<vmApproveDenyRequest_Item> denyIds{get;set;}
    }

    public class vmApproveDenyRequest_Item{
        public Guid id{get;set;}
        public string description{get;set;}
    }

}