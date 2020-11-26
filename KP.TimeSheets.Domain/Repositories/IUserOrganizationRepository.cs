using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
 public  interface IUserOrganizationRepository
    {

        OrganizationUnit GetOrganisationByMnagerId(Guid userId);

        
    }
}
