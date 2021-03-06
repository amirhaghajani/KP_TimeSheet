using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using KP.TimeSheets.MVC;
using Microsoft.AspNetCore.Mvc.Filters;

public class BaseController : Controller
{
    public IUnitOfWork UOW{get;private set;}
    public BaseController(IUnitOfWork uow)
    {
        this.UOW = uow;
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        base.OnActionExecuting(context);
        ViewBag.CurrentUserTitle = CurrentUser==null ? $"{UserName} یافت نشد" : CurrentUser.UserTitle;
        ViewBag.UserIsAdmin = CurrentUser!=null && CurrentUser.IsAdmin.HasValue && CurrentUser.IsAdmin.Value;
    }

    string _userName;
        public string UserName
        {
            get
            {
                if (!string.IsNullOrEmpty(_userName)) return _userName;

                if (this.User != null && this.User.Identity != null)
                {
                    _userName = this.User.Identity.Name;
                }
                if (string.IsNullOrEmpty(_userName)) _userName = Environment.UserName;

                var i = _userName.IndexOf("\\");
                if (i == -1) _userName = "kpe0\\" + _userName;

                return _userName;
            }
        }


    private User _currUser;
    public User CurrentUser
    {
        get
        {
            if(_currUser==null) _currUser = new UserHelper().GetCurrent(this.UOW, UserName);
            return _currUser;
        }
    }
}