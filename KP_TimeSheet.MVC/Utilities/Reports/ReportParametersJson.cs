﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace KP.TimeSheets.MVC
{
    public class ReportParametersJson
    {

        [Display(Name = "از تاریخ")]
        [DataType(DataType.Text)]
        [Required(ErrorMessage ="کاربر عزیز شما تاریخ شروع را انتخاب نکرده اید")]
        public string FromDate { get; set; }


        [Display(Name = "تا تاریخ")]
        [DataType(DataType.Text)]
        [Required(ErrorMessage = "کاربر عزیز شما تاریخ پایان را انتخاب نکرده اید")]
        public string ToDate { get; set; }


        [Display(Name = "انتخاب پروژه")]
        [Required(ErrorMessage = "کاربر عزیز شما پروژه ای انتخاب نکرده اید ")]
        public List<Guid> UserIds { get; set; }


        [Display(Name = "انتخاب پروژه ها")]
        [Required(ErrorMessage = "کاربر عزیز شما پروژه ای انتخاب نکرده اید")]
        public List<Guid> ProjetIds { get; set; }
    }
}