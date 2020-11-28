using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace KP.TimeSheets.MVC
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsAPIController : ControllerBase
    {
        IUnitOfWork _uow;
        public ProjectsAPIController(IUnitOfWork uow)
        {
            this._uow = uow;
        }


        #region HttpGet Methods

        [HttpGet("[action]")]
        public IEnumerable<ProjectJson> GetProjects()
        {
            UserManager userManager = new UserManager(this._uow);
            ProjectManager projectManager = new ProjectManager(this._uow);
            User currUser = new UserHelper().GetCurrent(this._uow);
            var projectwithoutentities = projectManager.GetByUser(currUser).ToList();
            List<Project> completeprojects = new List<Project>();

            foreach (var item in projectwithoutentities)
            {
                completeprojects.Add(projectManager.GetByID(item.ID));
            }
            //SyncWithPWA(uow);


            return completeprojects.ToJsons();
        }

        [HttpGet("[action]")]
        public IEnumerable<ProjectJson> GetAllProjects()
        {
            IEnumerable<ProjectJson> result = null;

            ProjectManager projectManager = new ProjectManager(this._uow);


            //SyncWithPWA(uow);
            result = projectManager.GetAll().ToJsons();


            return result;
        }

        #endregion

        #region HttpPost Methods

        [HttpPost("[action]")]
        public IEnumerable<TaskJson> GetTasks(JObject jsonObject)
        {
            IEnumerable<TaskJson> result = null;
            try
            {
                dynamic projectJson = jsonObject;

                ProjectManager projectManager = new ProjectManager(this._uow);
                TaskManager taskManager = new TaskManager(this._uow);
                User currUser = new UserHelper().GetCurrent(this._uow);
                //SyncWithPWA(uow);
                Project project = projectManager.GetByID(Guid.Parse(projectJson.ID.ToString()));
                result = taskManager.GetByProject(project, currUser).ToJsons();
            }
            catch (Exception ex)
            {

            }
            return result;
        }

        #endregion

        #region Private Methods

        private void SyncWithPWA(IUnitOfWork unitOfWork)
        {
            try
            {
                ProjectManager projectManager = new Domain.ProjectManager(unitOfWork);
                projectManager.Sync();
            }
            catch (Exception ex)
            {
                string str = ex.Message;
            }
        }


        #endregion

    }
}
