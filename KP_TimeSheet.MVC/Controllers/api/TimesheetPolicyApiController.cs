using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using KP.TimeSheets.Domain;
using KP.TimeSheets.MVC.ViewModels;
using KP.TimeSheets.Persistance;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace KP.TimeSheets.MVC
{
    [Microsoft.AspNetCore.Mvc.Route("api/timesheetPlicy")]
    [ApiController]
    public class TimeSheetPolicyApiController : MyBaseAPIController
    {
        IUnitOfWork _uow;
        public TimeSheetPolicyApiController(RASContext db, IUnitOfWork uow) : base(db) { this._uow = uow; }


        [HttpGet("{ver}/[action]")]
        [ProducesResponseType(typeof(List<vmTimesheetPolicy>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetDefaultPoliciesList(string ver)
        {
            try
            {
                if (!this.MainChecks(ver, out string error)) throw new Exception(error);

                var now = DateTime.Now.Date;
                var answer = this.DBContext.TimesheetPolicies
                            .Where(p => p.IsDefault && p.Validity.Date >= now && p.UserId.HasValue)
                            .OrderBy(p => p.User.UserTitle)
                            .Select(p => new
                            {
                                p.Id,
                                p.isDeactivated,
                                p.IsOpen,
                                p.Start,
                                p.Finish,
                                p.User.UserTitle,
                                p.UserId,
                                p.Validity,
                                p.UserMustHasHozoor,
                                p.CreateDate
                            }).ToList().Select(p => new vmTimesheetPolicy
                            {
                                id = p.Id,
                                finish = DateUtility.GetPersianDate(p.Finish),
                                isDeactivated = p.isDeactivated,
                                createDate = DateUtility.GetPersianDate(p.CreateDate),
                                isOpen = p.IsOpen,
                                start = DateUtility.GetPersianDate(p.Start),
                                userId = p.UserId,
                                userTitle = p.UserTitle,
                                userMustHasHozoor = p.UserMustHasHozoor,
                                validity = DateUtility.GetPersianDate(p.Validity)
                            });


                return Ok(answer);
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در دریافت اطلاعات قانون های اصلی سیستم");
            }
        }

        [HttpGet("{ver}/[action]")]
        [ProducesResponseType(typeof(List<vmTimesheetPolicy>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetOtherPoliciesList(string ver)
        {
            try
            {
                if (!this.MainChecks(ver, out string error)) throw new Exception(error);

                var now = DateTime.Now.Date;
                var answer = this.DBContext.TimesheetPolicies
                            .Where(p => !p.IsDefault && p.Validity.Date >= now && p.UserId.HasValue)
                            .OrderByDescending(p => p.CreateDate)
                            .Select(p => new
                            {
                                p.Id,
                                p.isDeactivated,
                                p.IsOpen,
                                p.Start,
                                p.Finish,
                                p.User.UserTitle,
                                p.UserId,
                                p.Validity,
                                p.UserMustHasHozoor,
                                p.CreateDate
                            }).ToList().Select(p => new vmTimesheetPolicy
                            {
                                id = p.Id,
                                finish = DateUtility.GetPersianDate(p.Finish),
                                isDeactivated = p.isDeactivated,
                                createDate = DateUtility.GetPersianDate(p.CreateDate) + " " + p.CreateDate.Hour.ToString("00") + ":" + p.CreateDate.Minute.ToString("00"),
                                isOpen = p.IsOpen,
                                start = DateUtility.GetPersianDate(p.Start),
                                userId = p.UserId,
                                userTitle = p.UserTitle,
                                userMustHasHozoor = p.UserMustHasHozoor,
                                validity = DateUtility.GetPersianDate(p.Validity)
                            });
                return Ok(answer);
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در دریافت اطلاعات سایر قانون های سیستم");
            }
        }


        [HttpPost("[action]")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult SaveEditPolicy(vmTimesheetPolicy request)
        {
            try
            {
                if (request == null) throw new Exception("اطلاعات ارسال نشده است");
                if (string.IsNullOrEmpty(request.start)) throw new Exception("تاریخ شروع باید وارد شده باشد");
                if (string.IsNullOrEmpty(request.finish)) throw new Exception("تاریخ پایان باید وارد شده باشد");
                if (string.IsNullOrEmpty(request.validity)) throw new Exception("تاریخ اعتبار باید وارد شده باشد");

                if (!request.userId.HasValue) throw new Exception("انتخاب کاربر ضروری است");

                TimesheetPolicy policy = null;

                if (request.id == Guid.Empty)
                {
                    policy = new TimesheetPolicy()
                    {
                        Id = Guid.NewGuid(),
                        IsDefault = false
                    };
                    this.DBContext.TimesheetPolicies.Add(policy);
                }
                else
                {
                    policy = this.DBContext.TimesheetPolicies.FirstOrDefault(p => p.Id == request.id);
                    if (policy == null) throw new Exception("قانون با آی دی خواسته شده یافت نشد");
                }


                policy.CreateDate = DateTime.Now;
                policy.isDeactivated = request.isDeactivated;

                policy.UserMustHasHozoor = request.userMustHasHozoor;
                policy.IsOpen = request.isOpen;

                if (policy.IsDefault)
                {
                    this.DBContext.SaveChanges();
                    return Ok(true);//قانون اصلی را فقط می توان غیر فعال کرد
                }



                policy.Start = DateUtility.GetMiladiDate(request.start);
                policy.Finish = DateUtility.GetMiladiDate(request.finish);
                policy.Validity = DateUtility.GetMiladiDate(request.validity);

                if (policy.Start > policy.Finish) throw new Exception("تاریخ شروع نمی تواند بزرگتر از تاریخ پایان باشد");
                if (policy.Validity.Date < DateTime.Now.Date) throw new Exception("تاریخ اعتبار نمی تواند کوچکتر از امروز باشد");


                policy.UserId = request.userId;


                this.DBContext.SaveChanges();

                return Ok(true);
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در ثبت قانون جدید");
            }
        }


        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult DeletePolicy(Guid id)
        {
            try
            {
                var policy = this.DBContext.TimesheetPolicies.FirstOrDefault(p => p.Id == id);
                if(policy == null) throw new Exception("قانون با آی دی ارسال شده یافت نشد");
                if(policy.IsDefault) throw new Exception("امکان حذف قانون پیش فرض نیست");

                this.DBContext.Entry(policy).State=EntityState.Deleted;
                this.DBContext.SaveChanges();

                return Ok(true);
            }
            catch (Exception ex)
            {
                return this.ReturnError(ex, "خطا در ثبت قانون جدید");
            }
        }



    }
}