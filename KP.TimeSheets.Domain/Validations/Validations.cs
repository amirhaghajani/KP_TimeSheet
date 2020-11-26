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
            if (workHour.Hours <= 0)
                result.Add("ساعت کارکرد خالی میباشد");
            if (workHour.Date == null )
                result.Add("تاریخ کارکرد خالی میباشد");
            if (workHour.EmployeeID == null)
                result.Add("کاربر خالی میباشد");
            if (workHour.WorkflowStageID == null)
                result.Add("مرحله کارکرد خالی میباشد");
            if (workHour.TaskID == null)
                result.Add("وظیفه کارکرد خالی میباشد");
            if (workHour.ProjectId == null)
                result.Add("پروژه کارکرد خالی میباشد");

            return result;

        }


        public List<string> ValidateRegisterOrganUnit(OrganizationUnit org)
        {
            List<string> result = new List<string>();

            if (org == null)
                result.Add("واحدسازمانی خالی میباشد");
            if (org.ID == null)
                result.Add(" شناسه واحدسازمانی خالی میباشد");
            if (org.ManagerID == null)
                result.Add(" شناسه مدیر واحدسازمانی خالی میباشد");
            if (org.Title == null || org.Title == string.Empty)
                result.Add(" شناسه مدیر واحدسازمانی خالی میباشد");
           

            return result;
        }

        public List<string> ValidateSendrWorkHour(WorkHour workHour)
        {

            List<string> result = new List<string>();
            if (workHour == null)
                result.Add("کارکرد خالی میباشد");
            if (workHour.Hours <= 0)
                result.Add("ساعت کارکرد خالی میباشد");
            if (workHour.Date == null)
                result.Add("تاریخ کارکرد خالی میباشد");
            if (workHour.EmployeeID == null)
                result.Add("کاربر خالی میباشد");
            if (workHour.WorkflowStageID == null)
                result.Add("مرحله کارکرد خالی میباشد");
            if (workHour.TaskID == null)
                result.Add("وظیفه کارکرد خالی میباشد");
            if (workHour.ProjectId == null)
                result.Add("پروژه کارکرد خالی میباشد");
           

            return result;
        }

    }
}
