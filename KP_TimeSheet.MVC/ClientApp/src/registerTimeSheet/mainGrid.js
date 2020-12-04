const data=require('./data');
const saveWindow=require('./saveWindow');

function KTRColumn() {
  this.field = "";
  this.title = "";
  this.template = "";
  this.hidden = false;
  this.width = 40;
  this.headerTemplate = "";
  this.filterable = false;
};

function GetTimeSheets(callBackFn) {

  $.ajax({
    type: "Get",
    url: "/api/TimeSheetsAPI/GetTimeSheets",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: (response)=> ktrlTimeSheets_OnInit(response , callBackFn),
    error: function (e) {

    }
  });
}

function ktrlTimeSheets_OnInit(response, callBackFn) {

  data.timeSheetData_set(response);
  Init_TimeSheetTreeList();

  if(callBackFn) callBackFn();
  
}

function Init_TimeSheetTreeList() {
  var ktrlTSColumns = ktrlTimeSheets_OnInitColumns(data.timeSheetData_get());

  $("#ktrlTimeSheets").kendoTreeList({
    dataSource: {
      transport: {
        read: function (e) {
          e.success(data.timeSheetData_get());
        },
      }
    },
    schema: {
      model: {
        id: "id",
        parentId: "parentId"
      }
    },
    height: 400,
    columns: ktrlTSColumns,
    scrollable: true,
    selectable: true,
    dataBound: ktrlTimeSheets_DataBound
  });

  $("#ktrlTimeSheets").kendoTooltip({
    filter: 'td',
    content: function (e) {

      var treelist = $("#ktrlTimeSheets").data("kendoTreeList");
      var targetRow = $(e.target).closest('tr');
      var dataItem = treelist.dataItem(targetRow);
      return dataItem.title;
    }
  });
  $("#ktrlTimeSheets tbody").on("dblclick", "td", function (e) {
    var cell = $(e.currentTarget);
    var cellIndex = cell[0].cellIndex;
    var grid = $("#ktrlTimeSheets").data("kendoTreeList");
    var column = grid.columns[cellIndex];
    var dataItem = grid.dataItem(cell.closest("tr"));
    alert("Satr: " + dataItem.title + " - Sotoon: " + dataItem.values[cellIndex - 3].title);
  });



}

function ktrlTimeSheets_OnInitColumns(response) {
  var x = JSON.stringify(response);
  var columns = [];
  var colId = new KTRColumn();
  colId.field = "id";
  colId.title = "شناسه";
  colId.hidden = true;
  colId.width = 10;
  columns.push(colId);

  var colParentId = new KTRColumn();
  colParentId.field = "parentId";
  colParentId.title = "شناسه پدر";
  colParentId.hidden = true;
  colParentId.width = 10;
  columns.push(colParentId);

  var colTitle = new KTRColumn();

  colTitle.field = "title";
  colTitle.title = "عنوان";
  colTitle.hidden = false,

    colTitle.width = 150;
  columns.push(colTitle);

  for (var i = 0; i < response[0].values.length; i++) {

    var tsDate = response[0].values[i];
    var colDate = new KTRColumn();
    colDate.field = "values[" + i + "].value";
    colDate.format = "";
    colDate.title = tsDate.title;
    colDate.headerTemplate = "<h6> <b>" + tsDate.persianDate + "</b></h6>  <h6>" + tsDate.persianDay + "</h6>";
    colDate.hidden = false;
    colDate.width = 50;
    columns.push(colDate);
  }
  return columns;
}

function ktrlTimeSheets_DataBound(e) {

  var grid = this;
  var dataSource = grid.dataSource;
  //Loop through each record in a Kendo Grid
  $.each(grid.items(), function (index, item) {

    var tsRow = $("#ktrlTimeSheets").data('kendoTreeList').dataItem($(item).closest("tr"));
    if (tsRow.title === "عملیات") {

      $.each(item.children, function (childIdx, childElm) {
        var emlId = 'SaveWorkHours' + childIdx;
        var semlId = 'SendWorkHours' + childIdx;
        var sendId = 'ShowSent' + childIdx;

        if (childElm.innerText == "True True") {

          childElm.innerHTML = "<button title='ثبت ساعت کارکرد' id='" + emlId +
            "' class='btn btn-success btn-xs' style='width:10px;height:15px'" +
            " onclick='kwndSaveWHs_OnInit(\"" + emlId + "\")' dayIndex='" + childIdx + "' >+</button>";


          childElm.innerHTML = childElm.innerHTML + "<button title='ارسال ساعت کارکرد' id='" +
            semlId + "'  class='btn btn-warning btn-xs' style='width:10px;height:15px;margin-right:10px;'" +
            " onclick='wndSendWorkHour_OnInit(" + semlId + ")' dayIndex='" + childIdx + "' ><b>↑</b></button>";

          childElm.innerHTML = childElm.innerHTML + "<button title='نمایش کارکردهای این روز' id='" +
            sendId + "'  class='btn btn-info btn-xs' style='width:10px;height:15px;margin-right:10px;'" +
            " onclick='ShowCurrentDaySendWorkHours(" + sendId + ")' dayIndex='" +
            childIdx + "' ><i class='fa fa-tv'></i></button>";


        }

        if (childElm.innerText == "False False") {
          childElm.innerHTML = "<label title=' ' class='text-warning' ><i class='glyphicon glyphicon-ban-circle'></i> </label>"
        }

        if (childElm.innerText == "True False") {
          var emlId = 'SaveWorkHours' + childIdx;
          childElm.innerHTML = `<button title='ثبت ساعت کارکرد' id='${emlId}' 
                        class='btn btn-success btn-xs forFound_kwndSaveWHs_OnInit' style='width:10px;height:15px'
                         dayIndex='${childIdx}' data-eml-id='${emlId}'>+</button>`;

          childElm.innerHTML = childElm.innerHTML + `<button title='نمایش کارکردهای این روز' id='${sendId}'  
            class='btn btn-info btn-xs forFound_ShowCurrentDaySendWorkHours' style='width:10px;height:15px;margin-right:10px;' 
              data-send-id='"${sendId}"' dayIndex='${childIdx}' ><i class='fa fa-tv'></i></button>`;
        }


      });
    }
  });

  $('.forFound_kwndSaveWHs_OnInit').off().on('click', function () {
    var id = $(this).data("emlId");
    saveWindow.kwndSaveWHs_OnInit(id);
  });

  $('.forFound_ShowCurrentDaySendWorkHours').off().on('click',function(){
    var sendId = $(this).data("sendId");
    howCurrentDaySendWorkHours(sendId);
  });

}

module.exports = {

  'GetTimeSheets': GetTimeSheets

};