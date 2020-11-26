using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class TaskManager
    {

        #region Attributes & Properties

        private IUnitOfWork _UOW;

        #endregion

        #region Constructors

        public TaskManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }


        #endregion

        #region Public Methods

        public void DeleteById(Guid id)
        {
            _UOW.TaskRepository.Delete(id);
        }
        

        public IEnumerable<Task> GetAll()
        {
            return _UOW.TaskRepository.GetAll();
        }

        public IEnumerable<Task> GetByProject(Project project)
        {
            IEnumerable<Task> result = null;
           
                result = _UOW.TaskRepository.GetByProject(project).ToList();
          
            return result; 
        }

        public IEnumerable<Task> GetByProject(Project project, User user)
        {
            IEnumerable<Task> result = null;
           
                result = _UOW.TaskRepository.GetByProject(project, user).ToList();
          
            return result;
        }

        public Task GetByID(Guid ID)
        {
            Task result = null;
           
                result = _UOW.TaskRepository.GetByID(ID);
            
            return result;
        }

        #endregion

        #region Private Methods


       

     public   void AddTask(Task task)
        {
            if (_UOW.TaskRepository.IsExistById(task.ID))
                EditTask(task);
            else
                _UOW.TaskRepository.Add(task);
            _UOW.SaveChanges();
        }

     public void EditTask(Task task)
        {
            _UOW.TaskRepository.Edit(task);
        }

        #endregion

    }
}
