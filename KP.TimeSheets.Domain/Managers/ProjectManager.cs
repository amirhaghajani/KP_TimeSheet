using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public class ProjectManager
    {

        #region Attributes & Properties

        private IUnitOfWork _UOW;

        #endregion

        #region Constructors

        public ProjectManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }


        #endregion

        #region Public Methods

        public void Sync()
        {
            _UOW.ProjectRepository.Sync();
            _UOW.SaveChanges();
        }

        public IEnumerable<Project> GetAll()
        {
            return _UOW.ProjectRepository.GetAll();
        }

        public IEnumerable<Project> GetProjectsByManagerID(Guid managerID)
        {
            return _UOW.ProjectRepository.GetByManagerID(managerID);
        }

        public IEnumerable<Project> GetByUser(User user)
        {
           
            return _UOW.ProjectRepository.GetByUser(user);
        }

        public Project GetByID(Guid projectID)
        {
            return _UOW.ProjectRepository.GetByID(projectID);
        }

        public void Save(Project project)
        {
            if (_UOW.ProjectRepository.IsExistById(project.ID))
                EditProject(project);
            else
                AddProject(project);

            _UOW.SaveChanges();
        }

        public void Remove(Guid projectID)
        {
            _UOW.ProjectRepository.Delete(projectID);
            _UOW.SaveChanges();
        }

        public Project BuildProject()
        {
            var project = new Project();
            project.ID = Guid.NewGuid();
            project.Title = string.Empty;
            return project;
        }

        #endregion

        #region Private Methods

        void AddProject(Project project)
        {
            if (_UOW.ProjectRepository.IsExistById(project.ID))
                EditProject(project);
            else
                _UOW.ProjectRepository.Add(project);
            _UOW.SaveChanges();
        }

        void EditProject(Project project)
        {
            _UOW.ProjectRepository.Edit(project);
        }


       
        #endregion


    }
}
