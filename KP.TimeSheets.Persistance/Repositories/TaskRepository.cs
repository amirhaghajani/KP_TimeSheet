using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace KP.TimeSheets.Persistance
{
    internal class TaskRepository : ITaskRepository
    {

      

     
        string _PWAConnString;
        RASContext _RASContext;
       
      

        public TaskRepository(string pwaConnString, RASContext rasContext)
        {
            
            _PWAConnString = pwaConnString;
            _RASContext = rasContext;
        }

     


        /// <summary>
        /// بدست آوردن تمامی فعالیت ها
        /// </summary>
        /// <returns>شئی قابل شمارش از فعالیت ها</returns>
        public IEnumerable<Task> GetAll()
        {
            return _RASContext.Tasks.ToList();
        }

        /// <summary>
        /// بدست آوردن فعالیت بر اساس شناسه آن
        /// </summary>
        /// <param name="taskID">شناسه فعالیت</param>
        /// <returns>فعالیتی که در بررسی پایگاه داده بدست می آید.</returns>
        public Task GetByID(Guid taskID)
        {
            return _RASContext.Tasks.FirstOrDefault(item => item.ID.Equals(taskID));
        }

        /// <summary>
        /// بدست آوردن فعالیت بر اساس پروژه
        /// </summary>
        /// <param name="project">شئی مرتبط با پروژه</param>
        /// <returns>فعالیت هایی که در بررسی پایگاه داده بدست می آید.</returns>
        public IEnumerable<Task> GetByProject(Project project, User user=null)
        {
            IEnumerable<Task> result = null;
            try
            {
                if(user != null)
                    result  = (from assignment in _RASContext.Assignments
                             join task in _RASContext.Tasks on assignment.TaskID equals task.ID
                             where assignment.ProjectID == project.ID && assignment.ResourceID == user.ID
                             select new { ID = task.ID, Title = task.Title }).ToList()
                             .Select(x => new Task { ID = x.ID, Title = x.Title });
                else
                    result = (from assignment in _RASContext.Assignments
                              join task in _RASContext.Tasks on assignment.TaskID equals task.ID
                              where assignment.ProjectID == project.ID
                              select new { ID = task.ID, Title = task.Title }).ToList()
                             .Select(x => new Task { ID = x.ID, Title = x.Title });
            }
            catch(Exception ex)
            {
                string strEx = ex.Message;

            }
            return result;
        }

        /// <summary>
        /// اضافه کردن فعالیت جدید به پایگاه داده
        /// </summary>
        /// <param name="task">موجودیت مرتبط با فعالیت جدید</param>
        public void Add(Task task)
        {
            _RASContext.Tasks.Add(task);
        }

        /// <summary>
        /// بروزرسانی فعالیت
        /// </summary>
        /// <param name="task">موجودیت مرتبط با فعالیت</param>
        public void Edit(Task task)
        {
            var entity = _RASContext.Tasks.Find(task.ID);
            entity.Title = task.Title;
            entity.ParentTaskID = task.ParentTaskID;
        }

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="taskID">شناسه فعالیت</param>
        public void Delete(Guid taskID)
        {
            var result = _RASContext.Tasks.Find(taskID);
            _RASContext.Tasks.Remove(result);
        }

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="taskID">شناسه فعالیت</param>
        /// <returns></returns>
        public bool IsExistById(Guid taskID)
        {
            return _RASContext.Tasks.Any(x => x.ID == taskID);
        }

        /// <summary>
        /// وارد کردن داده های فعالیت از PWA
        /// </summary>
        internal void Sync()
        {
            
                string commandText = @"
                    Select 
	                    ProjectUID, TaskUID, TaskName, TaskParentUID 
                    From
	                    dbo.MSP_EpmTask_UserView";
                SqlCommand sqlCommand = new SqlCommand(commandText, new SqlConnection(_PWAConnString));
                var dataTable = SqlQueryExecute.GetDataTable(commandText, _PWAConnString);
                List<Task> tasks = PWATranslator.ToTasks(dataTable);
                tasks.ForEach(entity =>
                {
                    if (IsExistById(entity.ID))
                        Edit(entity);
                    else
                        Add(entity);

                });
            
        }

        /// <summary>
        /// وارد کردن داده های فعالیت یک پروژه مشخص از PWA
        /// </summary>
        internal void Sync(Guid projectID)
        {
            try
            {
                string commandText = string.Format(@"
                    Select 
	                    ProjectUID, TaskUID, TaskName, TaskParentUID 
                    From
	                    dbo.MSP_EpmTask_UserView
                    Where 
                        ProjectUID = '{0}'", projectID);
                SqlCommand sqlCommand = new SqlCommand(commandText, new SqlConnection(_PWAConnString));
                var dataTable = SqlQueryExecute.GetDataTable(commandText, _PWAConnString);
                List<Task> tasks = PWATranslator.ToTasks(dataTable);
                tasks.ForEach(entity =>
                {
                    if (IsExistById(entity.ID))
                        Edit(entity);
                    else
                        Add(entity);

                });
            }
            catch
            {

            }
        }

      


    }
}
