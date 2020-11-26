using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KP.TimeSheets.Domain
{
    public interface ITaskRepository
    {

        /// <summary>
        /// بدست آوردن تمامی فعالیت ها
        /// </summary>
        /// <returns>شئی قابل شمارش از فعالیت ها</returns>
        IEnumerable<Task> GetAll();

        /// <summary>
        /// بدست آوردن فعالیت بر اساس شناسه آن
        /// </summary>
        /// <param name="taskID">شناسه فعالیت</param>
        /// <returns>فعالیتی که در بررسی پایگاه داده بدست می آید.</returns>
        Task GetByID(Guid taskID);

        /// <summary>
        /// بدست آوردن فعالیت بر اساس پروژه
        /// </summary>
        /// <param name="project">شئی مرتبط با پروژه</param>
        /// <returns>فعالیت هایی که در بررسی پایگاه داده بدست می آید.</returns>
        IEnumerable<Task> GetByProject(Project project, User user=null);

        /// <summary>
        /// اضافه کردن فعالیت جدید به پایگاه داده
        /// </summary>
        /// <param name="task">موجودیت مرتبط با فعالیت جدید</param>
        void Add(Task task);

        /// <summary>
        /// بروزرسانی فعالیت
        /// </summary>
        /// <param name="task">موجودیت مرتبط با فعالیت</param>
        void Edit(Task task);

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="taskID">شناسه فعالیت</param>
        void Delete(Guid taskID);

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="taskID">شناسه فعالیت</param>
        /// <returns></returns>
        bool IsExistById(Guid taskID);

    }
}
