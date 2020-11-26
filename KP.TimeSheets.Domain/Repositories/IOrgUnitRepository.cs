using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public interface IOrgUnitRepository
    {

        /// <summary>
        /// بدست آوردن تمامی واحد های سازمانی
        /// </summary>
        /// <returns>شئی قابل شمارش از واحدهای سازمانی</returns>
        IEnumerable<OrganizationUnit> GetAll();

        /// <summary>
        /// بدست آوردن واحد سازمانی بر اساس شناسه آن
        /// </summary>
        /// <param name="orgUnitID">شناسه واحد سازمانی</param>
        /// <returns>واحد سازمانی که در بررسی پایگاه داده بدست می آید.</returns>
        OrganizationUnit GetByID(Guid orgUnitID);

        /// <summary>
        /// بازیابی واحد سازمانی براساس شناسه مدیر پروژه 
        /// </summary>
        /// <param name="managerId"></param>
        /// <returns></returns>
        IEnumerable<OrganizationUnit> GetByManagerID(Guid managerId);

        /// <summary>
        /// اضافه کردن واحد سازمانی جدید به پایگاه داده
        /// </summary>
        /// <param name="entity">موجودیت مرتبط با واحد سازمانی جدید</param>
        void Add(OrganizationUnit entity);

        /// <summary>
        /// حذف از پایگاه داده
        /// </summary>
        /// <param name="orgUnitID"></param>
        void Delete(Guid orgUnitID);

        /// <summary>
        /// واکشی یک واحد سازمانی برای ویرایش
        /// </summary>
        /// <param name="orgUnit"></param>
        void Edit(OrganizationUnit orgUnit);

        /// <summary>
        /// آیا شناسه وجود دارد یا خیر
        /// </summary>
        /// <param name="orgUnitID">شناسه واحد سازمانی</param>
        /// <returns></returns>
        bool IsExistById(Guid orgUnitID);

        
    }
}
