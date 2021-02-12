const common = require('../common/common');
const newOtherPolicy = require('./newOtherPolicy');

$("document").ready(function () {

  init();
  newOtherPolicy.init(common);

});


function init() {

  private_intiTabs();
  private_initDefaultGrid();
  private_initOtherGrid();

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

function private_initDefaultGrid(){

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
    columns: [{
      field: "isDeactivated",
      filterable: false
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

function private_initOtherGrid(){

  $("#timesheetOtherPolicy_Grid").kendoGrid({
    dataSource: {
      transport: {
        read: "/api/timesheetPlicy/" + common.version() + "/GetOtherPoliciesList"
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
      filterable: false
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
    ],
    dataBound: private_gridOtherPolicyDataBound
  });

}

function private_gridOtherPolicyDataBound(){
    $('#btnAddNewPolicy').off().on('click',()=> newOtherPolicy.openNewOtherPolicyWindow());
}
