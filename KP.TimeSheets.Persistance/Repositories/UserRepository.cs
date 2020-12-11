using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace KP.TimeSheets.Persistance
{
    internal class UserRepository : IUserRepository
    {
        #region Attributes & Properties

       
        string _PWAConnString;
        RASContext _RASContext;
       

        #endregion

        #region Constructors

        public UserRepository(string pwaConnString, RASContext rasContext)
        {
            
            _PWAConnString = pwaConnString;
            _RASContext = rasContext;
           
        }

        #endregion

        #region CRUD Methods

        public User GetByID(Guid userID)
        {

            return _RASContext.Users.Include("OrganizationUnit").FirstOrDefault(item => item.ID.Equals(userID));

        }

        public IEnumerable<User> GetByOrganisationID(Guid? OrganId)
        {

            return _RASContext.Users.Where(item => item.OrganizationUnitID== OrganId);

        }


        public User GetByUserName(string userName)
        {
            User result = null;
                result = _RASContext.Users.FirstOrDefault(item => item.UserName.Trim()==userName);
                       return result;
        }


        public IEnumerable<User> GetAll()
        {
            return _RASContext.Users;
        }



        /// <summary>
        /// اضافه کردن کاربر جدید به پایگاه داده
        /// </summary>
        /// <param name="user">موجودیت مرتبط با کاربر جدید</param>
        public void Add(User user)
        {
            _RASContext.Users.Add(user);
        }

        /// <summary>
        /// ویرایش کاربر
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public void Edit(User user)
        {
            var entity = _RASContext.Users.Find(user.ID);
            FillEntity(user, entity);
        }

        private static void FillEntity(User user, User entity)
        {
            entity.UserName = user.UserName ?? null;
            entity.Code = user.Code;
            entity.ID = user.ID;
            entity.UserTitle = user.UserTitle;
            entity.OrganizationUnitID = user.OrganizationUnitID;
        }

        /// <summary>
        /// بررسی اینکه آیا کاربر با شناسه مورد نظر وجود دارد
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool IsExistById(Guid id)
        {
            return _RASContext.Users.Any(x => x.ID == id);
        }

        public void Sync()
        {
           
                string commandText = string.Format(@"
                    Select 
	                    ResourceUID, ResourceName, ResourceNTAccount,EmployeeCode
                    From 
	                    MSP_EpmResource_UserView");
                SqlCommand sqlCommand = new SqlCommand(commandText, new SqlConnection(_PWAConnString));
                var dataTable = SqlQueryExecute.GetDataTable(commandText, _PWAConnString);
                List<User> users = PWATranslator.ToUsers(dataTable,_RASContext.Users.ToList());
                users.ForEach(entity =>
                {
                    if (IsExistById(entity.ID))
                        Edit(entity);
                    else
                        Add(entity);
                });
          
        }

        #endregion

        #region Private Methods

     

       public void SetOrganUnitToUser(Guid? OrganId, Guid UserId)
        {
            var result = _RASContext.Users.First(x => x.ID == UserId);
            result.OrganizationUnitID = OrganId;
        }


    #endregion

    }
}
