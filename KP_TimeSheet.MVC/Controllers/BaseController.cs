using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using KP.TimeSheets.MVC;
using Microsoft.AspNetCore.Mvc.Filters;

public class BaseController : Controller
{
    IUnitOfWork _uow;
    public BaseController(IUnitOfWork uow)
    {
        this._uow = uow;
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        base.OnActionExecuting(context);
        ViewBag.CurrentUserTitle = CurrentUser.UserTitle;
    }


    private User _currUser;
    public User CurrentUser
    {
        get
        {
            if(_currUser==null) _currUser = new UserHelper().GetCurrent(this._uow);
            return _currUser;
        }
    }
}