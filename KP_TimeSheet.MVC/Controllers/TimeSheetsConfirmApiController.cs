

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using KP.TimeSheets.Domain;
using KP.TimeSheets.MVC.ViewModels;
using KP.TimeSheets.Persistance;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace KP.TimeSheets.MVC
{
    [Microsoft.AspNetCore.Mvc.Route("api/Confirm")]
    [ApiController]
    public class TimeSheetsConfirmApiController : MyBaseController
    {
        IUnitOfWork _uow;
        public TimeSheetsConfirmApiController(RASContext db, IUnitOfWork uow) : base(db) { this._uow = uow; }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(List<vmGetTimeSheetResualt>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetTimeSheet(Guid id)
        {
            try
            {
                DisplayPeriodManager displayPeriodMnager = new DisplayPeriodManager(this._uow);
                User currentUser = new UserHelper().GetCurrent(this._uow);
                DisplayPeriod displayPeriod = displayPeriodMnager.GetDisplayPeriod(currentUser);

                DateTime fromDate = DateTime.Now.AddDays(-7);
                DateTime toDate = DateTime.Now;

                if (displayPeriod.IsWeekly)
                {
                    fromDate = DateTime.Today.StartOfWeek(DayOfWeek.Saturday);
                    toDate = DateTime.Today.EndOfWeek(DayOfWeek.Friday);
                }
                else
                {
                    toDate = fromDate.AddDays(displayPeriod.NumOfDays);
                }

                var query = this.DBContext.spFoundConfirmTimeSheet.FromSqlInterpolated(this.DBContext.spFoundConfirmTimeSheet_str(
                    currentUser.ID,
                    id,
                    fromDate,
                    toDate
                ));
                var items = await query.ToListAsync();

                var answer = items.GroupBy(g => g.Date)
                .Select(gg => new vmGetTimeSheetResualt
                {
                    date = gg.Key,
                    date_persian = gg.First().PersianDate,
                    hozoor = 10,
                    projects = gg.Where(p => p.ProjectId.HasValue).GroupBy(p => p.ProjectId).Select(pp => new vmGetTimeSheetResualt_Project
                    {
                        id = pp.Key,
                        title = pp.First().ProjectTitle,
                        workouts = pp.Where(w => w.WorkoutId.HasValue).GroupBy(w => w.WorkoutId).Select(ww => new vmGetTimeSheetResualt_Workout
                        {
                            id = ww.Key,
                            state = ww.First().State,
                            title = ww.First().Title,
                            hours = ww.First().Hours
                        }).ToList()
                    }).ToList()
                }).ToList();

                return Ok(answer);
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در ثبت اطلاعات اقدام");
            }
        }

    }


}