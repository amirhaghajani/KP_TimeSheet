
var service = (function () {

    const moduleData = {};

    function init(common) {

        moduleData.common = common;

        $('#otherPolicy_btnCancel').off().on('click', function () {
			private_closeWindow();
		});

		$('#otherPolicy_btnSave').off().on('click', function () {
			save();
		});

    }

    function private_closeWindow() {
		var w = $("#WNDEditAndAddOtherPolicy").data("kendoWindow");
		if (w) w.close();
		reset();
	}

    function openNewOtherPolicyWindow() {

        $("#otherPolicy_headerDiv").text("ثبت قانون تایم شیت");

        moduleData.common.openWindow('WNDEditAndAddOtherPolicy', () => {
            private_setDatePickers();
            private_initSelectUserCombobox();
        });
    }

    function private_initSelectUserCombobox() {
        $("#otherPolicy_selectUser").kendoDropDownList({
            dataSource: {
                transport: {
                    read: "/api/LoadCalendar/GetAllUsers"
                },
                schema: {
                    model: {
                        id: "id"
                    }
                }
            },

            dataTextField: "fullName",
            dataValueField: "id",
            filter: "contains",
            optionLabel: "انتخاب کاربر...",
            
        });
    }


    function private_setDatePickers() {
        $('#otherPolicy_dateValidicy').daterangepicker({
            clearLabel: 'Clear',
            autoApply: true,
            opens: 'left',
            singleDatePicker: true,
            showDropdowns: true,
            jalaali: true,
            language: 'fa'
        }).on('apply.daterangepicker', function () {
            $('.tooltip').hide();
            $('.date-select').text($(this).val());
        });
        $('#otherPolicy_dateStart').daterangepicker({
            clearLabel: 'Clear',
            autoApply: true,
            opens: 'left',
            singleDatePicker: true,
            showDropdowns: true,
            jalaali: true,
            language: 'fa'
        }).on('apply.daterangepicker', function () {
            $('.tooltip').hide();
            $('.date-select').text($(this).val());
        });
        $('#otherPolicy_dateFinish').daterangepicker({
            clearLabel: 'Clear',
            autoApply: true,
            opens: 'left',
            singleDatePicker: true,
            showDropdowns: true,
            jalaali: true,
            language: 'fa'
        }).on('apply.daterangepicker', function () {
            $('.tooltip').hide();
            $('.date-select').text($(this).val());
        });
    }


    //----------------------
    function reset() {
		$('#otherPolicy_dateValidicy').val('');
		$('#otherPolicy_dateStart').val('');
        $('#otherPolicy_dateFinish').val('');

        $('#otherPolicy_checkIsOpen').prop('checked',true);
        $('#otherPolicy_checkMustHaveHozoor').prop('checked',true);
        
		var item = $("#otherPolicy_selectUser").data("kendoDropDownList");
		if (item && item.select) item.select(0);

		resetErrors();
	}
	function resetErrors() {
		//جایی که خطاها را نشان می دهد را پاک می کند
		$("span[for='otherPolicy_selectUser']").text("");
		$("span[for='otherPolicy_dateValidicy']").text("");
		$("span[for='otherPolicy_dateStart']").text("");
        $("span[for='otherPolicy_dateFinish']").text("");
	}


    return {
        init: init,
        openNewOtherPolicyWindow: openNewOtherPolicyWindow
    };

})();



module.exports = {
    init: service.init,
    openNewOtherPolicyWindow: service.openNewOtherPolicyWindow
}