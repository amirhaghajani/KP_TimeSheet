using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace KP.TimeSheets.Persistance
{
    internal class DailyLeaveRepository : IDailyLeaveRepository
    {

        RASContext _RASContext;

        public DailyLeaveRepository(RASContext rasContext)
        {

            _RASContext = rasContext;
        }

        public void Add(DailyLeave dailyLeave)
        {
            if (IsExist(dailyLeave))
            {
                var existingObject = GetByID(dailyLeave.ID);
                FillEntity(existingObject, dailyLeave);
            }
            else
            {
                _RASContext.DailyLeaves.Add(dailyLeave);
            }
        }

        public void Delete(DailyLeave dailyLeave)
        {
            _RASContext.DailyLeaves.Remove(dailyLeave);
        }

        public void DeleteByID(Guid id)
        {
            var deletedailyLeave = GetByID(id);
            _RASContext.DailyLeaves.Remove(deletedailyLeave);
        }

        public void Edit(DailyLeave dailyLeave)
        {
            var editdailyLeave = GetByID(dailyLeave.ID);
            FillEntity(editdailyLeave, dailyLeave);
        }

        public IEnumerable<DailyLeave> GetAllByUserID(Guid UserID)
        {
            return DefaultQuery().Where(x => x.UserID == UserID);
        }
        public IEnumerable<DailyLeave> GetByOrganisationID(Guid? organId)
        {
            return DefaultQuery().Where(x => x.OrganisationId == organId);
        }
        public IEnumerable<DailyLeave> GetAll()
        {
            return DefaultQuery();
        }

        public DailyLeave GetByID(Guid id)
        {
            return DefaultQuery().First(x => x.ID == id);
        }

        public bool IsExist(DailyLeave dailyLeave)
        {
            return _RASContext.DailyLeaves.Any(x => x.ID == dailyLeave.ID);
        }

        public bool CheckDontHasLeaveOnDuration(Guid userId, DateTime start, DateTime end)
        {
            return _RASContext.DailyLeaves
            .Where(d => d.UserID == userId && ((d.To > start && d.To < end) || (d.From > start && d.To < end) || (d.From == start && d.To == end))).Count() == 0;
        }


        public void FillEntity(DailyLeave dailyLeave, DailyLeave entity)
        {
            dailyLeave.ID = entity.ID;
            dailyLeave.ProjectID = entity.ProjectID;
            dailyLeave.SuccessorID = entity.SuccessorID;
            dailyLeave.Type = entity.Type;
            dailyLeave.OrganisationId = entity.OrganisationId;
            dailyLeave.RegisterDate = entity.RegisterDate;
            dailyLeave.From = entity.From;
            dailyLeave.To = entity.To;
            dailyLeave.WorkflowStageID = entity.WorkflowStageID;
            dailyLeave.UserID = entity.UserID;

        }

        public IQueryable<DailyLeave> DefaultQuery()
        {
            return _RASContext.DailyLeaves.Include(x => x.User)
                .Include(w => w.WorkflowStage).
                Include(r => r.Successor).
                Include(y => y.Organisation)
                .Include(e => e.Project);
        }


    }
}
