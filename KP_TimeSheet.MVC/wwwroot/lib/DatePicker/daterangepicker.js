$(document).ready(function () {
    var night;
    var isRtl = true;
    var dateFormat = isRtl ? 'jYYYY/jMM/jDD' : 'YYYY/MM/DD';
    var dateFrom = false ? moment("") : undefined;
    var dateTo = false ? moment("") : undefined;
    var $dateRanger = $("#dateRangePicker");

    $dateRanger.daterangepicker({
        clearLabel: 'Clear',
        autoUpdateInput: !!(dateFrom && dateTo),
        minDate: moment(),
        autoApply: true,
        opens: isRtl ? 'left' : 'right',
        locale: {
            separator: ' - ',
            format: dateFormat
        },
        startDate: dateFrom,
        endDate: dateTo,
        jalaali: isRtl,
        showDropdowns: true
    }).on('apply.daterangepicker', function (ev, picker) {
        night = picker.endDate.diff(picker.startDate, 'days');
        if (night > 0) {
            $(this).val(picker.startDate.format(dateFormat));
            $('#dateRangePickerEnd').val(picker.endDate.format(dateFormat));
        } else {
            $(this).val('')
        }
    });


    $('.ga-datepicker').daterangepicker({
        clearLabel: 'Clear',
        // autoUpdateInput: !!(dateFrom && dateTo),
        //minDate: moment(),
        autoApply: true,
        opens: 'right',
        singleDatePicker: true,
        showDropdowns: true,
        language: 'en'
    }).on('apply.daterangepicker', function () {
        $('.tooltip').hide();
        $('.date-select').text($(this).val());
    });

    $('.jalali-datepicker').daterangepicker({
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

    $(document).on('mouseover', '.daterangepicker .calendar td', function () {
        var gagDate = $(this).attr('data-original-title');
        $('.date-hover').text('');
        $('.date-hover').text(gagDate);

        $('[data-toggle="tooltip"]').tooltip()
    });

});