using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Principal;

namespace KP.TimeSheets.MVC
{
    public class UserAssembler
    {



        public IEnumerable<UserJson> ToJsons(IEnumerable<User> Users)
        {
            var result = new List<UserJson>();

            foreach (var user in Users)
            {
                result.Add(ToJson(user));
            }
            return result;
        }

        public UserJson ToJson(User user)
        {
            var result = new UserJson();
            result.ID = user.ID;
            result.FullName = user.UserTitle;
            return result;

        }

      

    }
}