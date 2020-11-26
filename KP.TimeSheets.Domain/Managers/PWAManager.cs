using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class PWAManager
    {

        #region Attributes & Properties

        private IUnitOfWork _UOW;

        #endregion

        #region Constructors

        public PWAManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }

        #endregion

        #region Public 

        #endregion


    }
}
