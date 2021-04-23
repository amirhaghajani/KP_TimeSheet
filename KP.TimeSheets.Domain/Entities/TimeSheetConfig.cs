using System;

namespace KP.TimeSheets.Domain
{
    public class TimeSheetConfig
    {
        public int Id { get; set; }
        ///از این تاریخ به قبل کسی نمی تونه چیزی وارد کن
        public DateTime TimeSheetLockDate { get; set; }

        public int DefualtOpenTimeSheetWeeks { get; set; }

    }
}