using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
  public  class Validations
    {
     

        public List<string> ValidateRegisterWorkHour(WorkHour workHour)
        {
            List<string> result = new List<string>();
            if (workHour == null)
                result.Add("کارکرد خالی میباشد");
            if (workHour.Minutes <= 0)
                result.Add("ساعت کارکرد خالی میباشد");
            if (workHour.Date == DateTime.MinValue )
                result.Add("تاریخ کارکرد خالی میباشد");
            if (workHour.EmployeeID == Guid.Empty)
                result.Add("کاربر خالی میباشد");
            if (workHour.WorkflowStageID == Guid.Empty)
                result.Add("مرحله کارکرد خالی میباشد");
            if (workHour.TaskID == Guid.Empty)
                result.Add("وظیفه کارکرد خالی میباشد");
            if (workHour.ProjectId == Guid.Empty)
                result.Add("پروژه کارکرد خالی میباشد");

            return result;

        }


        public List<string> ValidateRegisterOrganUnit(OrganizationUnit org)
        {
            List<string> result = new List<string>();

            if (org == null)
                result.Add("واحدسازمانی خالی میباشد");
            if (org.ID == Guid.Empty)
                result.Add(" شناسه واحدسازمانی خالی میباشد");
            if (org.ManagerID == null)
                result.Add(" شناسه مدیر واحدسازمانی خالی میباشد");
            if (org.Title == null || org.Title == string.Empty)
                result.Add(" شناسه مدیر واحدسازمانی خالی میباشد");
           

            return result;
        }

        public List<string> ValidateSendrWorkHour(WorkHour workHour, bool isOpen, bool mustHaveHozoor, int registeredWorkhourMinuteThisDate, int? hozoor)
        {
            List<string> result = new List<string>();

            if (workHour == null)
                result.Add("کارکرد خالی میباشد");

            if (workHour.Date == DateTime.MinValue)
                result.Add("تاریخ کارکرد خالی میباشد");

            if(result.Count>0) return result;

            if (!isOpen)
            {
                result.Add($"تایم شیت در این تاریخ {DateUtility.GetPersianDate(workHour.Date)} بسته است. امکان تغییر نمی باشد");
            }
            else
            {
                if (mustHaveHozoor)
                {
                    if (!hozoor.HasValue && hozoor == 0) result.Add($"در این تاریخ {DateUtility.GetPersianDate(workHour.Date)} حضور یافت نشد. امکان ارسال کارکرد نمی باشد");
                    if (hozoor.HasValue && registeredWorkhourMinuteThisDate > hozoor) result.Add("کارکرد بیش از حضور. امکان ارسال کارکرد نمی باشد");
                }
            }
            if(result.Count>0) return result;


            if (workHour.Minutes <= 0)
                result.Add("ساعت کارکرد خالی میباشد");
            if (workHour.EmployeeID == Guid.Empty)
                result.Add("کاربر خالی میباشد");
            if (workHour.WorkflowStageID == Guid.Empty)
                result.Add("مرحله کارکرد خالی میباشد");
            if (workHour.TaskID == Guid.Empty)
                result.Add("وظیفه کارکرد خالی میباشد");
            if (workHour.ProjectId == Guid.Empty)
                result.Add("پروژه کارکرد خالی میباشد");

            return result;
        }

    }
}
