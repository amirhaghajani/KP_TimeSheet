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

    public class SettingApiController : MyBaseAPIController
    {
        IUnitOfWork _uow;
        public SettingApiController(IUnitOfWork uow, RASContext db) : base(db)
        {
            this._uow = uow;
        }


        [HttpPost("[action]")]
        public List<string> SaveOrganisationUnit(OrganisationUnitJson ou)
        {
            List<string> result = new List<string>();
            OrgUnitManager om = new OrgUnitManager(this._uow);
            om.Save(new OrganisationUnitAssembler().ToEntity(ou, this._uow));
            return result;
        }


        [HttpDelete("{organId}")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult DeleteOrganizationUnit(Guid organId)
        {
            try
            {
                var org = this.DBContext.OrganizationUnits.FirstOrDefault(o => o.ID == organId);
                if (org == null) throw new Exception("واحد سازمانی با آی دی خواسته شده یافت نشد");


                using (var transaction = DBContext.Database.BeginTransaction())
                {
                    try
                    {
                        var users = this.DBContext.Users.Where(u => u.OrganizationUnitID == organId);
                        foreach (var user in users)
                        {
                            user.OrganizationUnit = null;
                        }

                        this.DBContext.Entry(org).State = EntityState.Deleted;

                        this.DBContext.SaveChanges();
                        transaction.Commit();
                    }
                    catch(Exception ex)
                    {
                        transaction.Rollback();
                        return this.ReturnError(ex, "خطا در حذف واحد سازمانی");
                    }
                }

                return Ok();

            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در حذف واحد سازمانی");
            }
        }


        [HttpGet("[action]")]
        public IEnumerable<OrganisationUnitJson> GetAllOrganisationUnits()
        {
            OrgUnitManager organManager = new OrgUnitManager(this._uow);
            var s = organManager.GetAll();
            return new OrganisationUnitAssembler().ToJsons(s);
        }

        [HttpGet("[action]")]
        public OrganisationUnitJson BuildNewOrganUnit()
        {
            return new OrganisationUnitJson()
            {
                ID = Guid.NewGuid(),
                ManagerFullName = "",
                ManagerID = Guid.Empty,
                Title = "",
                Users = new List<UserJson>()
            };

        }

        // GET: api/SettingApi/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/SettingApi
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/SettingApi/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/SettingApi/5
        public void Delete(int id)
        {
        }
    }
}
