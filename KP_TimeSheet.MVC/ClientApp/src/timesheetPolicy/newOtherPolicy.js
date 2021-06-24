
var newOtherPolicy = (function () {

    const moduleData = {};

    moduleData.currentItem = null;

    function init(common, service, refreshParentFn) {

        moduleData.common = common;
        moduleData.service = service;
        moduleData.refreshParentFn = refreshParentFn;

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
        if (!moduleData.currentItem) return;

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
        }).off().on('apply.daterangepicker', function () {
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
        }).off().on('apply.daterangepicker', function () {
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
        }).off().on('apply.daterangepicker', function () {
            $('.tooltip').hide();
            $('.date-select').text($(this).val());
        });
    }


    //----------------------
    function deletePolicy(policy) {
        
        moduleData.common.loaderShow();
        moduleData.service.deletePolicy(policy.id, () => {
            moduleData.common.loaderHide();
            moduleData.common.notify("حذف با موفقیت انجام شد", "success");
            private_closeWindow();

            moduleData.refreshParentFn();
        });

    }


    function savePolicyDeactivation(data, isDeactivated) {
        data.isDeactivated = isDeactivated ? "true" : "false";
        private_savePolicy(data, false);
    }
    function savePolicyIsOpen(data, isOpen) {
        data.isOpen = isOpen ? "true" : "false";
        private_savePolicy(data, false);
    }
    function savePolicyUserMustHasHozoor(data, userMustHasHozoor) {
        data.userMustHasHozoor = userMustHasHozoor ? "true" : "false";
        private_savePolicy(data, false);
    }


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

        if (!moduleData.currentItem) {
            moduleData.currentItem = { id: "00000000-0000-0000-0000-000000000000" };
        }

        var policy = {
            id: !moduleData.currentItem ? "00000000-0000-0000-0000-000000000000" : moduleData.currentItem.id,
            validity: $('#otherPolicy_dateValidicy').val(),
            start: $('#otherPolicy_dateStart').val(),
            finish: $("#otherPolicy_dateFinish").val(),
            userId: $("#otherPolicy_selectUser").data("kendoDropDownList").value(),
            isOpen: $('#otherPolicy_checkIsOpen').is(':checked'),
            userMustHasHozoor: $('#otherPolicy_checkMustHaveHozoor').is(':checked'),
        };

        if (private_checkUserInputData(policy)) return;


        private_sendSaveDataToServer(policy, moduleData.refreshParentFn);

    }

    function private_savePolicy(policy, wantRefresh) {
        var data = {
            id: policy.id,
            validity: policy.validity,
            start: policy.start,
            finish: policy.finish,
            userId: policy.userId,
            isOpen: policy.isOpen == "true",
            userMustHasHozoor: policy.userMustHasHozoor == "true",
            isDeactivated: policy.isDeactivated == "true"
        };

        private_sendSaveDataToServer(data, (wantRefresh ? moduleData.refreshParentFn : null));
    }

    function private_checkUserInputData(policy) {

        var hasError = false;

        if (!policy.userId) {
            hasError = true;
            $("span[for='otherPolicy_selectUser']").text("انتخاب کاربر ضروری است");
        }

        if (!policy.start) {
            hasError = true;
            $("span[for='otherPolicy_dateStart']").text("انتخاب تاریخ شروع ضروری است");
        }

        if (!policy.finish) {
            hasError = true;
            $("span[for='otherPolicy_dateFinish']").text("انتخاب تاریخ پایان ضروری است");
        }

        if (!policy.validity) {
            hasError = true;
            $("span[for='otherPolicy_dateValidicy']").text("انتخاب تاریخ اعتبار ضروری است");
        }

        return hasError;
    }

    function private_sendSaveDataToServer(data, afterSuccCallbackFn) {
        moduleData.common.loaderShow();
        moduleData.service.savePolicy(data, () => {
            moduleData.common.loaderHide();
            moduleData.common.notify("ثبت با موفقیت انجام شد", "success");
            private_closeWindow();

            if (afterSuccCallbackFn) afterSuccCallbackFn();
        });
    }


    return {
        init: init,
        openNewOtherPolicyWindow: openNewOtherPolicyWindow,
        editPolicy: editPolicy,
        deletePolicy: deletePolicy,
        savePolicyDeactivation: savePolicyDeactivation,
        savePolicyIsOpen: savePolicyIsOpen,
        savePolicyUserMustHasHozoor: savePolicyUserMustHasHozoor
    };

})();



module.exports = {
    init: newOtherPolicy.init,
    openNewOtherPolicyWindow: newOtherPolicy.openNewOtherPolicyWindow,
    editPolicy: newOtherPolicy.editPolicy,
    deletePolicy: newOtherPolicy.deletePolicy,
    savePolicyDeactivation: newOtherPolicy.savePolicyDeactivation,
    savePolicyIsOpen : newOtherPolicy.savePolicyIsOpen,
    savePolicyUserMustHasHozoor : newOtherPolicy.savePolicyUserMustHasHozoor
}