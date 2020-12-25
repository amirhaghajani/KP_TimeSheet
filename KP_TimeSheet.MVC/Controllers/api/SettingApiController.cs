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
            om.Save(new OrganisationUnitAssembler().ToEntity(ou,this._uow));
            return result;
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
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/SettingApi/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/SettingApi/5
        public void Delete(int id)
        {
        }
    }
}
