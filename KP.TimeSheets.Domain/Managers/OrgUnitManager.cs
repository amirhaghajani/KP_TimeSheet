using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class OrgUnitManager
    {



        private IUnitOfWork _UOW;





        public OrgUnitManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }

        public IEnumerable<OrganizationUnit> GetAll()
        {
            return _UOW.OrgUnitRepository.GetAll();
        }

        public OrganizationUnit GetByID(Guid orgUnitID)
        {
            return _UOW.OrgUnitRepository.GetByID(orgUnitID);
        }

        public void Save(OrganizationUnit organ)
        {
            UserManager um = new UserManager(_UOW);

            OrganizationUnit finalOrgan = new OrganizationUnit();
            finalOrgan.ID = organ.ID;
            finalOrgan.ManagerID = organ.ManagerID;
            finalOrgan.Title = organ.Title;
            finalOrgan.ParentID = organ.ParentID;

            if (IsExistById(organ.ID))
            {
                IEnumerable<User> currentUsers = um.GetByOrganisationID(organ.ID);
                if (currentUsers.Any())
                {
                    foreach (var curuser in currentUsers)
                    {
                        if (curuser != null)
                        {
                            um.SetOrganUnitToUser(null, curuser.ID);
                        }

                    }
                }
                foreach (var user in organ.Employees)
                {
                    if (user != null)
                    {
                        um.SetOrganUnitToUser(organ.ID, user.ID);
                    }
                }
                var errors = new Validations().ValidateRegisterOrganUnit(organ);
                if (errors.Any())
                    throw new ValidationException(errors);
                _UOW.OrgUnitRepository.Edit(finalOrgan);
            }
            else
            {
                _UOW.OrgUnitRepository.Add(finalOrgan);
                foreach (var user in organ.Employees)
                {
                    if (user != null)
                    {
                        um.SetOrganUnitToUser(organ.ID, user.ID);
                    }
                }


            }

            _UOW.SaveChanges();
        }

        public void Delete(Guid orgUnitID)
        {
            _UOW.OrgUnitRepository.Delete(orgUnitID);
        }

        public IEnumerable<OrganizationUnit> GetByManagerId(Guid id)
        {
            return _UOW.OrgUnitRepository.GetByManagerID(id);
        }


        public bool IsExistById(Guid organId)
        {
            return _UOW.OrgUnitRepository.IsExistById(organId);
        }



    }
}
