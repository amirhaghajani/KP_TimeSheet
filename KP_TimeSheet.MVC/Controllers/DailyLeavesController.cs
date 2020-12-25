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
    public class DailyLeavesController : BaseController
    {
        public DailyLeavesController(IUnitOfWork uow):base(uow){}

       

        // GET: DailyLeaves
        public ActionResult Index()
        {
            DailyLeaveManager dlm = new DailyLeaveManager(this.UOW);
            var dailyLeaves = dlm.GetAllByUserID(this.CurrentUser.ID).OrderByDescending(d=>d.RegisterDate);
            return View(new DailyLeaveAssembles().ToJsons(dailyLeaves.ToList()));
        }

        // GET: DailyLeaves/Details/5
        public ActionResult Details(Guid id)
        {
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی مرخصی ارسال نشده است");
            }
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            DailyLeave dailyLeave = dlm.GetByID(id);
            if (dailyLeave == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"مرخصی با آی دی ارسال شده یافت نشد");
            }
            return View(new DailyLeaveAssembles().ToJson(dailyLeave));
        }

        // GET: DailyLeaves/Create
        public ActionResult Create()
        {
          
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            ViewBag.ProjectID = new SelectList(pm.GetByUser(this.CurrentUser), "ID", "Title");
            ViewBag.SuccessorID = new SelectList(um.GetAll(), "ID", "UserTitle");
            return View();
        }

        // POST: DailyLeaves/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create( DailyLeave dailyLeave)
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            dailyLeave.UserID = this.CurrentUser.ID;
            dailyLeave.OrganisationId = this.CurrentUser.OrganizationUnitID;

            if (ModelState.IsValid)
            {
                dlm.Add(dailyLeave);
                return RedirectToAction("Index");
            }
           
          
            ViewBag.ProjectID = new SelectList(pm.GetByUser(this.CurrentUser), "ID", "Title");
            ViewBag.SuccessorID = new SelectList(um.GetAll(), "ID", "UserTitle");
            return View(dailyLeave);
        }

        // GET: DailyLeaves/Edit/5
        public ActionResult Edit(Guid id)
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی مرخصی ارسال نشده است");
            }
            DailyLeave dailyLeave = dlm.GetByID(id);
            if (dailyLeave == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"مرخصی با آی دی ارسال شده یافت نشد");
            }
            ViewBag.ProjectID = new SelectList(pm.GetByUser(this.CurrentUser), "ID", "Title");
            ViewBag.SuccessorID = new SelectList(um.GetAll(), "ID", "UserTitle");
            return View(dailyLeave);
        }

        // POST: DailyLeaves/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(DailyLeave dailyLeave)
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (ModelState.IsValid)
            {
                dlm.Edit(dailyLeave);
             
                return RedirectToAction("Index");
            }
            ViewBag.ProjectID = new SelectList(pm.GetByUser(this.CurrentUser), "ID", "Title");
            ViewBag.SuccessorID = new SelectList(um.GetAll(), "ID", "UserTitle");
            return View(dailyLeave);
        }

        // GET: DailyLeaves/Delete/5
        public ActionResult Delete(Guid id)
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی مرخصی ارسال نشده است");
            }
            DailyLeave dailyLeave =dlm.GetByID(id);
            if (dailyLeave == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"مرخصی با آی دی ارسال شده یافت نشد");
            }
            return View(new DailyLeaveAssembles().ToJson(dailyLeave));
        }

        // POST: DailyLeaves/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(Guid id)
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            dlm.DeleteByID(id);
            return RedirectToAction("Index");
        }

        // GET: DailyLeaves/ApproveIndex/5
        public ActionResult ApproveIndex()
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            var dailyLeaves = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x=>x.WorkflowStage.Order ==3);
            return View(new DailyLeaveAssembles().ToJsons(dailyLeaves.ToList()));
        }



        public ActionResult Approve(Guid id)
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی مرخصی ارسال نشده است");
            }
            DailyLeave dailyLeave = dlm.GetByID(id);
            if (dailyLeave == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"مرخصی با آی دی ارسال شده یافت نشد");
            }
            return View(new DailyLeaveAssembles().ToJson(dailyLeave));
        }

        // POST: DailyLeaves/Delete/5
        [HttpPost, ActionName("Approve")]
        [ValidateAntiForgeryToken]
        public ActionResult ApproveConfirmed(Guid id)
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            var result = dlm.GetByID(id);
            dlm.Approve(result);
            UOW.SaveChanges();

            return RedirectToAction("ApproveIndex", new { ac = "Approve" });
        }



        // POST: DailyLeaves/Approve/5




        public ActionResult Deny(Guid id)
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            ProjectManager pm = new ProjectManager(UOW);
            UserManager um = new UserManager(UOW);
            if (id == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.BadRequest,"آی دی مرخصی ارسال نشده است");
            }
            DailyLeave dailyLeave = dlm.GetByID(id);
            if (dailyLeave == null)
            {
                return this.StatusCode(statusCode: (int)System.Net.HttpStatusCode.NotFound,"مرخصی با آی دی ارسال شده یافت نشد");
            }
            return View(new DailyLeaveAssembles().ToJson(dailyLeave));
        }

        // POST: DailyLeaves/Delete/5
        [HttpPost, ActionName("Deny")]
        [ValidateAntiForgeryToken]
        public ActionResult DenyConfirmed(Guid id)
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            var result = dlm.GetByID(id);
            dlm.Deny(result);
            UOW.SaveChanges();
            return RedirectToAction("ApproveIndex", new { ac = "Deny" });
        }

        public ActionResult DenyAll()
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            var dailyLeaves = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order == 3);
            foreach (var leave in dailyLeaves)
            {
                dlm.Deny(leave);
            }
            UOW.SaveChanges();
            return RedirectToAction("ApproveIndex", new { ac = "DenyAll" });
        }

        public ActionResult ApproveAll()
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            var dailyLeaves = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order ==3);
            foreach (var leave in dailyLeaves)
            {
                dlm.Approve(leave);
            }
            UOW.SaveChanges();
            return RedirectToAction("ApproveIndex", new { ac = "ApproveAll" });
        }

        public ActionResult ShowDenied()
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            var dailyLeaves = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order == 1);
            return View(new DailyLeaveAssembles().ToJsons(dailyLeaves.ToList()));
        }
        public ActionResult ShowApproves()
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            var dailyLeaves = dlm.GetByOrganisationID(this.CurrentUser.OrganizationUnitID).
                Where(x => x.WorkflowStage.Order == 4);
            return View(new DailyLeaveAssembles().ToJsons(dailyLeaves.ToList()));
        }

        public ActionResult Resend(Guid id )
        {
            DailyLeaveManager dlm = new DailyLeaveManager(UOW);
            var dailyLeave = dlm.GetByID(id);
                dlm.Resend(dailyLeave);
            UOW.SaveChanges();
            return RedirectToAction("ShowDenied", new { ac = "Resend" });
        }



    }
}
