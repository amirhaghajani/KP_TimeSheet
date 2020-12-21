using KP.TimeSheets.Domain;
using KP.TimeSheets.Persistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class UserHelper
    {

        public User GetCurrent(IUnitOfWork uow,string userName)
        {
            var userManager = new UserManager(uow);
            // var UserName = System.Environment.UserName; // HttpContext.Current.User.Identity.Name;
            // if (UserName.Contains('\\'))
            // {
            //     string[] test = UserName.ToString().Split('\\');
            //     UserName = test[0] + @"\" + test[1];
            // }

            return userManager.GetByUserName(userName);
        }
    }
}