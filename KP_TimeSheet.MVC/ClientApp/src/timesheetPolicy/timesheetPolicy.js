const common = require('../common/common');
const newOtherPolicy = require('./newOtherPolicy');
const service = require('./service');

const mainPolicyGridId = "timesheetSystemDefualtPolicy_Grid";
const otherPolicyGridId = "timesheetOtherPolicy_Grid";
let selectedItemPolicy = null;
let dialog = null;

$("document").ready(function () {

  init();
  service.init(common);
  newOtherPolicy.init(common, service, refreshGrids);

});


function init() {
  dialog = $("#dialog");

  private_initTimeSheetMainConfig();

  private_intiTabs();
  private_initDefaultGrid();
  private_initOtherGrid();

  private_initConfirmDeleteDialog();
}

function private_initTimeSheetMainConfig() {

  service.getDefualtConfigData((conf)=>{
    if(!conf) return;

    $('#timesheetLockTime').daterangepicker({
      clearLabel: 'Clear',
      autoApply: true,
      opens: 'left',
      singleDatePicker: true,
      showDropdowns: true,
      jalaali: true,
      language: 'fa'
    }).off().on('apply.daterangepicker', function () {
      $('.tooltip').hide();
      $('.date-select').text($(this).val());
    });

    $("#timesheetLockTime").val(conf.timeSheetLockDate);
    $("#defualtOpenWeek").val(conf.defualtOpenTimeSheetWeeks);

  });

  $("#btnSaveDefualtConfig").off().on("click",()=>{
    var conf = {};
    conf.timeSheetLockDate = $("#timesheetLockTime").val();
    conf.defualtOpenTimeSheetWeeks = $("#defualtOpenWeek").val();

    if(!conf.timeSheetLockDate){
      alert("تاریخ قفل سیستم نمی تواند خالی باشد");
      return;
    }
    
    if(!conf.defualtOpenTimeSheetWeeks){
      alert("هفته پیش فرض نمی تواند خالی باشد");
      return;
    }


    service.saveDefualtConfigData(conf, ()=>{
      common.notify("ثبت تنظیمات پیش فرض با موفقیت انجام شد", "success");
    });



  });

}

function refreshGrids() {
  $("#" + mainPolicyGridId).data("kendoGrid").dataSource.read();
  $("#" + otherPolicyGridId).data("kendoGrid").dataSource.read();
}

function private_initConfirmDeleteDialog() {
  dialog.kendoDialog({
    title: false,
    closable: false,
    modal: false,
    content: "آیا از حذف این قانون اطمینان دارید؟",
    actions: [
      { text: 'بله', action: private_deleteSelectedPolicy },
      { text: 'خیر', primary: true }
    ],
  });
}

function private_intiTabs() {

  $("#tabstrip").kendoTabStrip({
    animation: {
      open: {
        effects: "fadeIn"
      }
    }
  });

  $("#tabstrip").show().css({ paddingTop: '40px', paddingRight: '10px', paddingLeft: '10px', height: '100%' });

}

function private_initDefaultGrid() {

  $("#" + mainPolicyGridId).kendoGrid({
    dataSource: {
      transport: {
        read: "/api/timesheetPlicy/" + common.version() + "/GetDefaultPoliciesList",
        cache: false
      },
      schema: {
        model: {
          fields: {
            id: { type: "string" },
            userTitle: { type: "string" },
            userId: { type: "string" },

            start: { type: "string" },
            finish: { type: "string" },
            validity: { type: "string" },

            isDeactivated: { type: "string" },
            isOpen: { type: "string" },
            userMustHasHozoor: { type: "string" },
          }
        }
      },
      pageSize: 20,
      serverPaging: false,
      serverFiltering: false,
      serverSorting: false
    },
    height: 550,
    filterable: true,
    sortable: true,
    pageable: false,
    columns: [
      {
        field: "isDeactivated",
        title: "غیر فعال",
        template: function (dataItem, b, c) {
          let answer = "<input type='checkbox' class='forFoundOnMainGrid_deactiveCheckbox'" + (dataItem.isDeactivated == "true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 60,
        filterable: false,
        sortable: false,
      },
      {
        field: "userTitle",
        title: "نام کاربر",
        filterable: true,
        sortable: true
      },
      {
        field: "validity",
        title: "تاریخ اعتبار",
        filterable: false,
        sortable: true
      },
      {
        field: "start",
        title: "تاریخ شروع",
        filterable: false,
        sortable: true
      },
      {
        field: "finish",
        title: "تاریخ پایان",
        filterable: false,
        sortable: true
      },

      {
        field: "isOpen",
        title: "باز است",
        template: function (dataItem, b, c) {
          let answer = "<input type='checkbox' class='forFoundOnMainGrid_isOpenCheckbox'" + (dataItem.isOpen == "true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 60,
        filterable: false,
        sortable: false,
      },
      {
        field: "userMustHasHozoor",
        title: "نیاز به حضور",
        template: function (dataItem, b, c) {
          let answer = "<input type='checkbox' class='forFoundOnMainGrid_userMustHasHozoorCheckbox'" + (dataItem.userMustHasHozoor == "true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 80,
        filterable: false,
        sortable: false,
      },

    ],
    dataBound: private_gridMainPolicyDataBound
  });
}

function private_initOtherGrid() {

  $("#" + otherPolicyGridId).kendoGrid({
    dataSource: {
      transport: {
        read: "/api/timesheetPlicy/" + common.version() + "/GetOtherPoliciesList",
        cache: false
      },
      schema: {
        model: {
          fields: {
            id: { type: "string" },
            userTitle: { type: "string" },
            userId: { type: "string" },

            start: { type: "string" },
            finish: { type: "string" },
            validity: { type: "string" },

            isDeactivated: { type: "string" },
            isOpen: { type: "string" },
            userMustHasHozoor: { type: "string" },
          }
        }
      },
      pageSize: 20,
      serverPaging: false,
      serverFiltering: false,
      serverSorting: false
    },
    toolbar: "<a class='btn btn-info' id='btnAddNewPolicy' >افزودن قانون جدید</a> ",
    height: 550,
    filterable: true,
    sortable: true,
    pageable: false,
    columns: [
      {
        field: "isDeactivated",
        title: "غیر فعال",
        template: function (dataItem, b, c) {
          let answer = "<input type='checkbox' class='forFound_deactiveCheckbox'" + (dataItem.isDeactivated == "true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 60,
        filterable: false,
        sortable: false,
        editable: () => false
      },
      {
        field: "userTitle",
        title: "نام کاربر",
        filterable: true,
        sortable: true
      },
      {
        field: "validity",
        title: "تاریخ اعتبار",
        filterable: false,
        sortable: true
      },
      {
        field: "start",
        title: "تاریخ شروع",
        filterable: false,
        sortable: true
      },
      {
        field: "finish",
        title: "تاریخ پایان",
        filterable: false,
        sortable: true
      },

      {
        field: "isOpen",
        title: "باز است",
        template: function (dataItem, b, c) {
          let answer = "<input type='checkbox' class='forFound_isOpenCheckbox'" + (dataItem.isOpen == "true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 60,
        filterable: false,
        sortable: false,
      },
      {
        field: "userMustHasHozoor",
        title: "نیاز به حضور",
        template: function (dataItem, b, c) {
          let answer = "<input type='checkbox' class='forFound_userMustHasHozoorCheckbox'" + (dataItem.userMustHasHozoor == "true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 90,
        filterable: false,
        sortable: false,
      },
      {
        title: "عملیات",
        width: 140,
        template: function (dataItem, b, c) {
          let answer = "<button type='button' style='margin-right:2px;' class='btn btn-success btn-sm forFound_EditPolicy'>ویرایش</button>";
          answer += "<button type='button' style='margin-right:2px;' class='btn btn-danger btn-sm forFound_DeletePolicy'>حذف</button>";
          return answer;
        }
      },
      // {
      //     field: "OrderDate",
      //     title: "Order Date",
      //     format: "{0:MM/dd/yyyy}"
      // }, {
      //     field: "ShipName",
      //     title: "Ship Name"
      // }, {
      //     field: "ShipCity",
      //     title: "Ship City"
      // }
    ],
    dataBound: private_gridOtherPolicyDataBound
  });

}

function private_gridMainPolicyDataBound() {

  $('.forFoundOnMainGrid_deactiveCheckbox').off().on('change', function () {
    var grid = $("#" + mainPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;

    newOtherPolicy.savePolicyDeactivation(dataItem, this.checked);
  });

  $('.forFoundOnMainGrid_isOpenCheckbox').off().on('change', function () {
    var grid = $("#" + mainPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;

    newOtherPolicy.savePolicyIsOpen(dataItem, this.checked);
  });

  $('.forFoundOnMainGrid_userMustHasHozoorCheckbox').off().on('change', function () {
    var grid = $("#" + mainPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;

    newOtherPolicy.savePolicyUserMustHasHozoor(dataItem, this.checked);
  });
}

function private_gridOtherPolicyDataBound() {
  $('#btnAddNewPolicy').off().on('click', () => newOtherPolicy.openNewOtherPolicyWindow());

  $('.forFound_EditPolicy').off().on('click', function () {
    var grid = $("#" + otherPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    newOtherPolicy.editPolicy(dataItem);
  });

  $('.forFound_DeletePolicy').off().on('click', function () {
    var grid = $("#" + otherPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;
    dialog.data("kendoDialog").open();
  });

  $('.forFound_deactiveCheckbox').off().on('change', function () {
    var grid = $("#" + otherPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;

    newOtherPolicy.savePolicyDeactivation(dataItem, this.checked);
  });

  $('.forFound_isOpenCheckbox').off().on('change', function () {
    var grid = $("#" + otherPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;

    newOtherPolicy.savePolicyIsOpen(dataItem, this.checked);
  });

  $('.forFound_userMustHasHozoorCheckbox').off().on('change', function () {
    var grid = $("#" + otherPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;

    newOtherPolicy.savePolicyUserMustHasHozoor(dataItem, this.checked);
  });
}

function private_deleteSelectedPolicy() {
  newOtherPolicy.deletePolicy(selectedItemPolicy);
}


