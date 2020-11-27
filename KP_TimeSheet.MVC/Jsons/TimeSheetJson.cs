using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{ 
    public class TimeSheetJson
    {
        /// <summary>
        /// شناسه صحیح برگه زمانی
        /// </summary>
        public int id { get; set; }

        /// <summary>
        /// شناسه پدر برگه زمانی
        /// </summary>
        public int? parentId { get; set; }

        /// <summary>
        /// شناسه اصلی برگه زمانی
        /// </summary>
        public Guid UID { get; set; }

        /// <summary>
        /// عنوان برگه زمانی
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// مقادیر برگه زمانی
        /// </summary>
        public List<TimeSheetValueJson> Values { get; set; }

        /// <summary>
        /// نوع گزینه برگه زمانی
        /// </summary>
        ///<param>Defference نوع اختلاف </param>
        //////  Task نوع وظیفه 
        //////  SummaryTask نوع سامری وظیفه 
        //////  Project نوع پروژه 
        /////  Sent نوع ارسال 
        /////  Approve نوع ارسال 
        /////  Reject نوع ارسال 
        /////  TaskApprove
        /////  TaskNotApprove
        public string Type { get; set; }

    }


}