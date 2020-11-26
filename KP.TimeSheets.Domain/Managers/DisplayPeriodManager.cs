using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
   public class DisplayPeriodManager
    {
      

        private IUnitOfWork _UOW;
        public DisplayPeriodManager(IUnitOfWork unitOfWork)
        {
            _UOW = unitOfWork;
        }

        public DisplayPeriod GetByID(Guid id)
        {
            return _UOW.DisplayPeriodRepository.GetByID(id);
        }

        public DisplayPeriod GetDisplayPeriod(User user)
        {
           
         var   result = _UOW.DisplayPeriodRepository.GetByEpmloyeeID(user.ID);

            if (result == null)
            {
                DisplayPeriod obj = new DisplayPeriod()
                {
                    EmployeeID = user.ID,
                    ID = Guid.NewGuid(),
                    IsWeekly = true,
                };
                result = obj;
            }
            return result;
        }
        public void Save(DisplayPeriod displayPeriod)
        {
            if (_UOW.DisplayPeriodRepository.IsExistById(displayPeriod.ID))
                Edit(displayPeriod);
            else
                Add(displayPeriod);

            _UOW.SaveChanges();
        }


        void Add(DisplayPeriod entity)
        {
            _UOW.DisplayPeriodRepository.Add(entity);
        }

     public void Edit(DisplayPeriod entity)
        {
            _UOW.DisplayPeriodRepository.Edit(entity);
            _UOW.SaveChanges();
        }
    }
}
