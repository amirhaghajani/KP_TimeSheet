
function doExport(selector, params) {
    var options = {
        //ignoreRow: [1,11,12,-2],
        //ignoreColumn: [0,-1],
        tableName: 'Countries',
        worksheetName: 'Countries by population'
    };

    $.extend(true, options, params);

    $(selector).tableExport(options);
}

function notify(messege, type) {
   
    
    $.notify({
        //icon: 'glyphicon glyphicon-warning-sign',
        //title: 'Bootstrap notify',
        message:"<strong >"+ messege +"</strong>",
        //url: 'https://github.com/mouse0270/bootstrap-notify',
        //target: '_blank'
    }, {
            // settings
            //element: 'body',
            //position: null,
            type: type,
            allow_dismiss: false,
            //newest_on_top: false,
            //showProgressbar: true,
            placement: {
                from: "top",
                align: "left"
            },
            offset: 20,
            spacing: 10,
            z_index: 10100,
            delay: 1000,
            timer: 1000,
            //url_target: '_blank',
            //mouse_over: null,
            animate: {
                enter: 'animated fadeInDown',
               exit: 'animated fadeOutUp'
           },
            //onShow: null,
            //onShown: null,
            //onClose: null,
            //onClosed: null,
            //icon_type: 'class',
           // template: "<div style='height:15px;width:20%' class='shadow' >" + messege + "</div>"
        });
    }

module.exports = {
    'LoaderShow': function () {
        $("#Loader").fadeIn(500);
    },
    'LoaderHide':function(){
        $("#Loader").fadeOut(500);
    },
    'Notify':notify,
    'doExport':doExport
};
