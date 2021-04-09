

function removeAndRecreateTreelisDiv() {
    $("#ktrlTimeSheets").data("kendoTreeList").destroy();
    $("#ktrlTimeSheets").remove();
    $("#KTLContainer").append("<div id='ktrlTimeSheets'></div>");
}



module.exports={
    'removeAndRecreateTreelisDiv':removeAndRecreateTreelisDiv
}