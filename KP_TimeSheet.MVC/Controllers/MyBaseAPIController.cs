using System;
using KP.TimeSheets.Persistance;
using Microsoft.AspNetCore.Mvc;

namespace KP.TimeSheets.MVC
{
	public class MyBaseAPIController : ControllerBase
	{
		public RASContext DBContext{get; private set;}
		public MyBaseAPIController(RASContext db){
			this.DBContext = db;
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


		public bool MainChecks(string ver, out string error)
        {
            error = null;

            // if (string.IsNullOrEmpty(ver) || (ver != "-1" && ver != Util.Version))
            // {
            //     error = "ورژن برنامه صحیح نیست. لطفا رفرش نمایید تا آخرین نسخه از سرور دریافت گردد";
            //     return false;
            // }

            //if (this.UserRoles == null || this.UserRoles.Count == 0)
            //{
            //    error = "خطا - برای کاربر رولی یافت نشد - username: " + (string.IsNullOrEmpty(this.UserName) ? "-" : this.UserName);
            //    return false;
            //}
            return true;
        }

        public IActionResult ReturnError(Exception ex, string errorText)
        {
            var error = errorText + " - " + ex.Message + (ex.InnerException == null ? "" : " - " + ex.InnerException.Message);
            return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest, value: error);
        }

	}
}