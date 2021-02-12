
var service = (function () {

    const moduleData = {};

    moduleData.currentItem = null;

    function init(common) {

        moduleData.common = common;

        $('#otherPolicy_btnCancel').off().on('click', function () {
            private_closeWindow();
        });

        $('#otherPolicy_btnSave').off().on('click', function () {
            save();
        });

    }

    function openNewOtherPolicyWindow() {

        $("#otherPolicy_headerDiv").text("ثبت قانون تایم شیت");
        moduleData.currentItem = null;

        moduleData.common.openWindow('WNDEditAndAddOtherPolicy', () => {
            private_setDatePickers();
            private_initSelectUserCombobox();
        }, () => reset());
    }

    function editPolicy(policy) {
        $("#otherPolicy_headerDiv").text("ویرایش قانون تایم شیت");

        moduleData.currentItem = policy;

        moduleData.common.openWindow('WNDEditAndAddOtherPolicy', () => {
            private_setDatePickers();
            private_initSelectUserCombobox();

            private_SetCurrentData(policy);

        }, () => reset());


    }

    function private_SetCurrentData(data) {

        $('#otherPolicy_dateValidicy').val(data.validity);
        $('#otherPolicy_dateStart').val(data.start);
        $('#otherPolicy_dateFinish').val(data.finish);


        $('#otherPolicy_checkIsOpen').prop('checked', data.isOpen == "true");
        $('#otherPolicy_checkMustHaveHozoor').prop('checked', data.userMustHasHozoor == "true");

        //user will set after get data from server
    }

    function deletePolicy(policy) {
        alert(JSON.stringify(policy));
    }

    function private_closeWindow() {
        var w = $("#WNDEditAndAddOtherPolicy").data("kendoWindow");
        if (w) w.close();
        reset();
    }



    function private_initSelectUserCombobox() {
        $("#otherPolicy_selectUser").kendoDropDownList({
            dataSource: {
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: "/api/LoadCalendar/GetAllUsers",
                            success: function (result) {
                                // notify the data source that the request succeeded
                                options.success(result);
                                private_afterGetAllUserFromServer();
                            },

                        });
                    }

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

    function private_afterGetAllUserFromServer() {
        if(!moduleData.currentItem) return;
        
        var dropdownlist = $("#otherPolicy_selectUser").data("kendoDropDownList");
        dropdownlist.select(function (dataItem) {
            return dataItem.id == moduleData.currentItem.userId;
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
        moduleData.currentItem = null;

        $('#otherPolicy_dateValidicy').val('');
        $('#otherPolicy_dateStart').val('');
        $('#otherPolicy_dateFinish').val('');

        $('#otherPolicy_checkIsOpen').prop('checked', true);
        $('#otherPolicy_checkMustHaveHozoor').prop('checked', true);

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

    function save() {

        resetErrors();

        var policy = {
            id: "00000000-0000-0000-0000-000000000000",
            validity: $('#otherPolicy_dateValidicy').val(),
            start: $('#otherPolicy_dateStart').val(),
            finish: $("#otherPolicy_dateFinish").val(),
            userId: $("#otherPolicy_selectUser").data("kendoDropDownList").value(),
            isOpen: $('#otherPolicy_checkIsOpen').is(':checked'),
            mustHaveHozoor: $('#otherPolicy_checkMustHaveHozoor').is(':checked'),
        };

        alert(JSON.stringify(policy));

    }


    return {
        init: init,
        openNewOtherPolicyWindow: openNewOtherPolicyWindow,
        editPolicy: editPolicy,
        deletePolicy: deletePolicy
    };

})();



module.exports = {
    init: service.init,
    openNewOtherPolicyWindow: service.openNewOtherPolicyWindow,
    editPolicy: service.editPolicy,
    deletePolicy: service.deletePolicy
}