using KP.TimeSheets.Domain;
using KP.TimeSheets.Persistance;
using System;
using System.Collections.Generic;
using System.Linq;


namespace KP.TimeSheets.MVC
{
    public class ReportAssembler
    {

        //Assemble Bounch of projects
        public FinalReport AssembleBreakingProjectsByMonth(ReportParametersFromToJson parametres,IUnitOfWork uow)
        {
            var result = new FinalReport();

            var currentUser = new UserHelper().GetCurrent(uow);
            TimeSheetManager TimeSheetManager = new TimeSheetManager(uow);
            var workHours = TimeSheetManager.GetWorkHoursByUser
                (currentUser, DateUtility.GetMiladiDate(parametres.FromDate), DateUtility.GetMiladiDate(parametres.ToDate)).ToList();


            var from = DateUtility.GetMiladiDate(parametres.FromDate);
            var to = DateUtility.GetMiladiDate(parametres.ToDate);
            var currentDate = from;

            foreach (var group in workHours.GroupBy(x => x.ProjectId))
            {
                var row = new ReportRow();
                row.ID = group.First().ProjectId;
                row.Title = group.First().Project.Title;
                result.Rowes.Add(row);
            }

            var SumTotal = new ReportRow();
            SumTotal.ID = Guid.NewGuid();
            SumTotal.Title = "جمع کل کارکرد";
            result.Rowes.Add(SumTotal);
            var sumPresenceHours = new ReportRow();
            sumPresenceHours.ID = Guid.NewGuid();
            sumPresenceHours.Title = "جمع کل حضور";
            result.Rowes.Add(sumPresenceHours);
            var sumDifference = new ReportRow();
            sumDifference.ID = Guid.NewGuid();
            sumDifference.Title = "اختلاف";
            result.Rowes.Add(sumDifference);


            while (currentDate.Date <= to)
            {
                var firstDayOfMonth = DateUtility.GetMiladiDate(DateUtility.GetPersianYear(currentDate) + "/" + DateUtility.GetPersianMonth(currentDate) + "/" + "1");
                var day = "30";
                if (DateUtility.GetPersianMonth(currentDate) < 7)
                    day = "31";
                var LastDayOfMonth = DateUtility.GetMiladiDate(DateUtility.GetPersianYear(currentDate) + "/" + DateUtility.GetPersianMonth(currentDate) + "/" + day);
                var field = new Field();
                field.ID = Guid.NewGuid();
                field.Title = DateUtility.GetPersianYear(currentDate) + "/" + DateUtility.GetPersianMonth(currentDate);
                result.Fields.Add(field);
                double workhours = 0;
                double presencehours = 0;

                foreach (var row in result.Rowes)
                {
                    if (row.Title == "جمع کل کارکرد")
                    {
                        var sumWorkHour = workHours.Where(x => x.Date.Date <= LastDayOfMonth && x.Date.Date >= firstDayOfMonth).Sum(x => x.Hours);
                        workhours = sumWorkHour;
                        var fieldValuesumWorkHour = new FieldValue();
                        fieldValuesumWorkHour.FieldId = field.ID;
                        fieldValuesumWorkHour.RowId = row.ID;
                        fieldValuesumWorkHour.Value = DateUtility.ConvertToTimeSpan(sumWorkHour);
                        row.Values.Add(fieldValuesumWorkHour);

                    }
                    else if (row.Title == "جمع کل حضور")
                    {
                        var sumPresenceHour = TimeSheetManager.GetPresHoursByUser(currentUser, firstDayOfMonth, LastDayOfMonth).Sum(x => x.Hours);
                        presencehours = sumPresenceHour;
                        var fieldValuesumPresenceHour = new FieldValue();
                        fieldValuesumPresenceHour.FieldId = field.ID;
                        fieldValuesumPresenceHour.RowId = row.ID;
                        fieldValuesumPresenceHour.Value = DateUtility.ConvertToTimeSpan(sumPresenceHour);
                        row.Values.Add(fieldValuesumPresenceHour);
                    }
                    else if (row.Title == "اختلاف")
                    {
                        var sumdifference = presencehours - workhours; ;

                        var fieldValuesumdifference = new FieldValue();
                        fieldValuesumdifference.FieldId = field.ID;
                        fieldValuesumdifference.RowId = row.ID;
                        fieldValuesumdifference.Value = DateUtility.ConvertToTimeSpan(sumdifference);
                        row.Values.Add(fieldValuesumdifference);
                    }
                    else
                    {
                        var value = workHours.Where(x => x.ProjectId == row.ID && x.Date.Date <= LastDayOfMonth && x.Date.Date >= firstDayOfMonth).Sum(x => x.Hours);
                        var fieldValue = new FieldValue();
                        fieldValue.FieldId = field.ID;
                        fieldValue.RowId = row.ID;
                        fieldValue.Value = DateUtility.ConvertToTimeSpan(value);
                        row.Values.Add(fieldValue);
                    }



                }



                currentDate = LastDayOfMonth.AddDays(1).Date;
            }
            var Aggregation = new Field();
            Aggregation.Title = "مجموع";
            Aggregation.ID = Guid.NewGuid();
            result.Fields.Add(Aggregation);

            foreach (var row in result.Rowes)
            {
                var sum = workHours.Where(x => x.ProjectId == row.ID).Sum(y => y.Hours);
                var fildvalue = new FieldValue();
                fildvalue.FieldId = Guid.NewGuid();
                fildvalue.RowId = row.ID;
                fildvalue.Value = DateUtility.ConvertToTimeSpan(sum);
                row.Values.Add(fildvalue);
            }



            result.HeaderTitle = "گزارش پروژه ها به تفکیک ماه";
            result.FirstColumnTitle = "عنوان پروژه";
            return result;
        }

        //Assemble single project
        public FinalReport AssembleBreakingProjectByMonth(ReportParametrsFromToProjectIdJson parametres,IUnitOfWork uow)
        {
            var result = new FinalReport();

            var currentUser = new UserHelper().GetCurrent(uow);
            TimeSheetManager TimeSheetManager = new TimeSheetManager(uow);


            var from = DateUtility.GetMiladiDate(parametres.FromDate);
            var to = DateUtility.GetMiladiDate(parametres.ToDate);
            var currentDate = from;
            var workHours = TimeSheetManager.GetByProjectID
              (parametres.ProjectId, from, to).ToList();

            if (workHours.Count() > 0)
            {
                foreach (var group in workHours.GroupBy(x => x.TaskID))
                {
                    var row = new ReportRow();
                    row.ID = group.First().TaskID;
                    row.Title = group.First().Task.Title;
                    result.Rowes.Add(row);
                }
            }

            var SumTotal = new ReportRow();
            SumTotal.ID = Guid.NewGuid();
            SumTotal.Title = "جمع کل";
            result.Rowes.Add(SumTotal);


            while (currentDate.Date <= to)
            {
                var firstDayOfMonth = DateUtility.GetMiladiDate(DateUtility.GetPersianYear(currentDate) + "/" + DateUtility.GetPersianMonth(currentDate) + "/" + "1");
                var day = "30";
                if (DateUtility.GetPersianMonth(currentDate) < 7)
                    day = "31";
                var LastDayOfMonth = DateUtility.GetMiladiDate(DateUtility.GetPersianYear(currentDate) + "/" + DateUtility.GetPersianMonth(currentDate) + "/" + day);
                var field = new Field();
                field.ID = Guid.NewGuid();
                field.Title = DateUtility.GetPersianYear(currentDate) + "/" + DateUtility.GetPersianMonth(currentDate);
                result.Fields.Add(field);
                double workhours = 0;


                foreach (var row in result.Rowes)
                {
                    if (row.Title == "جمع کل")
                    {
                        var sumWorkHour = workHours.Where(x => x.Date.Date <= LastDayOfMonth && x.Date.Date >= firstDayOfMonth).Sum(x => x.Hours);
                        workhours = sumWorkHour;
                        var fieldValuesumWorkHour = new FieldValue();
                        fieldValuesumWorkHour.FieldId = field.ID;
                        fieldValuesumWorkHour.RowId = row.ID;
                        fieldValuesumWorkHour.Value = DateUtility.ConvertToTimeSpan(sumWorkHour);
                        row.Values.Add(fieldValuesumWorkHour);

                    }

                    else
                    {
                        var value = workHours.Where(x => x.TaskID == row.ID && x.Date.Date <= LastDayOfMonth && x.Date.Date >= firstDayOfMonth).Sum(x => x.Hours);
                        var fieldValue = new FieldValue();
                        fieldValue.FieldId = field.ID;
                        fieldValue.RowId = row.ID;
                        fieldValue.Value = DateUtility.ConvertToTimeSpan(value);
                        row.Values.Add(fieldValue);
                    }
                }

                currentDate = LastDayOfMonth.AddDays(1).Date;
            }
            var Aggregation = new Field();
            Aggregation.Title = "جمع کل";
            Aggregation.ID = Guid.NewGuid();
            result.Fields.Add(Aggregation);
            double Alltotalsum = 0;
            foreach (var row in result.Rowes)
            {
                var sum = workHours.Where(x => x.TaskID == row.ID).Sum(y => y.Hours);
                var fieldvalue = new FieldValue();
                fieldvalue.CalculativeValue = sum;
                fieldvalue.FieldId = Guid.NewGuid();
                fieldvalue.RowId = row.ID;
                fieldvalue.Value = DateUtility.ConvertToTimeSpan(sum);
                row.Values.Add(fieldvalue);
                Alltotalsum += sum;
            }


            result.Rowes[result.Rowes.Count() - 1].Values[result.Rowes[result.Rowes.Count() - 1].
                Values.Count() - 1].Value = DateUtility.ConvertToTimeSpan(Alltotalsum);



            result.HeaderTitle = "گزارش یک  پروژه به تفکیک ماه";
            result.FirstColumnTitle = "عنوان وظیفه";
            return result;
        }

        public FinalReport AssemblePersonnelsAndProjects(ReportParametersJson parametres,IUnitOfWork uow)
        {
            var result = new FinalReport();

            var currentUser = new UserHelper().GetCurrent(uow);
            TimeSheetManager TimeSheetManager = new TimeSheetManager(uow);
            UserManager userManager = new UserManager(uow);
            DateTime from = DateUtility.GetMiladiDate(parametres.FromDate);
            DateTime to = DateUtility.GetMiladiDate(parametres.ToDate);

            var workHours = TimeSheetManager.GetByUserIdsAndProjectIds(parametres.UserIds, parametres.ProjetIds, from, to);




            //سطر ها


            foreach (var group in workHours.GroupBy(x => x.EmployeeID))
            {
                var row = new ReportRow();
                row.ID = group.First().EmployeeID;
                row.Title = group.First().Employee.UserTitle;
                result.Rowes.Add(row);
            }

            var SumTotal = new ReportRow();
            SumTotal.ID = Guid.NewGuid();
            SumTotal.Title = "جمع کل";
            result.Rowes.Add(SumTotal);


            //ستون ها

            foreach (var wh in workHours.GroupBy(x => x.ProjectId).Select(y => y.FirstOrDefault()).ToList())
            {
                var field = new Field();
                field.ID = wh.ProjectId;
                field.Title = wh.Project.Title;
                result.Fields.Add(field);

                foreach (var row in result.Rowes)
                {
                    if (row.Title == "جمع کل")
                    {
                        var sumWorkHour = workHours.Where(x => x.ProjectId == wh.ProjectId).Sum(x => x.Hours);
                        var fieldValuesumWorkHour = new FieldValue();
                        fieldValuesumWorkHour.CalculativeValue = sumWorkHour;
                        fieldValuesumWorkHour.FieldId = field.ID;
                        fieldValuesumWorkHour.RowId = row.ID;
                        fieldValuesumWorkHour.Value = DateUtility.ConvertToTimeSpan(sumWorkHour);
                        row.Values.Add(fieldValuesumWorkHour);
                    }
                    else
                    {
                        var sumWorkHour = workHours.Where(x => x.EmployeeID == row.ID && x.ProjectId == wh.ProjectId).Sum(x => x.Hours);
                        var fieldValuesumWorkHour = new FieldValue();
                        fieldValuesumWorkHour.CalculativeValue = sumWorkHour;
                        fieldValuesumWorkHour.FieldId = field.ID;
                        fieldValuesumWorkHour.RowId = row.ID;
                        fieldValuesumWorkHour.Value = DateUtility.ConvertToTimeSpan(sumWorkHour);
                        row.Values.Add(fieldValuesumWorkHour);
                    }

                }

            }

            var Aggregation = new Field();
            Aggregation.Title = "جمع کل";
            Aggregation.ID = Guid.NewGuid();
            result.Fields.Add(Aggregation);

            var PresenceTotal = new Field();
            PresenceTotal.Title = "جمع حضور";
            PresenceTotal.ID = Guid.NewGuid();
            result.Fields.Add(PresenceTotal);

            var DifferenceTotal = new Field();
            DifferenceTotal.Title = "جمع اختلاف";
            DifferenceTotal.ID = Guid.NewGuid();
            result.Fields.Add(DifferenceTotal);

            foreach (var row in result.Rowes)
            {
                //توسعه
                var sumworkHour = row.Values.Sum(y => y.CalculativeValue);
                var fildvalueWork = new FieldValue();
                fildvalueWork.FieldId = Guid.NewGuid();
                fildvalueWork.RowId = row.ID;
                fildvalueWork.Value = DateUtility.ConvertToTimeSpan(sumworkHour);
                row.Values.Add(fildvalueWork);

                if (userManager.GetByID(row.ID) != null)
                {
                    var user = userManager.GetByID(row.ID);
                    var sumPresenceHour = TimeSheetManager.GetPresHoursByUser(user, from, to).ToList().Sum(x => x.Hours);
                    var fildvaluePresence = new FieldValue();
                    fildvaluePresence.FieldId = Guid.NewGuid();
                    fildvaluePresence.RowId = row.ID;
                    fildvaluePresence.Value = DateUtility.ConvertToTimeSpan(sumPresenceHour);
                    row.Values.Add(fildvaluePresence);
                    var fildvalueDifference = new FieldValue();
                    fildvalueDifference.FieldId = Guid.NewGuid();
                    fildvalueDifference.RowId = row.ID;
                    fildvalueDifference.Value = DateUtility.ConvertToTimeSpan(sumPresenceHour - sumworkHour);
                    row.Values.Add(fildvalueDifference);
                }
                else
                {
                    double sumPresenceHourTotal = 0;
                    foreach (var userIds in parametres.UserIds)
                    {
                        var user = userManager.GetByID(userIds);
                        sumPresenceHourTotal += TimeSheetManager.GetPresHoursByUser(user, from, to).ToList().Sum(x => x.Hours);
                    }

                    var fildvaluePresenceTotal = new FieldValue();
                    fildvaluePresenceTotal.FieldId = Guid.NewGuid();
                    fildvaluePresenceTotal.RowId = row.ID;
                    fildvaluePresenceTotal.Value = DateUtility.ConvertToTimeSpan(sumPresenceHourTotal);
                    row.Values.Add(fildvaluePresenceTotal);

                    var fildvalueDifferencTotale = new FieldValue();
                    fildvalueDifferencTotale.FieldId = Guid.NewGuid();
                    fildvalueDifferencTotale.RowId = row.ID;
                    fildvalueDifferencTotale.Value = DateUtility.ConvertToTimeSpan(sumPresenceHourTotal - sumworkHour);
                    row.Values.Add(fildvalueDifferencTotale);


                }

            }



            result.HeaderTitle = "گزارش پروژه ها به تفکیک ماه";
            result.FirstColumnTitle = "نام شخص";
            return result;
        }


        public FinalReport AssembleTotalWorkHoursOnProjects(ReportParametersFromToJson parametres,IUnitOfWork uow)
        {

            var result = new FinalReport();

            var currentUser = new UserHelper().GetCurrent(uow);
            TimeSheetManager TimeSheetManager = new TimeSheetManager(uow);
            var workHours = TimeSheetManager.GetWorkHoursByUser
                (currentUser, DateUtility.GetMiladiDate(parametres.FromDate), DateUtility.GetMiladiDate(parametres.ToDate)).ToList();


            var from = DateUtility.GetMiladiDate(parametres.FromDate);
            var to = DateUtility.GetMiladiDate(parametres.ToDate);
            var currentDate = from;

            foreach (var group in workHours.GroupBy(x => x.ProjectId))
            {
                var row = new ReportRow();
                row.ID = group.First().ProjectId;
                row.Title = group.First().Project.Title;
                result.Rowes.Add(row);
            }

            var SumTotal = new ReportRow();
            SumTotal.ID = Guid.NewGuid();
            SumTotal.Title = "جمع کل";
            result.Rowes.Add(SumTotal);




            var field = new Field();
            field.ID = Guid.NewGuid();
            field.Title = "کارکرد ثبت شده";
            result.Fields.Add(field);
            double workhours = 0;


            foreach (var row in result.Rowes)
            {
                if (row.Title == "جمع کل")
                {
                    var sumWorkHour = workHours.Sum(x => x.Hours);
                    workhours = sumWorkHour;
                    var fieldValuesumWorkHour = new FieldValue();
                    fieldValuesumWorkHour.FieldId = field.ID;
                    fieldValuesumWorkHour.RowId = row.ID;
                    fieldValuesumWorkHour.Value = DateUtility.ConvertToTimeSpan(sumWorkHour);
                    row.Values.Add(fieldValuesumWorkHour);

                }

                else
                {
                    var value = workHours.Where(x => x.ProjectId == row.ID).Sum(x => x.Hours);
                    var fieldValue = new FieldValue();
                    fieldValue.FieldId = field.ID;
                    fieldValue.RowId = row.ID;
                    fieldValue.Value = DateUtility.ConvertToTimeSpan(value);
                    row.Values.Add(fieldValue);
                }



            }







            result.HeaderTitle = "گزارش کلی پروژه ها";
            result.FirstColumnTitle = "عنوان پروژه";
            return result;
        }

        public FinalReport AssembleDailyOnProjects(ReportParametersFromToJson parametres,IUnitOfWork uow)
        {
            var result = new FinalReport();

            var currentUser = new UserHelper().GetCurrent(uow);
            TimeSheetManager TimeSheetManager = new TimeSheetManager(uow);
            var from = DateUtility.GetMiladiDate(parametres.FromDate);
            var to = DateUtility.GetMiladiDate(parametres.ToDate);
            var currentDate = from;

            var workHours = TimeSheetManager.GetWorkHoursByUser(currentUser, from, to);




            //سطر ها


            while (currentDate.Date <= to)
            {
                var row = new ReportRow();
                row.ID = Guid.NewGuid();
                row.Title = DateUtility.GetPersianDate(currentDate);
                result.Rowes.Add(row);
                currentDate = currentDate.AddDays(1).Date;

            }

            var SumTotal = new ReportRow();
            SumTotal.ID = Guid.NewGuid();
            SumTotal.Title = "جمع کل";
            result.Rowes.Add(SumTotal);


            //ستون ها

            foreach (var wh in workHours.GroupBy(x => x.ProjectId).Select(y => y.FirstOrDefault()).ToList())
            {
                var field = new Field();
                field.ID = wh.ProjectId;
                field.Title = wh.Project.Title;
                result.Fields.Add(field);

                foreach (var row in result.Rowes)
                {
                    if (row.Title == "جمع کل")
                    {
                        var sumWorkHour = workHours.Where(x => x.ProjectId == wh.ProjectId).Sum(x => x.Hours);
                        var fieldValuesumWorkHour = new FieldValue();
                        fieldValuesumWorkHour.CalculativeValue = sumWorkHour;
                        fieldValuesumWorkHour.FieldId = field.ID;
                        fieldValuesumWorkHour.RowId = row.ID;
                        fieldValuesumWorkHour.Value = DateUtility.ConvertToTimeSpan(sumWorkHour);
                        row.Values.Add(fieldValuesumWorkHour);
                    }
                    else
                    {
                        var sumWorkHour = workHours.Where(x => x.Date == DateUtility.GetMiladiDate(row.Title) && x.ProjectId == wh.ProjectId).Sum(x => x.Hours);
                        var fieldValuesumWorkHour = new FieldValue();
                        fieldValuesumWorkHour.CalculativeValue = sumWorkHour;
                        fieldValuesumWorkHour.FieldId = field.ID;
                        fieldValuesumWorkHour.RowId = row.ID;
                        fieldValuesumWorkHour.Value = DateUtility.ConvertToTimeSpan(sumWorkHour);
                        row.Values.Add(fieldValuesumWorkHour);
                    }

                }

            }

            var Aggregation = new Field();
            Aggregation.Title = "جمع کارکرد";
            Aggregation.ID = Guid.NewGuid();
            result.Fields.Add(Aggregation);

            var PresenceTotal = new Field();
            PresenceTotal.Title = "جمع حضور";
            PresenceTotal.ID = Guid.NewGuid();
            result.Fields.Add(PresenceTotal);

            var DifferenceTotal = new Field();
            DifferenceTotal.Title = "جمع اختلاف";
            DifferenceTotal.ID = Guid.NewGuid();
            result.Fields.Add(DifferenceTotal);

            foreach (var row in result.Rowes)
            {
                if (row.Title == "جمع کل")
                {

                    var sumworkHourTotal = workHours.Sum(X=>X.Hours);
                    var fildvalueWork = new FieldValue();
                    fildvalueWork.FieldId = Guid.NewGuid();
                    fildvalueWork.RowId = row.ID;
                    fildvalueWork.Value = DateUtility.ConvertToTimeSpan(sumworkHourTotal);
                    row.Values.Add(fildvalueWork);

                    double sumPresenceHourTotal = 0;
                    sumPresenceHourTotal = TimeSheetManager.GetPresHoursByUser(currentUser, from, to).Sum(x=> x.Hours);
                    var fildvaluePresenceTotal = new FieldValue();
                    fildvaluePresenceTotal.FieldId = Guid.NewGuid();
                    fildvaluePresenceTotal.RowId = row.ID;
                    fildvaluePresenceTotal.Value = DateUtility.ConvertToTimeSpan(sumPresenceHourTotal);
                    row.Values.Add(fildvaluePresenceTotal);


                    var fildvalueDifferencTotal = new FieldValue();
                    fildvalueDifferencTotal.FieldId = Guid.NewGuid();
                    fildvalueDifferencTotal.RowId = row.ID;
                    fildvalueDifferencTotal.Value = DateUtility.ConvertToTimeSpan(sumPresenceHourTotal - sumworkHourTotal);
                    row.Values.Add(fildvalueDifferencTotal);

                }
                else
                {
                    var sumworkHour = row.Values.Sum(y => y.CalculativeValue);
                    var fildvalueWork = new FieldValue();
                    fildvalueWork.FieldId = Guid.NewGuid();
                    fildvalueWork.RowId = row.ID;
                    fildvalueWork.Value = DateUtility.ConvertToTimeSpan(sumworkHour);
                    row.Values.Add(fildvalueWork);
                    double sumPresenceHour = 0;

                    sumPresenceHour = TimeSheetManager.GetPresenceHourByUserIdAndDate(currentUser.ID, DateUtility.GetMiladiDate(row.Title)) != null
                    ? TimeSheetManager.GetPresenceHourByUserIdAndDate(currentUser.ID, DateUtility.GetMiladiDate(row.Title)).Hours : 0;

                    var fildvaluePresence = new FieldValue();
                    fildvaluePresence.FieldId = Guid.NewGuid();
                    fildvaluePresence.RowId = row.ID;
                    fildvaluePresence.Value = DateUtility.ConvertToTimeSpan(sumPresenceHour);
                    row.Values.Add(fildvaluePresence);

                    var fildvalueDifferenc = new FieldValue();
                    fildvalueDifferenc.FieldId = Guid.NewGuid();
                    fildvalueDifferenc.RowId = row.ID;
                    fildvalueDifferenc.Value = DateUtility.ConvertToTimeSpan(sumPresenceHour - sumworkHour);
                    row.Values.Add(fildvalueDifferenc);

                }


            }



            result.HeaderTitle = "گزارش روزانه پروژه ها";
            result.FirstColumnTitle = "تاریخ";




            return result;
        }



    }
}