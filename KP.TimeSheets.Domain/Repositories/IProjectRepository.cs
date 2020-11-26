using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public interface IProjectRepository
    {

        /// <summary>
        /// بدست آوردن تمامی پروژه ها
        /// </summary>
        /// <returns>شئی قابل شمارش از پروژه ها</returns>
        IEnumerable<Project> GetAll();

        /// <summary>
        /// بدست آوردن پروژه بر اساس شناسه آن
        /// </summary>
        /// <param name="projectID">شناسه پروژه</param>
        /// <returns>پروزه ای که در بررسی پایگاه داده بدست می آید.</returns>
        Project GetByID(Guid projectID);

        /// <summary>
        /// بدست آوردن پروژه ها بر اساس کاربر 
        /// </summary>
        /// <param name="user">شئی کاربر</param>
        /// <returns>پروژه هایی که در بررسی پایگاه داده بدست می آید.</returns>
        IEnumerable<Project> GetByUser(User user);

        /// <summary>
        /// بازیابی پروژه ها براساس مدیر پروژه 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        IEnumerable<Project> GetByManagerID(Guid id);

        /// <summary>
        /// اضافه کردن پروژه جدید به پایگاه داده
        /// </summary>
        /// <param name="entity">موجودیت مرتبط با پروژه جدید</param>
        void Add(Project project);

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="projectID"></param>
        void Delete(Guid projectID);

        /// <summary>
        /// بروزرسانی پروژه
        /// </summary>
        /// <param name="project"></param>
        void Edit(Project project);

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="projectID">شناسه پروژه</param>
        /// <returns></returns>
        bool IsExistById(Guid projectID);

        /// <summary>
        /// وارد کردن داده های پروژه از PWA
        /// </summary>
        void Sync();
    }
}
