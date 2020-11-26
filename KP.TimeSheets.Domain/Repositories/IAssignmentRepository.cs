using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public interface IAssignmentRepository
    {

        /// <summary>
        /// بدست آوردن تمامی انتساب ها
        /// </summary>
        /// <returns>شئی قابل شمارش از انتساب ها</returns>
        IEnumerable<Assignment> GetAll();

        /// <summary>
        /// بازیابی براساس شناسه پروژه ها 
        /// </summary>
        /// <param name="projectIds"></param>
        /// <returns></returns>
        IEnumerable<Assignment> GetByProjectIDs(IEnumerable<Guid> projectIds);

        /// <summary>
        /// بدست آوردن انتساب بر اساس شناسه آن
        /// </summary>
        /// <param name="assignmentID">شناسه انتساب</param>
        /// <returns>انتسابی که در بررسی پایگاه داده بدست می آید.</returns>
        Assignment GetByID(Guid assignmentID);

        /// <summary>
        /// اضافه کردن انتساب جدید به پایگاه داده
        /// </summary>
        /// <param name="assignment">موجودیت مرتبط با انتساب جدید</param>
        void Add(Assignment assignment);

        /// <summary>
        /// بروزرسانی انتساب
        /// </summary>
        /// <param name="assignment">موجودیت مرتبط با انتساب</param>
        void Edit(Assignment assignment);

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="assignmentID">شناسه انتساب</param>
        void Delete(Guid assignmentID);

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="assignmentID">شناسه انتساب</param>
        /// <returns></returns>
        bool IsExistById(Guid assignmentID);

    }
}
