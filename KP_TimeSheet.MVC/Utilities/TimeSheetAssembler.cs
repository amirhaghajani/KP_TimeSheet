using KP.TimeSheets.Domain;
using KP.TimeSheets.Persistance;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class TimeSheetAssembler
    {


        public static WorkHour ToEntity(TimeSheetJson json)
        {
            var result = new WorkHour();

            return result;

        }

        public static List<TimeSheetJson> ToJsonsForRegister(IEnumerable<PresenceHour> presenceHours, IEnumerable<WorkHour> workHours)
        {
            var result = new List<TimeSheetJson>();
            int timeSheetID = 1;



            TimeSheetJson tsjSendWH = new TimeSheetJson();
            tsjSendWH.UID = Guid.NewGuid();
            tsjSendWH.id = timeSheetID++;
            tsjSendWH.parentId = null;
            tsjSendWH.Title = "عملیات";
            tsjSendWH.Values = new List<TimeSheetValueJson>();



            TimeSheetJson tsjPresHours = new TimeSheetJson();
            tsjPresHours.UID = Guid.NewGuid();
            tsjPresHours.id = timeSheetID++;
            tsjPresHours.parentId = null;
            tsjPresHours.Title = "حضور";
            tsjPresHours.Values = new List<TimeSheetValueJson>();


            List<TimeSheetJson> tsjWorkHours = new List<TimeSheetJson>();
            //Create WorkHour Row - ایجاد ردیف کارکرد در برگه زمانی
            var PrentWorkHour = new TimeSheetJson();
            PrentWorkHour.UID = Guid.NewGuid();
            PrentWorkHour.id = timeSheetID++;
            PrentWorkHour.parentId = null;
            PrentWorkHour.Title = "کارکرد";
            PrentWorkHour.Values = new List<TimeSheetValueJson>();
            tsjWorkHours.Add(PrentWorkHour);

            var groupingTasks = workHours.GroupBy(x => x.TaskID).Select(y => y.FirstOrDefault()).ToList();
            var groupingProjects = workHours.GroupBy(x => x.ProjectId).Select(y => y.FirstOrDefault()).ToList();

            foreach (var item in groupingProjects)
            {
                var ProjectChild = new TimeSheetJson();
                ProjectChild.Type = "Project";
                ProjectChild.UID = item.ProjectId;
                var timesheettest = timeSheetID;
                ProjectChild.id = timeSheetID++;
                ProjectChild.parentId = 3;
                ProjectChild.Title = item.Project.Title;
                ProjectChild.Values = new List<TimeSheetValueJson>();
                tsjWorkHours.Add(ProjectChild);


                foreach (var w in groupingTasks)
                {
                    if (item.ProjectId == w.ProjectId)
                    {
                        var TaskChilde = new TimeSheetJson();
                        TaskChilde.Type = "Task";
                        TaskChilde.UID = w.TaskID;
                        TaskChilde.id = timeSheetID++;
                        TaskChilde.parentId = timesheettest;
                        TaskChilde.Title = w.Task.Title;
                        TaskChilde.Values = new List<TimeSheetValueJson>();
                        tsjWorkHours.Add(TaskChilde);
                    }
                }

            }

            //Create Row for Different between Presence Hour And Work Hour - ایجاد ردیف اختلاف حضور و کارکرد در برگه زمانی
            TimeSheetJson tsjDiffPH_WH = new TimeSheetJson();
            tsjDiffPH_WH.UID = Guid.NewGuid();
            tsjDiffPH_WH.id = timeSheetID++;
            tsjDiffPH_WH.parentId = null;
            tsjDiffPH_WH.Title = "اختلاف حضور و کارکرد";
            tsjDiffPH_WH.Values = new List<TimeSheetValueJson>();
            tsjDiffPH_WH.Type = "Defference";



            presenceHours.OrderBy(phItem => phItem.Date)
                .ToList().ForEach(phItem =>
                {
                    double phHours = phItem.Hours;
                    List<WorkHour> selWorkHour = workHours.Where(whItem => whItem.Date.Equals(phItem.Date)).ToList();
                    double whHours = (selWorkHour != null && selWorkHour.Count >= 0) ? selWorkHour.Sum(x => x.Hours) : 0;
                    //Create Columns/Values for Presence Hours
                    TimeSheetValueJson phTSJValue = new TimeSheetValueJson();
                    phTSJValue.Date = phItem.Date;
                    phTSJValue.Day = phItem.Date.DayOfWeek.ToString();
                    phTSJValue.PersianDate = phItem.Date.ToPersianDateString();
                    phTSJValue.PersianDay = phItem.Date.ToPersianDayOfWeek();
                    phTSJValue.Title = phTSJValue.PersianDate + "-" + phTSJValue.PersianDay;
                    phTSJValue.Value = DateUtility.ConvertToTimeSpan(phHours);
                    tsjPresHours.Values.Add(phTSJValue);


                    //Create Columns/Values for Work Hours in first 
                    TimeSheetValueJson whTSJValue = new TimeSheetValueJson();
                    whTSJValue.Date = phItem.Date;
                    whTSJValue.Day = phItem.Date.DayOfWeek.ToString();
                    whTSJValue.PersianDate = phItem.Date.ToPersianDateString();
                    whTSJValue.PersianDay = phItem.Date.ToPersianDayOfWeek();
                    whTSJValue.Title = whTSJValue.PersianDate + "-" + whTSJValue.PersianDay;
                    whTSJValue.Value = DateUtility.ConvertToTimeSpan(whHours);
                    tsjWorkHours[0].Values.Add(whTSJValue);

                    for (int i = 1; i < tsjWorkHours.Count(); i++)
                    {
                        TimeSheetValueJson whTSJValue1 = new TimeSheetValueJson();
                        whTSJValue1.Date = phItem.Date;
                        whTSJValue1.Day = phItem.Date.DayOfWeek.ToString();
                        whTSJValue1.PersianDate = phItem.Date.ToPersianDateString();
                        whTSJValue1.PersianDay = phItem.Date.ToPersianDayOfWeek();
                        whTSJValue1.Title = whTSJValue1.PersianDate + "-" + whTSJValue1.PersianDay;
                        whTSJValue1.Value = "  ";
                        tsjWorkHours[i].Values.Add(whTSJValue1);

                        if (tsjWorkHours[i].Type == "Project")
                        {
                            var hourCount = selWorkHour.Where(y => y.ProjectId == tsjWorkHours[i].UID).Sum(x => x.Hours);
                            whTSJValue1.Value = DateUtility.ConvertToTimeSpan(hourCount);
                        }
                        if (tsjWorkHours[i].Type == "Task")
                        {
                            var hourCount = selWorkHour.Where(y => y.TaskID == tsjWorkHours[i].UID).Sum(x => x.Hours);
                            whTSJValue1.Value = DateUtility.ConvertToTimeSpan(hourCount);
                        }

                    }

                    //var groupingByDate = workHours.GroupBy(x => x.Date).Select(y => y.FirstOrDefault()).ToList();

                    

                    //Create Row for Different between Presence Hour And Work Hour
                    TimeSheetValueJson diffPH_WHTSJValue = new TimeSheetValueJson();
                    diffPH_WHTSJValue.Date = phItem.Date;
                    diffPH_WHTSJValue.Day = phItem.Date.DayOfWeek.ToString();
                    diffPH_WHTSJValue.PersianDate = phItem.Date.ToPersianDateString();
                    diffPH_WHTSJValue.PersianDay = phItem.Date.ToPersianDayOfWeek();
                    diffPH_WHTSJValue.Title = diffPH_WHTSJValue.PersianDate + "-" + diffPH_WHTSJValue.PersianDay;
                    diffPH_WHTSJValue.Value = DateUtility.ConvertToTimeSpan(Math.Abs(phHours - whHours));
                    tsjDiffPH_WH.Values.Add(diffPH_WHTSJValue);


                    //Create Row for Sent Work Hour
                    TimeSheetValueJson sendWHTSJValue = new TimeSheetValueJson();
                    sendWHTSJValue.Date = phItem.Date;
                    sendWHTSJValue.Day = phItem.Date.DayOfWeek.ToString();
                    sendWHTSJValue.PersianDate = phItem.Date.ToPersianDateString();
                    sendWHTSJValue.PersianDay = phItem.Date.ToPersianDayOfWeek();
                    sendWHTSJValue.Title = diffPH_WHTSJValue.PersianDate + "-" + diffPH_WHTSJValue.PersianDay;

                    if (phItem.Date >= DateTime.Now.Date )
                                           sendWHTSJValue.Value = "False False";
                    if (phItem.Hours > 0 && phItem.Date <= DateTime.Now.Date)
                        sendWHTSJValue.Value = "True True";
                    if (phItem.Hours <= 0 && phItem.Date <= DateTime.Now.Date)
                        sendWHTSJValue.Value = "True False";



                    tsjSendWH.Values.Add(sendWHTSJValue);


                });

            result.Add(tsjSendWH);
            result.Add(tsjPresHours);
            foreach (var item in tsjWorkHours)
            {
                result.Add(item);
            }
            result.Add(tsjDiffPH_WH);




            return result;
        }


        public static List<TimeSheetJson> ToJsonsForConfirm(IEnumerable<PresenceHour> presenceHours, IEnumerable<WorkHour> workHours,User user )
        {
            UnitOfWork uow = new UnitOfWork();
            TimeSheetManager timesheetMnager = new TimeSheetManager(uow);
            var result = new List<TimeSheetJson>();
            int timeSheetID = 1;
            var groupingTasks = workHours.GroupBy(x => x.TaskID).Select(y => y.FirstOrDefault()).ToList();
            var groupingProjects = workHours.GroupBy(x => x.ProjectId).Select(y => y.FirstOrDefault()).ToList();
            
            List<WorkHour> approveItems = new List<WorkHour>();

            List<WorkHour> notApproveItems = new List<WorkHour>();


            foreach (var item in workHours)
            {
                if (timesheetMnager.ApprovementStatus(item,new UserHelper().GetCurrent().UserName) == "Approve")
                {
                    approveItems.Add(item);
                }
                if (timesheetMnager.ApprovementStatus(item, new UserHelper().GetCurrent().UserName) == "NotApprove")
                {
                    notApproveItems.Add(item);
                }
            }


            var groupingTasksApprove = approveItems.GroupBy(x => x.TaskID).Select(y => y.FirstOrDefault()).ToList();
            var groupingProjectsApprove = approveItems.GroupBy(x => x.ProjectId).Select(y => y.FirstOrDefault()).ToList();
            var groupingTasksNotApprove = notApproveItems.GroupBy(x => x.TaskID).Select(y => y.FirstOrDefault()).ToList();
            var groupingProjectsNotApprove = notApproveItems.GroupBy(x => x.ProjectId).Select(y => y.FirstOrDefault()).ToList();

            TimeSheetJson tsjPresHours = new TimeSheetJson();
            tsjPresHours.UID = Guid.NewGuid();
            tsjPresHours.id = timeSheetID++;
            tsjPresHours.parentId = null;
            tsjPresHours.Title = "حضور";
            tsjPresHours.Values = new List<TimeSheetValueJson>();


            List<TimeSheetJson> tsjWorkHours = new List<TimeSheetJson>();
            var PrentWorkHour = new TimeSheetJson();
            PrentWorkHour.UID = Guid.NewGuid();
            PrentWorkHour.id = timeSheetID++;
            PrentWorkHour.parentId = null;
            PrentWorkHour.Title = "کارکرد";
            PrentWorkHour.Values = new List<TimeSheetValueJson>();
            tsjWorkHours.Add(PrentWorkHour);

          

            foreach (var item in groupingProjects)
            {
                var ProjectChild = new TimeSheetJson();
                ProjectChild.Type = "Project";
                var timesheetIdwork = timeSheetID;
                ProjectChild.UID = item.ProjectId;
                ProjectChild.id = timeSheetID++;
                ProjectChild.parentId = 2;
                ProjectChild.Title = item.Project.Title;
                ProjectChild.Values = new List<TimeSheetValueJson>();
                tsjWorkHours.Add(ProjectChild);


                foreach (var w in groupingTasks)
                {
                    if (item.ProjectId == w.ProjectId)
                    {
                        var TaskChilde = new TimeSheetJson();
                        TaskChilde.Type = "Task";
                        TaskChilde.UID = w.TaskID;
                        TaskChilde.id = timeSheetID++;
                        TaskChilde.parentId = timesheetIdwork;
                        TaskChilde.Title = w.Task.Title;
                        TaskChilde.Values = new List<TimeSheetValueJson>();
                        tsjWorkHours.Add(TaskChilde);
                    }
                }

            }

            TimeSheetJson tsjDiffPH_WH = new TimeSheetJson();
            tsjDiffPH_WH.UID = Guid.NewGuid();
            tsjDiffPH_WH.id = timeSheetID++;
            tsjDiffPH_WH.parentId = null;
            tsjDiffPH_WH.Title = "اختلاف حضور و کارکرد";
            tsjDiffPH_WH.Values = new List<TimeSheetValueJson>();
            tsjDiffPH_WH.Type = "Defference";

            List<TimeSheetJson> approveWHs = new List<TimeSheetJson>();

            var approvechiled = new TimeSheetJson();
            approvechiled.UID = Guid.NewGuid();
            var timesheetIdapproveproject = timeSheetID;
            approvechiled.id = timeSheetID++;
            approvechiled.parentId = null;
            approvechiled.Title = "تایید شده";
            approvechiled.Values = new List<TimeSheetValueJson>();
            approvechiled.Type = "Approve";
            approveWHs.Add(approvechiled);



            foreach (var projectApprove in groupingProjectsApprove)
            {
                var timesheetIdapproveaskt = timeSheetID;
                var counter = 0;
                foreach (var worktask in groupingTasksApprove)
                {
                    if (timesheetMnager.ApprovementStatus(worktask,new UserHelper().GetCurrent().UserName) == "Approve" &&
                        projectApprove.ProjectId == worktask.ProjectId)
                    {
                        if (counter == 0)
                        {
                            var ProjectChildapprove = new TimeSheetJson();
                            ProjectChildapprove.Type = "ProjectApprove";
                            ProjectChildapprove.UID = projectApprove.ProjectId;
                            ProjectChildapprove.id = timeSheetID++;
                            ProjectChildapprove.parentId = timesheetIdapproveproject;
                            ProjectChildapprove.Title = projectApprove.Project.Title;
                            ProjectChildapprove.Values = new List<TimeSheetValueJson>();
                            approveWHs.Add(ProjectChildapprove);
                        }
                        counter++;
                        var approveChildetask = new TimeSheetJson();
                        approveChildetask.Type = "TaskApprove";
                        approveChildetask.UID = worktask.TaskID;
                        approveChildetask.id = timeSheetID++;
                        approveChildetask.parentId = timesheetIdapproveaskt;
                        approveChildetask.Title = worktask.Task.Title;
                        approveChildetask.Values = new List<TimeSheetValueJson>();
                        approveWHs.Add(approveChildetask);
                    }
                }


            }

            List<TimeSheetJson> notApproveWHs = new List<TimeSheetJson>();

            var reject = new TimeSheetJson();
            reject.UID = Guid.NewGuid();
            var timesheetIdNotapproveproject = timeSheetID;
            reject.id = timeSheetID++;
            reject.parentId = null;
            reject.Title = "تایید نشده";
            reject.Values = new List<TimeSheetValueJson>();
            reject.Type = "Reject";
            notApproveWHs.Add(reject);


            foreach (var item in groupingProjectsNotApprove)
            {
                var counter = 0;
                var timesheetIdapproveaskt = timeSheetID;
                foreach (var w in groupingTasksNotApprove)
                {
                    if (timesheetMnager.ApprovementStatus(w, new UserHelper().GetCurrent().UserName) == "NotApprove"
                   
                    && item.ProjectId == w.ProjectId)
                    {
                        if (counter == 0)
                        {
                            var ProjectChildNotapprove = new TimeSheetJson();
                            ProjectChildNotapprove.Type = "ProjectNotApprove";
                            ProjectChildNotapprove.UID = item.ProjectId;
                            ProjectChildNotapprove.id = timeSheetID++;
                            ProjectChildNotapprove.parentId = timesheetIdNotapproveproject;
                            ProjectChildNotapprove.Title = item.Project.Title;
                            ProjectChildNotapprove.Values = new List<TimeSheetValueJson>();
                            notApproveWHs.Add(ProjectChildNotapprove);
                        }
                        counter++;
                        var NotapproveChildetask = new TimeSheetJson();
                        NotapproveChildetask.Type = "TaskNotApprove";
                        NotapproveChildetask.UID = w.TaskID;
                        NotapproveChildetask.id = timeSheetID++;
                        NotapproveChildetask.parentId = timesheetIdapproveaskt;
                        NotapproveChildetask.Title = w.Task.Title;
                        NotapproveChildetask.Values = new List<TimeSheetValueJson>();
                        notApproveWHs.Add(NotapproveChildetask);
                    }
                }


            }









            presenceHours.OrderBy(phItem => phItem.Date)
                    .ToList().ForEach(phItem =>
                    {
                        double phHours = phItem.Hours;
                        List<WorkHour> selWorkHour = workHours.Where(whItem => whItem.Date.Equals(phItem.Date)).ToList();
                        double whHours = (selWorkHour != null && selWorkHour.Count >= 0) ? selWorkHour.Sum(x => x.Hours) : 0;

                        List<WorkHour> appWorkHour = approveItems.Where(whItem => whItem.Date.Equals(phItem.Date)).ToList();
                        double apphours = (appWorkHour != null && appWorkHour.Count >= 0) ? appWorkHour.Sum(x => x.Hours) : 0;

                        List<WorkHour> notappWorkHour = notApproveItems.Where(whItem => whItem.Date.Equals(phItem.Date)).ToList();
                        double notapphours = (notappWorkHour != null && notappWorkHour.Count >= 0) ? notappWorkHour.Sum(x => x.Hours) : 0;

                        //Create Columns/Values for Presence Hours
                        TimeSheetValueJson phTSJValue = new TimeSheetValueJson();
                        phTSJValue.Date = phItem.Date;
                        phTSJValue.Day = phItem.Date.DayOfWeek.ToString();
                        phTSJValue.PersianDate = phItem.Date.ToPersianDateString();
                        phTSJValue.PersianDay = phItem.Date.ToPersianDayOfWeek();
                        phTSJValue.Title = phTSJValue.PersianDate + "-" + phTSJValue.PersianDay;
                        phTSJValue.Value = DateUtility.ConvertToTimeSpan(phHours);
                        tsjPresHours.Values.Add(phTSJValue);


                        //Create Columns/Values for Work Hours
                        TimeSheetValueJson whTSJValue = new TimeSheetValueJson();
                        whTSJValue.Date = phItem.Date;
                        whTSJValue.Day = phItem.Date.DayOfWeek.ToString();
                        whTSJValue.PersianDate = phItem.Date.ToPersianDateString();
                        whTSJValue.PersianDay = phItem.Date.ToPersianDayOfWeek();
                        whTSJValue.Title = whTSJValue.PersianDate + "-" + whTSJValue.PersianDay;
                        whTSJValue.Value = DateUtility.ConvertToTimeSpan(whHours);
                        tsjWorkHours[0].Values.Add(whTSJValue);

                        var groupingByDate = workHours.GroupBy(x => x.Date).Select(y => y.FirstOrDefault()).ToList();

                        var co = tsjWorkHours.Count();
                        for (int i = 1; i < co; i++)
                        {
                            TimeSheetValueJson whTSJValue1 = new TimeSheetValueJson();
                            whTSJValue1.Date = phItem.Date;
                            whTSJValue1.Day = phItem.Date.DayOfWeek.ToString();
                            whTSJValue1.PersianDate = phItem.Date.ToPersianDateString();
                            whTSJValue1.PersianDay = phItem.Date.ToPersianDayOfWeek();
                            whTSJValue1.Title = whTSJValue1.PersianDate + "-" + whTSJValue1.PersianDay;
                            whTSJValue1.Value = "  ";
                            tsjWorkHours[i].Values.Add(whTSJValue1);

                            if (tsjWorkHours[i].Type == "Project")
                            {
                                var hourCount = selWorkHour.Where(y => y.ProjectId == tsjWorkHours[i].UID).Sum(x => x.Hours);
                                whTSJValue1.Value = DateUtility.ConvertToTimeSpan(hourCount);
                            }
                            if (tsjWorkHours[i].Type == "Task")
                            {
                                var hourCount = selWorkHour.Where(y => y.TaskID == tsjWorkHours[i].UID).Sum(x => x.Hours);
                                whTSJValue1.Value = DateUtility.ConvertToTimeSpan(hourCount);
                            }

                        }

                        

                        //Create Row for Different between Presence Hour And Work Hour
                        TimeSheetValueJson diffPH_WHTSJValue = new TimeSheetValueJson();
                        diffPH_WHTSJValue.Date = phItem.Date;
                        diffPH_WHTSJValue.Day = phItem.Date.DayOfWeek.ToString();
                        diffPH_WHTSJValue.PersianDate = phItem.Date.ToPersianDateString();
                        diffPH_WHTSJValue.PersianDay = phItem.Date.ToPersianDayOfWeek();
                        diffPH_WHTSJValue.Title = diffPH_WHTSJValue.PersianDate + "-" + diffPH_WHTSJValue.PersianDay;
                        diffPH_WHTSJValue.Value = DateUtility.ConvertToTimeSpan(Math.Abs(phHours - whHours));
                        tsjDiffPH_WH.Values.Add(diffPH_WHTSJValue);




                        //Create Columns/Values for Approve
                        TimeSheetValueJson appTSJValue = new TimeSheetValueJson();
                        appTSJValue.Date = phItem.Date;
                        appTSJValue.Day = phItem.Date.DayOfWeek.ToString();
                        appTSJValue.PersianDate = phItem.Date.ToPersianDateString();
                        appTSJValue.PersianDay = phItem.Date.ToPersianDayOfWeek();
                        appTSJValue.Title = appTSJValue.PersianDate + "-" + appTSJValue.PersianDay;
                        appTSJValue.Value = DateUtility.ConvertToTimeSpan(apphours);
                        approveWHs[0].Values.Add(appTSJValue);


                        for (int i = 1; i < approveWHs.Count(); i++)
                        {
                            TimeSheetValueJson whTSJValue1 = new TimeSheetValueJson();
                            whTSJValue1.Date = phItem.Date;
                            whTSJValue1.Day = phItem.Date.DayOfWeek.ToString();
                            whTSJValue1.PersianDate = phItem.Date.ToPersianDateString();
                            whTSJValue1.PersianDay = phItem.Date.ToPersianDayOfWeek();
                            whTSJValue1.Title = whTSJValue1.PersianDate + "-" + whTSJValue1.PersianDay;
                            whTSJValue1.Value = "  ";
                            approveWHs[i].Values.Add(whTSJValue1);

                            if (approveWHs[i].Type == "ProjectApprove")
                            {
                                var hourCount = appWorkHour.Where(y => y.ProjectId == approveWHs[i].UID).Sum(x => x.Hours);
                                whTSJValue1.Value = DateUtility.ConvertToTimeSpan(hourCount);
                            }
                            if (approveWHs[i].Type == "TaskApprove")
                            {
                                var hourCount = appWorkHour.Where(y => y.TaskID == approveWHs[i].UID).Sum(x => x.Hours);
                                whTSJValue1.Value = DateUtility.ConvertToTimeSpan(hourCount);
                            }

                        }
                        



                        //Create Columns/Values for NotApprove
                        TimeSheetValueJson notappTSJValue = new TimeSheetValueJson();
                        notappTSJValue.Date = phItem.Date;
                        notappTSJValue.Day = phItem.Date.DayOfWeek.ToString();
                        notappTSJValue.PersianDate = phItem.Date.ToPersianDateString();
                        notappTSJValue.PersianDay = phItem.Date.ToPersianDayOfWeek();
                        notappTSJValue.Title = notappTSJValue.PersianDate + "-" + notappTSJValue.PersianDay;
                        notappTSJValue.Value = DateUtility.ConvertToTimeSpan(notapphours);
                        notApproveWHs[0].Values.Add(notappTSJValue);

                        for (int i = 1; i < notApproveWHs.Count(); i++)
                        {
                            TimeSheetValueJson whTSJValue1 = new TimeSheetValueJson();
                            whTSJValue1.Date = phItem.Date;
                            whTSJValue1.Day = phItem.Date.DayOfWeek.ToString();
                            whTSJValue1.PersianDate = phItem.Date.ToPersianDateString();
                            whTSJValue1.PersianDay = phItem.Date.ToPersianDayOfWeek();
                            whTSJValue1.Title = whTSJValue1.PersianDate + "-" + whTSJValue1.PersianDay;
                            whTSJValue1.Value = "  ";
                            notApproveWHs[i].Values.Add(whTSJValue1);

                            if (notApproveWHs[i].Type == "ProjectNotApprove")
                            {
                                var hourCount = notappWorkHour.Where(y => y.ProjectId == notApproveWHs[i].UID).Sum(x => x.Hours);
                                whTSJValue1.Value = DateUtility.ConvertToTimeSpan(hourCount);
                            }
                            if (notApproveWHs[i].Type == "TaskNotApprove")
                            {
                                var hourCount = notappWorkHour.Where(y => y.TaskID == notApproveWHs[i].UID).Sum(x => x.Hours);
                                whTSJValue1.Value = DateUtility.ConvertToTimeSpan(hourCount);
                            }

                        }
                        
                    });


            result.Add(tsjPresHours);
            foreach (var item in tsjWorkHours)
            {
                result.Add(item);
            }
            result.Add(tsjDiffPH_WH);
            foreach (var approve in approveWHs)
            {
                result.Add(approve);
            }
            foreach (var notapprove in notApproveWHs)
            {
                result.Add(notapprove);
            }
            return result;
        }

    }
}