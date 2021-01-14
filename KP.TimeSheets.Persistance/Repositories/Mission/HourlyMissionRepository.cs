using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace KP.TimeSheets.Persistance
{
  internal  class HourlyMissionRepository: IHourlyMissionRepository
    {

        RASContext _RASContext;

      public HourlyMissionRepository(RASContext rasContext)
        {
            _RASContext = rasContext;
        }

        public void Add(HourlyMission hourlyMission)
        {
            if (IsExist(hourlyMission))
            {
                var existingObject = GetByID(hourlyMission.ID);
                FillEntity(existingObject, hourlyMission);
            }
            else
            {
                _RASContext.HourlyMissions.Add(hourlyMission);
            }
                
            
        }

        public IEnumerable<HourlyMission> GetByOrganisationID(Guid? organId)
        {
            return DefaultQuery().Where(x => x.OrganisationId == organId);
        }

        public IEnumerable<HourlyMission> GetAllByUserID(Guid UserID)
        {
            return DefaultQuery().Where(x => x.UserID == UserID);
        }

        public void Delete(HourlyMission hourlyMission)
        {
            _RASContext.HourlyMissions.Remove(hourlyMission);
        }

        public void DeleteByID(Guid id)
        {
            var RemoveObject = GetByID(id);
            _RASContext.HourlyMissions.Remove(RemoveObject);
        }

        public void Edit(HourlyMission hourlyMission)
        {
            var editObject = GetByID(hourlyMission.ID);
            FillEntity(editObject, hourlyMission);
        }

        public IEnumerable<HourlyMission> GetAll()
        {
            return DefaultQuery();
        }

        public HourlyMission GetByID(Guid id)
        {
            return DefaultQuery().First(x => x.ID == id);
        }

        public bool IsExist(HourlyMission hourlyMission)
        {
          return  _RASContext.HourlyMissions.Any(x => x.ID == hourlyMission.ID);
        }

        public bool CheckDontHasLeaveOnDuration(Guid userId, DateTime from, DateTime to)
        {
            return _RASContext.DailyLeaves
                    .Where(d => d.UserID == userId && ((d.To >= from && d.To <= to) || (d.From >= from && d.To <= to))).Count() == 0;
        }


        public void FillEntity(HourlyMission hourlyMission , HourlyMission entity)
        {
            hourlyMission.ID = entity.ID;
            hourlyMission.ProjectID = entity.ProjectID;
            hourlyMission.RegisterDate = entity.RegisterDate;
            hourlyMission.From = entity.From;
            hourlyMission.OrganisationId = entity.OrganisationId;
            hourlyMission.To = entity.To;
            hourlyMission.WorkflowStageID = entity.WorkflowStageID;
            hourlyMission.UserID = entity.UserID;

        }

     public IQueryable<HourlyMission> DefaultQuery()
        {
            return _RASContext.HourlyMissions
                .Include(x => x.Project)
                .Include(y => y.User).
                Include(y=>y.Organisation)
                .Include(z => z.WorkflowStage);
        }

        public IEnumerable<HourlyMission> GetAllByUserID(Guid UserID, DateTime From, DateTime To)
        {
           
            return DefaultQuery().Where(x => x.Date > From && x.Date < To && x.UserID == UserID && x.WorkflowStage.IsLast);
        }
    }
}
