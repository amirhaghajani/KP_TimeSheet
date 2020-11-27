using KP.TimeSheets.Domain;
using KP.TimeSheets.Persistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace KP.TimeSheets.MVC
{
    public class OrganisationUnitAssembler
    {
        public IEnumerable<OrganisationUnitJson> ToJsons(IEnumerable<OrganizationUnit> organs)
        {
            List<OrganisationUnitJson> result = new List<OrganisationUnitJson>();

            foreach (var organ in organs)
            {
                result.Add(TOJson(organ));
            }
            return result;
        }


        public OrganisationUnitJson TOJson(OrganizationUnit organ)
        {
            OrganisationUnitJson result = new OrganisationUnitJson();
            result.ID = organ.ID;
            result.ManagerFullName = organ.Manager.UserTitle;
            result.ManagerID = organ.ManagerID;
            result.Title = organ.Title;
            result.ParentId = organ.ParentID;
            result.Users = new UserAssembler().ToJsons(organ.Employees).ToList();
            return result;       
        }


        public IEnumerable<OrganizationUnit> ToEntities(IEnumerable<OrganisationUnitJson> orgjsons)
        {
            List<OrganizationUnit> result = new List<OrganizationUnit>();

            foreach (var orgjson in orgjsons)
            {
                result.Add(ToEntity(orgjson));
            }

            return result;
        }



        public OrganizationUnit ToEntity(OrganisationUnitJson orgjson)
        {
            UnitOfWork uow = new UnitOfWork();
            UserManager um = new UserManager(uow);
            OrganizationUnit result = new OrganizationUnit();
            result.Employees = new List<User>();
            result.ID = orgjson.ID;
            result.ManagerID = orgjson.ManagerID;
            result.ParentID = orgjson.ParentId;
            foreach (var user in orgjson.Users)
            {
                result.Employees.Add(um.GetByID(user.ID));
            }
            result.Title = orgjson.Title;
            return result;

        }
    }
}