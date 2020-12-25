using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using KP.TimeSheets.Domain;
using KP.TimeSheets.Persistance;
using KP.TimeSheets.MVC;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace KP.TimeSheets.MVC.Controllers
{
    public class HourlyMissionsController : BaseController
    {
       public HourlyMissionsController(IUnitOfWork uow) : base(uow) { }

        // GET: HourlyMissions
        public ActionResult Index()
        {
            HourlyMissionManager hm = new HourlyMissionManager(UOW);
            var HourlyMissions = hm.GetAllByUserID(this.CurrentUser.ID);
            return View(new HourlyMissionAssembler().ToJsons(HourlyMissions.ToList()));
        }

        // GET: HourlyMissions/Details/5
        public ActionResult Details(Guid id)
        {
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی ماموریت ارسال نشده است");
            }
            HourlyMissionManager hm = new HourlyMissionManager(UOW);
            HourlyMission HourlyMission = hm.GetByID(id);
            if (HourlyMission == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"ماموریت با آی دی ارسال شده یافت نشد");
            }
            return View(new HourlyMissionAssembler().ToJson(HourlyMission));
        }

        // GET: HourlyMissions/Create
        public ActionResult Create()
        {
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            ViewBag.ProjectID = new SelectList(pm.GetByUser(this.CurrentUser), "ID", "Title");
            return View();
        }

        // POST: HourlyMissions/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(HourlyMission hourlyMission)
        {
            HourlyMissionManager hm = new HourlyMissionManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            hourlyMission.UserID = this.CurrentUser.ID;
            hourlyMission.OrganisationId = this.CurrentUser.OrganizationUnitID;

            var firstError = ModelState.Values.SelectMany(v => v.Errors).ToList();

            if (ModelState.IsValid)
            {
                hm.Add(hourlyMission);
                return RedirectToAction("Index");
            }

            ViewBag.ProjectID = new SelectList(pm.GetByUser(this.CurrentUser), "ID", "Title");

            return View(hourlyMission);
        }

        // GET: HourlyMissions/Edit/5
        public ActionResult Edit(Guid id)
        {
            HourlyMissionManager hm = new HourlyMissionManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی ماموریت ارسال نشده است");
            }
            HourlyMission hourlyMission = hm.GetByID(id);
            if (hourlyMission == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"ماموریت با آی دی ارسال شده یافت نشد");
            }
            ViewBag.ProjectID = new SelectList(pm.GetByUser(this.CurrentUser), "ID", "Title");
            return View(hourlyMission);
        }

        // POST: HourlyMissions/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(HourlyMission hourlyMission)
        {
            HourlyMissionManager hm = new HourlyMissionManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (ModelState.IsValid)
            {
                hm.Edit(hourlyMission);

                return RedirectToAction("Index");
            }
            ViewBag.ProjectID = new SelectList(pm.GetByUser(this.CurrentUser), "ID", "Title");
            ViewBag.SuccessorID = new SelectList(um.GetAll(), "ID", "UserTitle");
            return View(hourlyMission);
        }

        // GET: HourlyMissions/Delete/5
        public ActionResult Delete(Guid id)
        {
            HourlyMissionManager hm = new HourlyMissionManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی ماموریت ارسال نشده است");
            }
            HourlyMission hourlyMission = hm.GetByID(id);
            if (hourlyMission == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"ماموریت با آی دی ارسال شده یافت نشد");
            }
            return View(new HourlyMissionAssembler().ToJson(hourlyMission));
        }

        // POST: HourlyMissions/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(Guid id)
        {
            HourlyMissionManager hm = new HourlyMissionManager(UOW);
            hm.DeleteByID(id);
            return RedirectToAction("Index");
        }




        // GET: DailyMissions/ApproveIndex/5
        public ActionResult ApproveIndex()
        {
            HourlyMissionManager dlm = new HourlyMissionManager(UOW);
            var hourlyMissions = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order == 3);
            return View(new HourlyMissionAssembler().ToJsons(hourlyMissions.ToList()));
        }

        public ActionResult Approve(Guid id)
        {
            HourlyMissionManager dlm = new HourlyMissionManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی ماموریت ارسال نشده است");
            }
            HourlyMission hourlyMission = dlm.GetByID(id);
            if (hourlyMission == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"ماموریت با آی دی ارسال شده یافت نشد");
            }
            return View(new HourlyMissionAssembler().ToJson(hourlyMission));
        }

        // POST: DailyMissions/Delete/5
        [HttpPost, ActionName("Approve")]
        [ValidateAntiForgeryToken]
        public ActionResult ApproveConfirmed(Guid id)
        {
            HourlyMissionManager dlm = new HourlyMissionManager(UOW);
            var result = dlm.GetByID(id);
            dlm.Approve(result);
            UOW.SaveChanges();

            return RedirectToAction("ApproveIndex", new { ac = "Approve" });
        }

        // POST: DailyMissions/Approve/5
        public ActionResult Deny(Guid id)
        {

            HourlyMissionManager dlm = new HourlyMissionManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی ماموریت ارسال نشده است");
            }
            HourlyMission hourlyMission = dlm.GetByID(id);
            if (hourlyMission == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"ماموریت با آی دی ارسال شده یافت نشد");
            }
            return View(new HourlyMissionAssembler().ToJson(hourlyMission));
        }

        // POST: DailyMissions/Delete/5
        [HttpPost, ActionName("Deny")]
        [ValidateAntiForgeryToken]
        public ActionResult DenyConfirmed(Guid id)
        {
            HourlyMissionManager dlm = new HourlyMissionManager(UOW);
            var result = dlm.GetByID(id);
            dlm.Deny(result);
            UOW.SaveChanges();
            return RedirectToAction("ApproveIndex", new { ac = "Deny" });
        }

        public ActionResult DenyAll()
        {
            HourlyMissionManager dlm = new HourlyMissionManager(UOW);
            var hourlyMissions = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order == 3);
            foreach (var Mission in hourlyMissions)
            {
                dlm.Deny(Mission);
            }
            UOW.SaveChanges();
            return RedirectToAction("ApproveIndex", new { ac = "DenyAll" });
        }

        public ActionResult ApproveAll()
        {
            HourlyMissionManager dlm = new HourlyMissionManager(UOW);
            var hourlyMissions = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order == 3 );
            foreach (var Mission in hourlyMissions)
            {
                dlm.Approve(Mission);
            }
            UOW.SaveChanges();
            return RedirectToAction("ApproveIndex", new { ac = "ApproveAll" });
        }




        public ActionResult ShowDenied()
        {
            HourlyMissionManager dlm = new HourlyMissionManager(UOW);
            var HourlyMissions = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order == 1);
            return View(new HourlyMissionAssembler().ToJsons(HourlyMissions.ToList()));
        }

        public ActionResult ShowApproves()
        {
            HourlyMissionManager dlm = new HourlyMissionManager(UOW);
            var HourlyMissions = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order == 4);
            return View(new HourlyMissionAssembler().ToJsons(HourlyMissions.ToList()));
        }

        public ActionResult Resend(Guid id)
        {
            HourlyMissionManager dlm = new HourlyMissionManager(UOW);
            var HourlyMission = dlm.GetByID(id);
            dlm.Resend(HourlyMission);
            UOW.SaveChanges();
            return RedirectToAction("ShowDenied", new { ac = "Resend" });
        }

    }
}
