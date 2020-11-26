using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Persistance
{
    internal class PWARepository : IPWARepository 
    {

        #region Attributes & Properties

      
        string _PWAConnString;
        RASContext _RASContext;

        #endregion

        #region Constructors

        public PWARepository(string pwaConnString, RASContext rasContext)
        {
           
           
            _PWAConnString = pwaConnString;
            _RASContext = rasContext;
        }

        #endregion

    }
}
