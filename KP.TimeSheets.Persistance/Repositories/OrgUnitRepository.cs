using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace KP.TimeSheets.Persistance
{
    internal class OrgUnitRepository : IOrgUnitRepository
    {

      

     
        string _PWAConnString;
        RASContext _RASContext;

       

        public OrgUnitRepository(string pwaConnString, RASContext rasContext)
        {
          
            
            _PWAConnString = pwaConnString;
            _RASContext = rasContext;
        }

      

      


       

        public void Add(OrganizationUnit entity)
        {
            _RASContext.OrganizationUnits.Add(entity);
        }

        public void Delete(Guid orgUnitID)
        {
            var result = DefaultQuery().First(x => x.ID == orgUnitID);
            _RASContext.OrganizationUnits.Remove(result);
        }

        public void Edit(OrganizationUnit orgUnit)
        {
            var result = DefaultQuery().First(x=>x.ID == orgUnit.ID);
            FillEntity(result, orgUnit);
            
        }

        public IEnumerable<OrganizationUnit> GetAll()
        {
            return DefaultQuery();
        }

        public void FillEntity(OrganizationUnit entity , OrganizationUnit organ)
        {
            entity.ID = organ.ID;
            entity.ManagerID = organ.ManagerID;
            entity.ParentID = organ.ParentID;
            entity.Title = organ.Title;

        }
        public OrganizationUnit GetByID(Guid orgUnitID)
        {
            return _RASContext.OrganizationUnits.First(x => x.ID == orgUnitID);
        }

        public bool IsExistById(Guid orgUnitID)
        {
            if (orgUnitID == Guid.Empty)
                return false;
           
            if (_RASContext.OrganizationUnits.Any(x => x.ID == orgUnitID))
                return true;
            return false;
        }

        public IEnumerable<OrganizationUnit> GetByManagerID(Guid managerId)
        {
            return DefaultQuery().Where(x=>x.ManagerID==managerId).ToList();
        }

        private IQueryable<OrganizationUnit> DefaultQuery()
        {
            return _RASContext.OrganizationUnits
                .Include(x => x.Manager).
                Include(y=>y.Employees);
        }
      
    }
}
