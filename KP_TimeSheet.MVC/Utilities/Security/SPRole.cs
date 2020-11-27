using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;


namespace KP.TimeSheets.MVC
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = true, AllowMultiple = true)]
    public class SPRole : AuthorizeAttribute,IAuthorizationFilter
    {
        IConfiguration _configuration;
        public string AccessDeniedController { get; set; }
        public string AccessDeniedAction { get; set; }

        public SPRole(string RoleNames, IConfiguration configuration)
        {
            this._configuration = configuration;
            string[] roleNames = RoleNames.Split(',');
            List<string> result = new List<string>();
            foreach (string tmpRoleName in roleNames)
            {
                result.Add(_configuration.GetValue<string>("Roles:"+tmpRoleName));
            }
            this.Roles = string.Join(", ", result.ToArray());
        }

        
        public void OnAuthorization(AuthorizationFilterContext  context)
        {
           
            // //base.OnAuthorization(actionContext);
            // if (!this.IsAuthorized(actionContext))
            // {
            //     if (String.IsNullOrWhiteSpace(AccessDeniedController) || String.IsNullOrWhiteSpace(AccessDeniedAction))
            //     {
            //         AccessDeniedController = "Home";
            //         AccessDeniedAction = "AccessDenied";
            //     }
            //     context.Result = new UnauthorizedResult();
            //     // RedirectToRouteResult(new RouteValueDictionary(new { Controller = AccessDeniedController, Action = AccessDeniedAction }));
            // }
        }


    }
}