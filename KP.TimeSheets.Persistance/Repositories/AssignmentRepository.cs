using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace KP.TimeSheets.Persistance
{
    internal class AssignmentRepository : IAssignmentRepository
    {

        #region Attributes & Properties

       
        string _PWAConnString;
        RASContext _RASContext;
      

        #endregion

        #region Constructors

        public AssignmentRepository(string pwaConnString, RASContext rasContext)
        {
            
           
            _PWAConnString = pwaConnString;
            _RASContext = rasContext;
        }

        #endregion

        #region CRUD Methods

        // <summary>
        /// بدست آوردن تمامی انتساب ها
        /// </summary>
        /// <returns>شئی قابل شمارش از انتساب ها</returns>
        public IEnumerable<Assignment> GetAll()
        {
            return _RASContext.Assignments.Include("Resource").ToList();
        }

        /// <summary>
        /// بدست آوردن انتساب بر اساس شناسه آن
        /// </summary>
        /// <param name="assignmentID">شناسه انتساب</param>
        /// <returns>انتسابی که در بررسی پایگاه داده بدست می آید.</returns>
        public Assignment GetByID(Guid assignmentID)
        {
            return _RASContext.Assignments.FirstOrDefault(item => item.ID.Equals(assignmentID));
        }

        /// <summary>
        /// اضافه کردن انتساب جدید به پایگاه داده
        /// </summary>
        /// <param name="assignment">موجودیت مرتبط با انتساب جدید</param>
        public void Add(Assignment assignment)
        {
            _RASContext.Assignments.Add(assignment);
        }

        private IQueryable<Assignment> DefaultQuery()
        {
            return _RASContext.Assignments.Include(x => x.Resource);
        }

        /// <summary>
        /// بروزرسانی انتساب
        /// </summary>
        /// <param name="assignment">موجودیت مرتبط با انتساب</param>
        public void Edit(Assignment assignment)
        {
            var entity = _RASContext.Assignments.Find(assignment.ID);
            entity.ProjectID = assignment.ProjectID;
            entity.TaskID = assignment.TaskID;
            entity.ResourceID = assignment.ResourceID;
        }

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="assignmentID">شناسه انتساب</param>
        public void Delete(Guid assignmentID)
        {
            var result = _RASContext.Assignments.Find(assignmentID);
            _RASContext.Assignments.Remove(result);
        }

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="assignmentID">شناسه انتساب</param>
        /// <returns></returns>
        public bool IsExistById(Guid assignmentID)
        {
            return _RASContext.Assignments.Any(x => x.ID == assignmentID);
        }

        /// <summary>
        /// وارد کردن داده های پروژه از PWA
        /// </summary>
        internal void Sync()
        {
           
                string commandText = @"
                update [Assignments] set isdeactivated=1
                    where id not in
                    (
                        Select AssignmentUID
                                        From 
                                            ProjectWebApp.dbo.MSP_EpmAssignment_UserView 
                    );
                   Select 
	                    AssignmentUID, ProjectUID, ResourceUID, TaskUID
                    From 
	                    ProjectWebApp.dbo.MSP_EpmAssignment_UserView";
                SqlCommand sqlCommand = new SqlCommand(commandText, new SqlConnection(_PWAConnString));
                var dataTable = SqlQueryExecute.GetDataTable(commandText, _PWAConnString);
                List<Assignment> assignments = PWATranslator.ToAssignments(dataTable);
                assignments.ForEach(entity =>
                {
                    if (IsExistById(entity.ID))
                        Edit(entity);
                    else
                        Add(entity);

                });

                //IsDeactivated
           
        }

        public IEnumerable<Assignment> GetByProjectIDs(IEnumerable<Guid> projectIds)
        {
            return DefaultQuery().Where(x => projectIds.Contains(x.ID)).ToList();
        }

        #endregion


    }
}
