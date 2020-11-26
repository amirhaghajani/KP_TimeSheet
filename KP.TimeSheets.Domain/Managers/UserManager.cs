using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace KP.TimeSheets.Domain
{
    public class UserManager
    {

      

        private IUnitOfWork _UOW;

   

     

        public UserManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }


      

        public void Sync()
        {
            _UOW.UserRepository.Sync();
            _UOW.SaveChanges();
        }

        public User GetByUserName(string userName)
        {
            return _UOW.UserRepository.GetByUserName(userName);
        }

        public User GetByID(Guid ID)
        {
            return _UOW.UserRepository.GetByID(ID);
        }

        public IEnumerable<User> GetByOrganisationID(Guid? OrganId)
        {
            return _UOW.UserRepository.GetByOrganisationID(OrganId);
        }

        public IEnumerable<User> GetMyEmployees(User user)
        {
            var result = new List<User>();
            var organiztions= _UOW.OrgUnitRepository.GetByManagerID(user.ID);
            foreach (var org in organiztions)
            {
                result.AddRange(org.Employees.Where(x => !result.Any(y => y.ID == x.ID)));
            }

            var projects = _UOW.ProjectRepository.GetByManagerID(user.ID);
            var assignments = _UOW.AssignmentRepository.GetByProjectIDs(projects.Select(x => x.ID));
            foreach (var ass in assignments.Where(x => !result.Any(y => y.ID == x.ResourceID)))
            {
                if (result.Any(x => x.ID == ass.ResourceID))
                    continue;
                result.Add(ass.Resource);
            }

            return result;
        }


        public IEnumerable<User> GetAll()
        {
            return _UOW.UserRepository.GetAll();
        }
       
 
        public void SetOrganUnitToUser(Guid? OrganId,Guid UserId)
        {
            _UOW.UserRepository.SetOrganUnitToUser(OrganId, UserId);
           
        }


       

    }
}
