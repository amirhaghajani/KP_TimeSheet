using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace KP.TimeSheets.Persistance
{
    internal class ProjectRepository :IProjectRepository
    {

        #region Attributes & Properties

      
        string _PWAConnString;
        RASContext _RASContext;
       


        #endregion

        #region Constructors

        public ProjectRepository(string pwaConnString, RASContext rasContext)
        {
          
            _PWAConnString = pwaConnString;
            _RASContext = rasContext;
        }

        #endregion

        #region CRUD Methods

        /// <summary>
        /// بدست آوردن تمامی پروژه ها
        /// </summary>
        /// <returns>شئی قابل شمارش از پروژه ها</returns>
        public IEnumerable<Project> GetAll()
        {
            return DefaultQuery().ToList();
        }

        /// <summary>
        /// بدست آوردن پروژه بر اساس شناسه آن
        /// </summary>
        /// <param name="projectID">شناسه پروژه</param>
        /// <returns>پروژه ای که در بررسی پایگاه داده بدست می آید.</returns>
        public Project GetByID(Guid projectID)
        {
            return DefaultQuery().FirstOrDefault(item => item.ID.Equals(projectID));
        }
        
        /// <summary>
        /// بدست آوردن پروژه ها بر اساس کاربر 
        /// </summary>
        /// <param name="user">شئی کاربر</param>
        /// <returns>پروژه هایی که در بررسی پایگاه داده بدست می آید.</returns>
        public IEnumerable<Project> GetByUser(User user)
        {
            IEnumerable<Project> result = null;
                string cmdText = @"
                    Select 
	                    Distinct Projects.*
                    FROM 
	                    [Assignments] Assinments 
	                    Inner Join dbo.Tasks Tasks On Assinments.TaskID = Tasks.ID
	                    Inner Join dbo.Projects Projects On Tasks.ProjectID = Projects.ID
                    Where
	                    isnull(IsDeactivated,0)=0 and Assinments.ResourceID=@ResourceID";
                SqlParameter sqlpResourceID = new SqlParameter("@ResourceID", user.ID);
                result = _RASContext.Projects.FromSqlRaw(cmdText, sqlpResourceID).ToList();
           
            return result;
        }

        /// <summary>
        /// اضافه کردن پروژه جدید به پایگاه داده
        /// </summary>
        /// <param name="project">موجودیت مرتبط با پروژه جدید</param>
        /// <returns>پروژه ای که پس از اضافه شده به پایگاه داده بازگردانده می شود.</returns>
        public void Add(Project project)
        {
            var entity = new Project();
            FillProjectEntity(entity, project);
            _RASContext.Projects.Add(entity);
        }

        /// <summary>
        /// حذف پروژه با شناسه پروژه از پایگاه داده
        /// </summary>
        /// <param name="projectID">شناسه پروژه</param>
        public void Delete(Guid projectID)
        {
            var result = _RASContext.Projects.Find(projectID);
            _RASContext.Projects.Remove(result);
        }

        /// <summary>
        /// ویرایش پروژه
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public void Edit(Project project)
        {
            var entity = _RASContext.Projects.Find(project.ID);
            FillProjectEntity(entity, project);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool IsExistById(Guid id)
        {
            return _RASContext.Projects.Any(x => x.ID == id);
        }

        /// <summary>
        /// وارد کردن داده های پروژه از PWA
        /// </summary>
        public void Sync()
        {
              UserRepository userRepository = new UserRepository( this._PWAConnString, this._RASContext);
                TaskRepository taskRepository = new TaskRepository( this._PWAConnString, this._RASContext);
                AssignmentRepository assignRepository = new AssignmentRepository( this._PWAConnString, this._RASContext);

                string commandText = @"
                   Select 
	                    ProjectUID, ProjectName,
	                    Case 
		                    When  ProjectOwnerName is not null Then 
			                    ProjectOwnerName 
		                    Else 
			                    null 
	                    End as OwnerName,
	                    Case 
		                    When  ProjectOwnerName is not null Then 
			                    ProjectOwnerResourceUID 
		                    Else 
			                    null 
	                    End as ResourceID,
	                    Case 
		                    When  ProjectOwnerName is not null Then 
			                    LTable.ResourceNTAccount 
		                    Else 
			                    null 
	                    End as UserName
                    From 
	                    ProjectWebApp..MSP_EpmProject_UserView RTable 
	                    Left Join ProjectWebApp..MSP_EpmResource_UserView LTable
	                    On RTable.ProjectOwnerResourceUID = LTable.ResourceUID";
                SqlCommand sqlCommand = new SqlCommand(commandText, new SqlConnection(_PWAConnString));
                var dataTable = SqlQueryExecute.GetDataTable(commandText, _PWAConnString);
                List<Project> projects = PWATranslator.ToProjects(dataTable);
                projects.ForEach(entity =>
                {
                    if (IsExistById(entity.ID))
                        Edit(entity);
                    else
                        Add(entity);

                });

                //Sync Users(Resources)
                userRepository.Sync();

                //Sync Tasks
                taskRepository.Sync();

                //Sync Assignment
                assignRepository.Sync();
                
           
        }

        #endregion

        #region Private Methods

        private IQueryable<Project> DefaultQuery()
        {
            return _RASContext.Projects.
                Include(x=>x.Calendar).
                Include(y=>y.Owner);
        }

        private void FillProjectEntity(Project entity, Project project)
        {
            entity.ID = project.ID;
            entity.Title = project.Title;
            entity.OwnerID = project.OwnerID;
            entity.CalendarID = project.CalendarID;
        }

        public IEnumerable<Project> GetByManagerID(Guid id)
        {
            return DefaultQuery().Where(x => x.OwnerID == id).ToList();
        }

        #endregion

    }
}
