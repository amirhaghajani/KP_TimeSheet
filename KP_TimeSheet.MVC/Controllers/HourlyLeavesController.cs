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

namespace KP_TimeSheet.MVC.Controllers
{
    public class HourlyLeavesController : BaseController
    {
        public HourlyLeavesController(IUnitOfWork uow) : base(uow) { }

        public ActionResult Index()
        {
            HourlyLeaveManager hl = new HourlyLeaveManager(UOW);
            var hourlyLeaves = hl.GetAllByUserID(this.CurrentUser.ID);
            return View(new HourlyLeaveAssembler().ToJsons(hourlyLeaves.ToList()));
        }

        // GET: HourlyLeaves/Details/5
        public ActionResult Details(Guid id)
        {
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی مرخصی ارسال نشده است");
            }
            HourlyLeaveManager hl = new HourlyLeaveManager(UOW);
            HourlyLeave hourlyLeave = hl.GetByID(id);
            if (hourlyLeave == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"مرخصی با آی دی ارسال شده یافت نشد");
            }
            return View(new HourlyLeaveAssembler().ToJson(hourlyLeave));
        }

        // GET: HourlyLeaves/Create
        public ActionResult Create()
        {
           
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            ViewBag.ProjectID = new SelectList(pm.GetByUser(this.CurrentUser), "ID", "Title");
            return View();
        }

        // POST: HourlyLeaves/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(HourlyLeave hourlyLeave)
        {
            HourlyLeaveManager hm = new HourlyLeaveManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            hourlyLeave.UserId = this.CurrentUser.ID;
            hourlyLeave.OrganisationId = this.CurrentUser.OrganizationUnitID;

            var firstError = ModelState.Values.SelectMany(v => v.Errors).ToList();

            if (ModelState.IsValid)
            {
                hm.Add(hourlyLeave);
                return RedirectToAction("Index");
            }

            ViewBag.ProjectID = new SelectList(pm.GetByUser(this.CurrentUser), "ID", "Title");
          
            return View(hourlyLeave);
        }

        // GET: HourlyLeaves/Edit/5
        public ActionResult Edit(Guid id)
        {
            HourlyLeaveManager hm = new HourlyLeaveManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی مرخصی ارسال نشده است");
            }
            HourlyLeave hourlyLeave = hm.GetByID(id);
            if (hourlyLeave == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"مرخصی با آی دی ارسال شده یافت نشد");
            }
            ViewBag.ProjectID = new SelectList(pm.GetByUser(this.CurrentUser), "ID", "Title");
            return View(hourlyLeave);
        }

        // POST: HourlyLeaves/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit( HourlyLeave hourlyLeave)
        {
            HourlyLeaveManager hm = new HourlyLeaveManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (ModelState.IsValid)
            {
                hm.Edit(hourlyLeave);

                return RedirectToAction("Index");
            }
            ViewBag.ProjectID = new SelectList(pm.GetByUser(this.CurrentUser), "ID", "Title");
            ViewBag.SuccessorID = new SelectList(um.GetAll(), "ID", "UserTitle");
            return View(hourlyLeave);
        }

        // GET: HourlyLeaves/Delete/5
        public ActionResult Delete(Guid id)
        {
            HourlyLeaveManager hm = new HourlyLeaveManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی مرخصی ارسال نشده است");
            }
            HourlyLeave hourlyLeave = hm.GetByID(id);
            if (hourlyLeave == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"مرخصی با آی دی ارسال شده یافت نشد");
            }
            return View(new HourlyLeaveAssembler().ToJson(hourlyLeave));
        }

        // POST: HourlyLeaves/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(Guid id)
        {
            HourlyLeaveManager hm = new HourlyLeaveManager(UOW);
            hm.DeleteByID(id);
            return RedirectToAction("Index");
        }



        // GET: DailyLeaves/ApproveIndex/5
        public ActionResult ApproveIndex()
        {
            HourlyLeaveManager dlm = new HourlyLeaveManager(UOW);
            var hourlyLeaves = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order == 3 );
            return View(new HourlyLeaveAssembler().ToJsons(hourlyLeaves.ToList()));
        }

        public ActionResult Approve(Guid id)
        {
            HourlyLeaveManager dlm = new HourlyLeaveManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی مرخصی ارسال نشده است");
            }
            HourlyLeave hourlyLeave = dlm.GetByID(id);
            if (hourlyLeave == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"مرخصی با آی دی ارسال شده یافت نشد");
            }
            return View(new HourlyLeaveAssembler().ToJson(hourlyLeave));
        }

        // POST: DailyLeaves/Delete/5
        [HttpPost, ActionName("Approve")]
        [ValidateAntiForgeryToken]
        public ActionResult ApproveConfirmed(Guid id)
        {
            HourlyLeaveManager dlm = new HourlyLeaveManager(UOW);
            var result = dlm.GetByID(id);
            dlm.Approve(result);
            UOW.SaveChanges();

            return RedirectToAction("ApproveIndex", new { ac = "Approve" });
        }
        
        // POST: DailyLeaves/Approve/5
        public ActionResult Deny(Guid id)
        {
            
            HourlyLeaveManager dlm = new HourlyLeaveManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی مرخصی ارسال نشده است");
            }
            HourlyLeave hourlyLeave = dlm.GetByID(id);
            if (hourlyLeave == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"مرخصی با آی دی ارسال شده یافت نشد");
            }
            return View(new HourlyLeaveAssembler().ToJson(hourlyLeave));
        }

        // POST: DailyLeaves/Delete/5
        [HttpPost, ActionName("Deny")]
        [ValidateAntiForgeryToken]
        public ActionResult DenyConfirmed(Guid id)
        {
            HourlyLeaveManager dlm = new HourlyLeaveManager(UOW);
            var result = dlm.GetByID(id);
            dlm.Deny(result);
            UOW.SaveChanges();
            return RedirectToAction("ApproveIndex", new { ac = "Deny" });
        }

        public ActionResult DenyAll()
        {
            HourlyLeaveManager dlm = new HourlyLeaveManager(UOW);
            var hourlyLeaves = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order == 3);
            foreach (var leave in hourlyLeaves)
            {
                dlm.Deny(leave);
            }
            UOW.SaveChanges();
            return RedirectToAction("ApproveIndex", new { ac = "DenyAll" });
        }

        public ActionResult ApproveAll()
        {
            HourlyLeaveManager dlm = new HourlyLeaveManager(UOW);
            var hourlyLeaves = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order == 3);
            foreach (var leave in hourlyLeaves)
            {
                dlm.Approve(leave);
            }
            UOW.SaveChanges();
            return RedirectToAction("ApproveIndex", new { ac = "ApproveAll" });
        }


        public ActionResult ShowDenied()
        {
            HourlyLeaveManager dlm = new HourlyLeaveManager(UOW);
            var HourlyLeaves = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order  == 1);
            return View(new HourlyLeaveAssembler().ToJsons(HourlyLeaves.ToList()));
        }
        public ActionResult ShowApproves()
        {
            HourlyLeaveManager dlm = new HourlyLeaveManager(UOW);
            var HourlyLeaves = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order == 4);
            return View(new HourlyLeaveAssembler().ToJsons(HourlyLeaves.ToList()));
        }

        public ActionResult Resend(Guid id)
        {
            HourlyLeaveManager dlm = new HourlyLeaveManager(UOW);
            var HourlyLeave = dlm.GetByID(id);
            dlm.Resend(HourlyLeave);
            UOW.SaveChanges();
            return RedirectToAction("ShowDenied", new { ac = "Resend" });
        }
    }

}