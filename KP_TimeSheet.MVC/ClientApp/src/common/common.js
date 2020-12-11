const common = (function () {
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
			message: "<strong >" + messege + "</strong>",
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

	function loaderShow() {
		$("#Loader").fadeIn(500);
	}

	function loaderHide() {
		$("#Loader").fadeOut(500);
	}


	function adjustSize() {
		// For small screens, maximize the window when it is shown.
		// You can also make the check again in $(window).resize if you want to
		// but you will have to change the way to reference the widget and then
		// to use $("#theWindow").data("kendoWindow").
		// Alternatively, you may want to .center() the window.

		if ($(window).width() < 800 || $(window).height() < 600) {
			this.maximize();
		}
	}

	return {
		loaderShow: loaderShow,
		loaderHide: loaderHide,
		Notify: notify,
		DoExport: doExport,
		adjustSize: adjustSize

	};

})();


module.exports = {
	'loaderShow': common.loaderShow,
	'loaderHide': common.loaderHide,
	'notify': common.Notify,
	'doExport': common.DoExport,
	'adjustSize': common.adjustSize
};
