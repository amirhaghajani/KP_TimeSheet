using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class AssignmentManager
    {

        private IUnitOfWork _UOW;


        public AssignmentManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }


        public IEnumerable<Assignment> GetAll()
        {
            return _UOW.AssignmentRepository.GetAll();

        }

        public IEnumerable<Assignment> GetByProjectIds(IEnumerable<Guid> projectIDs)
        {
            return _UOW.AssignmentRepository.GetByProjectIDs(projectIDs);

        }


        
    }

}

