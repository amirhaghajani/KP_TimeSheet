using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
namespace KP.TimeSheets.Persistance
{
    internal class WorkHourHistoryRepository : IWorkHourHistoryRepository
    {

        RASContext _RASContext;


        public WorkHourHistoryRepository(RASContext rasContext)
        {
            if (rasContext == null)
            {
                throw new Exception("RAS Context can not be null.");
            }
            _RASContext = rasContext;
        }

        public void Add(WorkHourHistory history)
        {
            var entity = new WorkHourHistory();
            FillEntity(entity, history);
            entity.ID = Guid.NewGuid();
            _RASContext.WorkHourHistories.Add(entity);
        }


        public void Delete(Guid historyID)
        {
            var workhourhistory = _RASContext.WorkHourHistories.First(x => x.ID == historyID);
            _RASContext.WorkHourHistories.Remove(workhourhistory);
        }

        public IEnumerable< WorkHourHistory> GetByWorkHourId(Guid workHourId)
        {
            return _RASContext.WorkHourHistories.Where(x => x.WorkHourID == workHourId);
        }
        public void Edit(WorkHourHistory history)
        {
            var workhourhistory = _RASContext.WorkHourHistories.First(x => x.ID == history.ID);
            FillEntity(workhourhistory, history);
        }

        public IEnumerable<WorkHourHistory> GetAll()
        {
            return DefaultQuery();
        }

        public WorkHourHistory GetByID(Guid HistoryID)
        {
            return DefaultQuery().First(x => x.ID == HistoryID);
        }

        public bool IsExistById(Guid historyID)
        {
            throw new NotImplementedException();
        }




        private void FillEntity(WorkHourHistory obj, WorkHourHistory entity)
        {
            obj.ID = entity.ID;
            obj.ManagerID = entity.ManagerID;
            obj.WorkHourID = entity.WorkHourID;
            obj.StageID = entity.StageID;
            obj.Description = entity.Description;
            obj.Date = entity.Date;
            obj.Action = entity.Action;

        }

        public IEnumerable<WorkHourHistory> GetByWorkHourID(Guid workHourId)
        {
            return DefaultQuery().Where(x => x.WorkHourID == workHourId);
        }
        private IQueryable<WorkHourHistory> DefaultQuery()
        {
            return _RASContext.WorkHourHistories
                .Include(x => x.Manager)
                .Include(y => y.Stage)
                .Include(z => z.WorkHuor);
        }
    }
}
