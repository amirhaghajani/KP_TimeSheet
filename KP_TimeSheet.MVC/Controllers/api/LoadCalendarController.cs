using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using KP.TimeSheets.Persistance;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace KP.TimeSheets.MVC
{

[Route("api/[controller]")]
    [ApiController]

    public class LoadCalendarController : MyBaseAPIController
    {
        IUnitOfWork _uow;
        public LoadCalendarController(IUnitOfWork uow, RASContext db) : base(db)
        {
            this._uow = uow;
        }


        [HttpGet("[action]")]
        public IEnumerable<CalendarJson> GetCalendarItems()
        {
            var manager = new CalendarManager(this._uow);
            var calenders = manager.GetAll();
            var result = CalendarAssembler.ToJsons(calenders, this._uow);
            return result;
        }


        [HttpGet("[action]")]
        public IEnumerable<UserJson> GetAllUsers()
        {
            var manager = new UserManager(this._uow);
            var Users = manager.GetAll();
            var result = new UserAssembler().ToJsons(Users);
            return result;
        }

        [HttpGet("[action]")]
        public string DeleteCalendarItem(Guid calendarID)
        {
            var manager = new CalendarManager(this._uow);
            manager.Remove(calendarID);
            return "آیتم انتخاب شده با موفقیت حذف شد";
        }

        [HttpGet("[action]")]
        public CalendarJson BuildCalendar()
        {
            var manager = new CalendarManager(this._uow);
            var calender = manager.BuildCalendar();
  
            var json=CalendarAssembler.ToJson(calender, this._uow);
            return json;

            
        }

        [HttpPost("[action]")]
        public string SaveCalendar(CalendarJson json)
        {
            var manager = new CalendarManager(this._uow);
            var calendar = CalendarAssembler.ToCalender(json);
            manager.SaveCalendar(calendar);
            return "بروزرسانی با موفقیت انجام شد.";
        }

        [HttpPost("[action]")]
        public string AssignCalendarAndManager(AssignManagerAndCalendarToProjectJson json)
        {
            var manager = new ProjectManager(this._uow);
            var project = manager.GetByID(Guid.Parse(json.ProjectId));
            project.CalendarID = Guid.Parse(json.CalendarId);
            project.OwnerID = Guid.Parse(json.UserId);
            manager.Save(project);
            return "بروزرسانی با موفقیت انجام شد.";
        }
    }
}
