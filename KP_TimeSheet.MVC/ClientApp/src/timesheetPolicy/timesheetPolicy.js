const common = require('../common/common');
const newOtherPolicy = require('./newOtherPolicy');

const otherPolicyGridId = "timesheetOtherPolicy_Grid";
let selectedItemPolicy = null;
let dialog = null;

$("document").ready(function () {

  init();
  newOtherPolicy.init(common);

});


function init() {
  dialog = $("#dialog");

  private_intiTabs();
  private_initDefaultGrid();
  private_initOtherGrid();

  private_initConfirmDeleteDialog();
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

  $("#tabstrip").show().css({ paddingTop: '10px', paddingRight: '10px', paddingLeft: '10px', height: '100%' });

}

function private_initDefaultGrid() {

  $("#timesheetSystemDefualtPolicy_Grid").kendoGrid({
    dataSource: {
      transport: {
        read: "/api/timesheetPlicy/" + common.version() + "/GetDefaultPoliciesList"
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
          let answer = "<input type='checkbox' class='forFound_approveCheckbox'" + (dataItem.isDeactivated=="true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 60,
        filterable: false,
        sortable: false,
        editable: () => false
      },
      
      "userTitle",
      "start",
      "finish"
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
    ]
  });
}

function private_initOtherGrid() {

  $("#" + otherPolicyGridId).kendoGrid({
    dataSource: {
      transport: {
        read: "/api/timesheetPlicy/" + common.version() + "/GetOtherPoliciesList",
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
    columns: [{
      field: "isDeactivated",
      title: "غیر فعال",
      template: function (dataItem, b, c) {
        let answer = "<input type='checkbox' class='forFound_approveCheckbox'" + (dataItem.isDeactivated=="true" ? "checked" : "") + "/>";
        return answer;
      },
      width: 60,
      filterable: false,
      sortable: false,
      editable: () => false
    },
      "userTitle",
      "start",
      "finish",
    {
      title: "عملیات",
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
}

function private_deleteSelectedPolicy() {
  newOtherPolicy.deletePolicy(selectedItemPolicy);
}


