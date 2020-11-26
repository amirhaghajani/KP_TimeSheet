using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KP.TimeSheets.Domain
{
    public interface IUserRepository
    {

        /// <summary>
        /// بدست آوردن تمامی کاربران
        /// </summary>
        /// <returns></returns>
        IEnumerable<User> GetAll();

        /// <summary>
        /// بدست آوردن یک کاربر با شناسه
        /// </summary>
        /// <returns></returns>
        User GetByID(Guid id);

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        User GetByUserName(string userName);

        /// <summary>
        /// اضافه کردن کاربر جدید به پایگاه داده
        /// </summary>
        /// <param name="user">موجودیت مرتبط با کاربر جدید</param>
        void Add(User user);

        /// <summary>
        /// بروزرسانی کردن کاربر در پایگاه داده
        /// </summary>
        /// <param name="user">موجودیت مرتبط با کاربر </param>
        void Edit(User user);

        /// <summary>
        /// بررسی اینکه آیا کاربر با شناسه مورد نظر وجود دارد
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        bool IsExistById(Guid id);

        void SetOrganUnitToUser(Guid? OrganId, Guid UserId);

        /// <summary>
        ///   با جدول کاربرانPWA وارد کردن / بروزرسانی منابع انسانی از پایگاه داده
        /// </summary>
        void Sync();

        IEnumerable<User> GetByOrganisationID(Guid? OrganId);
    }
}
