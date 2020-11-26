using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace KP.TimeSheets.Persistance
{
   internal class HourlyLeaveRepository : IHourlyLeaveRepository
    {
        RASContext _RASContext;

     public   HourlyLeaveRepository(RASContext rasContext)
        {

            _RASContext = rasContext;
        }

        public void Add(HourlyLeave hourlyLeave)
        {
            if (IsExist(hourlyLeave))
            {
                var existingObject = GetByID(hourlyLeave.ID);
                FillEntity(existingObject, hourlyLeave);
            }
            else
            {
                _RASContext.HourlyLeaves.Add(hourlyLeave);
            }
        }

        public void Delete(HourlyLeave hourlyLeave)
        {
            _RASContext.HourlyLeaves.Remove(hourlyLeave);
        }

        public void DeleteByID(Guid id)
        {
            var deletehourlyLeave = GetByID(id);
            _RASContext.HourlyLeaves.Remove(deletehourlyLeave);
        }

        public void Edit(HourlyLeave hourlyLeave)
        {
            var edithourlyLeave = GetByID(hourlyLeave.ID);
            FillEntity(edithourlyLeave, hourlyLeave);
        }

        public IEnumerable<HourlyLeave> GetAll()
        {
            return DefaultQuery();
        }

        public HourlyLeave GetByID(Guid id)
        {
            return DefaultQuery().First(X => X.ID == id);
        }

        public bool IsExist(HourlyLeave hourlyLeave)
        {
            return _RASContext.HourlyLeaves.Any(X => X.ID == hourlyLeave.ID);
        }



        public void FillEntity(HourlyLeave hourlyLeave, HourlyLeave entity)
        {
            hourlyLeave.ID = entity.ID;
            hourlyLeave.ProjectID = entity.ProjectID;
            hourlyLeave.WorkflowStageID = entity.WorkflowStageID;
            hourlyLeave.UserId = entity.UserId;
            hourlyLeave.RegisterDate = entity.RegisterDate;
            hourlyLeave.OrganisationId = entity.OrganisationId;
            hourlyLeave.LeaveDate = entity.LeaveDate;
            hourlyLeave.From = entity.From;
            hourlyLeave.To = entity.To;
            
        }

        public IQueryable<HourlyLeave> DefaultQuery()
        {
            return _RASContext.HourlyLeaves.Include(x => x.Project)
                .Include(q => q.User).
                Include(s=>s.Organisation)
                .Include(w => w.WorkflowStage);
                
        }

        public IEnumerable<HourlyLeave> GetAllByUserID(Guid UserId)
        {
            return DefaultQuery().Where(x => x.UserId == UserId);
        }
        public IEnumerable<HourlyLeave> GetByOrganisationID(Guid? organId)
        {
            return DefaultQuery().Where(x => x.OrganisationId == organId);
        }


    }
}
