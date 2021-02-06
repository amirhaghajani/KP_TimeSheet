const { RefreshTimeSheet } = require("../registerTimeSheet/mainGrid");

const timeSheet = (function () {

  function timeSheet_Row(id, parentId, title, type, uid, values) {
    this.id = id;
    this.parentId = parentId;
    this.title = title;
    this.type = type;
    this.uid = uid;
    this.UID = uid;
    this.uuiidd = uid;
    this.values = values;
  }

  function timeSheet_Time(date, persianDate, persianDay, projects) {
    this.date = date;
    this.persianDate = persianDate;
    this.persianDay = persianDay;
    this.projects = projects;
  }
  timeSheet_Time.prototype.calcTime = function () {
    var sum = 0;
    for (var i = 0; i < this.projects.length; i++) {
      sum += this.projects[i].calcTime();
    }
    return sum;
  }


  function timeSheet_Prject(id, title, workouts) {
    this.id = id;
    this.title = title;
    this.workouts = workouts;
  }
  timeSheet_Prject.prototype.calcTime = function () {
    var sum = 0;
    for (var i = 0; i < this.workouts.length; i++) {
      sum += this.workouts[i].minutes;
    }
    return sum;
  }


  function timeSheet_Workout(id, title, minutes, state) {
    this.id = id;
    this.title = title;
    this.minutes = minutes;
    this.state = state;
  }

  function convertNumberToTime(mainNumber) {
    if (!mainNumber) return '0:00';

    var number = Math.abs(mainNumber);

    const hour = parseInt(number);
    const minut = Math.round((number - hour) * 60);
    return `${hour}:${minut > 9 ? minut : '0' + minut} ${mainNumber < 0 ? '-' : ''}`;
  }
  function convertMinutsToTime(mainNumber) {
    if (!mainNumber) return '0:00';

    var number = Math.abs(mainNumber);

    const hour = parseInt(number / 60);
    const minut = number - (hour * 60);
    return `${hour}:${minut > 9 ? minut : '0' + minut} ${mainNumber < 0 ? '-' : ''}`;
  }

  function convertClockTextToMinute(clock) {
    if (!clock) return 0;
    var array = clock.split(':');
    return array[0] * 60 + array[1] * 1;
  }



  function convertServerDataToTimeSheet_ForEmployee(response) {
    const data = [];

    const amaliat = new timeSheet_Row(0, null, "عملیات", "Amaliat", "11111111-d37d-4aa1-1000-e1f4a753bee5", []);
    data.push(amaliat);

    const hozoor = new timeSheet_Row(1, null, "حضور", "Hozoor", "22222222-d37d-4aa1-1001-e1f4a753bee5", []);
    data.push(hozoor);

    const hozoorDetail = new timeSheet_Row(2, 1, "جزئیات", "HozoorDetail", "33333333-d37d-4aa1-1002-e1f4a753bee5", []);
    data.push(hozoorDetail);


    //---------------------------------------------------
    const karkard = new timeSheet_Row(3, null, "کارکرد", "Karkard", "44444444-d37d-4aa1-1003-e1f4a753bee5", []);
    data.push(karkard);

    const diffHozoorKarkard = new timeSheet_Row(4, null, "اختلاف حضور و کارکرد", "Diff_Karkard_Hozoor", "55555555-d37d-4aa1-1004-e1f4a753bee5", []);
    data.push(diffHozoorKarkard);

    const projects = [];
    const times = private_findTimesAndProjects('work', response, hozoor, hozoorDetail, karkard, diffHozoorKarkard, projects, null);

    private_addProjectsAndTasksTimes(data, times, projects, 3,'Project', 'Workout');


    //-----------------------------------------------------------------------
    const notSendId = data.length;
    const karkard_notSend = new timeSheet_Row(notSendId, null, "ارسال نشده", "DontSend", "66666666-d37d-1001-0000-e1f4a753bee5", []);
    data.push(karkard_notSend);


    const projects_notSendByEmployee = [];
    const times_notSend = private_findTimesAndProjects('work', response, null, null, karkard_notSend, null, projects_notSendByEmployee, "Resource");

    if (projects_notSendByEmployee.length) {
      private_addProjectsAndTasksTimes(data, times_notSend, projects_notSendByEmployee, notSendId,'Project_NotSend', 'Workout_NotSend');
    } else data.pop();


    private_addTimesForAmaliat(hozoor, karkard_notSend, karkard, amaliat);


    // // // //--------------------------------------------------------------------------------
    // // // const onApprovingId = data.length;
    // // // const karkard_onApproving = new timeSheet_Row(onApprovingId, null, "در حال تایید", "OnApproving", "77777777-d37d-1001-0000-e1f4a753bee5", []);
    // // // data.push(karkard_onApproving);

    // // // const projects_approving = [];
    // // // const times_approve = private_findTimesAndProjects('work', response, null, null, karkard_onApproving, null, projects_approving, "Approving");

    // // // if(projects_approving.length){
    // // //     private_addProjectsAndTasksTimes(data, times_approve, projects_approving, onApprovingId, true);
    // // // }else data.pop();
    // // // //--------------------------------------------------------------------------------

    // // // const finalId = data.length;
    // // // const karkard_final = new timeSheet_Row(finalId, null, "تایید نهایی", "Final", "88888888-d37d-1001-0000-e1f4a753bee5", []);
    // // // data.push(karkard_final);

    // // // const projects_final = [];
    // // // const times_final = private_findTimesAndProjects('work', response, null, null, karkard_final, null, projects_final, "Final");

    // // // if(projects_final.length){
    // // //     private_addProjectsAndTasksTimes(data, times_final, projects_final, finalId, true);
    // // // }else data.pop();

    //---------------------------------------------------------------------------------

    const deniedId = data.length;
    const karkard_deny = new timeSheet_Row(deniedId, null, "رد شده", "Denied", "99999999-d37d-1001-0000-e1f4a753bee5", []);
    data.push(karkard_deny);

    const projects_deny = [];
    const times_deny = private_findTimesAndProjects('work', response, null, null, karkard_deny, null, projects_deny, "Denied");

    if (projects_deny.length) {
      private_addProjectsAndTasksTimes(data, times_deny, projects_deny, deniedId,'Project_Denied', 'Workout_Denied');
    } else data.pop();

    //---------------------------------------------------------------------------------


    const otherId = data.length;
    const karkard_other = new timeSheet_Row(otherId, null, "سایر", "Other", "10101010-d37d-1001-0000-e1f4a753bee5", []);
    data.push(karkard_other);

    const projects_other = [];
    const times_other = private_findTimesAndProjects('other', response, null, null, karkard_other, null, projects_other, null);

    if (projects_other.length) {
      private_addProjectsAndTasksTimes(data, times_other, projects_other, otherId,'Project_Other', 'Workout_Other');
    } else data.pop();

    //---------------------------------------------------------------------------------

    return data;
  }

  function private_addTimesForAmaliat(hozoor, noSend, mainKarkard, amalit) {
    //سه تا دکمه بالا را مشخص می کنه که باشه یا نه

    for (let i = 0; i < hozoor.values.length; i++) {
      const hozoorTodayTime = hozoor.values[i];
      const nosendTodayTime = noSend.values[i];
      const mainKarkardTodayTime = mainKarkard.values[i];

      amalit.values.push({
        date: hozoorTodayTime.date,
        persianDate: hozoorTodayTime.persianDate,
        persianDay: hozoorTodayTime.persianDay,
        title: hozoorTodayTime.persianDate,
        value: { isOpen: hozoorTodayTime.isOpen, has_NotSendData: !!nosendTodayTime.minute, hasKarkard: !!mainKarkardTodayTime.minute }
      });
    }
  }

  function convertServerDataToTimeSheet_ForApprove(response) {
    const data = [];

    const amaliat = new timeSheet_Row(0, null, "عملیات", "Amaliat", "eb96abcb-d37d-0000-1000-e1f4a753bee5", []);
    data.push(amaliat);

    const hozoor = new timeSheet_Row(1, null, "حضور", "-", "eb96abcb-d37d-4aa1-1000-e1f4a753bee5", []);
    data.push(hozoor);

    const hozoorDetail = new timeSheet_Row(2, 1, "جزئیات", "-", "eb96abcb-d37d-4aa1-1001-e1f4a753bee5", []);
    data.push(hozoorDetail);

    const karkard = new timeSheet_Row(3, null, "کارکرد", "-", "eb96abcb-d37d-4aa1-1002-e1f4a753bee5", []);
    data.push(karkard);

    const projects = [];
    const times = private_findTimesAndProjects('work', response, hozoor, hozoorDetail, karkard, null, projects, null);

    private_addProjectsAndTasksTimes(data, times, projects, 3,'Project', 'Workout');

    //----------------------------------------------------------------------------
    const taeedNashodeId = data.length;
    const karkard_notApprove = new timeSheet_Row(taeedNashodeId, null, "تایید نشده", "-", "eb96abcb-d37d-1001-0000-e1f4a753bee5", []);
    data.push(karkard_notApprove);

    const projects_notApprove = [];
    const times_notApprove = private_findTimesAndProjects('work', response, null, null, karkard_notApprove, null, projects_notApprove, "TaskNotApprove");

    private_addProjectsAndTasksTimes(data, times_notApprove, projects_notApprove, taeedNashodeId,'Project_NotApprove', 'Workout_NotApprove');
    if (projects_notApprove.length) {
      for (let i = taeedNashodeId; i < data.length; i++) {
        data[i].has_NotApproveData = true;
      }
    }

    private_addTimesForAmaliat_approver(hozoorDetail, karkard_notApprove, amaliat);

    //----------------------------------------------------------------------------
    const otherId = data.length;
    const karkard_other = new timeSheet_Row(otherId, null, "سایر", "-", "eb96abcb-d37d-1005-0000-e1f4a753bee5", []);
    data.push(karkard_other);

    const projects_ohter = [];
    const times_other = private_findTimesAndProjects('ohter', response, null, null, karkard_other, null, projects_ohter, null);
    if (projects_ohter.length) {

      private_addProjectsAndTasksTimes(data, times_other, projects_ohter, otherId,'Project_Other', 'Workout_Other');



      //انتقال موارد تایید نشده که مستقیم زیرمجموعه سایر باشد
      const projectNotApprovedIndex = data.findIndex(p => p.parentId == otherId && p.title == 'TaskNotApprove');
      if (projectNotApprovedIndex > -1) {

        const projectNotApprovedId = data[projectNotApprovedIndex].id;

        //قسمت تایید نشده ها میخوام مستقیم زیرمجموعه سایر باشه چون به صورت قسمت، پروژه، تسک هستند اون پروژه را میخواهیم اینجا برداریم
        const subApproveProjects = data.filter(p => p.parentId == projectNotApprovedId);
        for (let i = 0; i < subApproveProjects.length; i++) {
          subApproveProjects[i].parentId = otherId;
          subApproveProjects[i].has_NotApproveData_Other = true;
        }
        data.splice(projectNotApprovedIndex, 1);

      }



      //عوض کردن عنوان موارد تایید شده
      const projectApprovedIndex = data.findIndex(p => p.parentId == otherId && p.title == 'Approved');
      if (projectApprovedIndex > -1) data[projectApprovedIndex].title = 'تایید شده';

    } else data.pop();


    return data;
  }

  function private_addTimesForAmaliat_approver(hozoor, notApprove, amalit) {
    //یک دکمه بالا صفحه را مشخص می کنه که باشه یا نه

    for (let i = 0; i < hozoor.values.length; i++) {
      const hozoorTodayTime = hozoor.values[i];
      const notApproveTodayTime = notApprove.values[i];

      amalit.values.push({
        date: hozoorTodayTime.date,
        persianDate: hozoorTodayTime.persianDate,
        persianDay: hozoorTodayTime.persianDay,
        title: hozoorTodayTime.persianDate,
        has_NotApproveData: !!notApproveTodayTime.minute
      });

    }
  }

  function private_addProjectsAndTasksTimes(data, times, projects, parentId, projectTypeTitle,taskTyepTitle) {

    if (projects.length == 0) return;

    const rowProjects = [];
    for (var i = 0; i < projects.length; i++) {
      const proj = projects[i];
      const pId = data.length;
      var p = new timeSheet_Row(pId, parentId, proj.title, projectTypeTitle? projectTypeTitle: "Project", proj.id, []);
      data.push(p);
      rowProjects.push(p);

      p.workouts = [];

      for (var j = 0; j < proj.workouts.length; j++) {
        const workout = proj.workouts[j];
        var w = new timeSheet_Row(data.length, pId, workout.title, taskTyepTitle ? taskTyepTitle : "Workout", workout.id, []);
        data.push(w);
        p.workouts.push(w)
      }
    }

    times.forEach(t => {

      rowProjects.forEach(r => {

        var i = t.projects.findIndex(p => r.uid == p.id);

        var newItem = {
          date: t.date,
          persianDate: t.persianDate,
          title: t.persianDate,
          value: convertMinutsToTime(0)
        };
        r.workouts.forEach(w => {
          const newItemForW = { ...newItem };
          w.values.push(newItemForW);

          if (i > -1) {
            const f = t.projects[i].workouts.filter(ww => ww.id == w.uid);
            let sum = 0;
            for (var ii = 0; ii < f.length; ii++) {
              sum += f[ii].minutes;
            }
            newItemForW.value = convertMinutsToTime(sum);
          }

        })

        if (i > -1) {
          newItem.value = convertMinutsToTime(t.projects[i].calcTime());
        }

        r.values.push(newItem);

      });
    });
  }



  function private_findTimesAndProjects(type, response, hozoor, hozoorDetail, karkard, diffHozoorKarkard, projects, wantedState) {

    const times = [];

    for (let i = 0; i < response.length; i++) {
      const dbTime = response[i];
      const cTime = new timeSheet_Time(dbTime.date, dbTime.date_persian, dbTime.day_persian, []);
      times.push(cTime);

      const dbProjects = type == "work" ? dbTime.projects : dbTime.others;

      for (let j = 0; j < dbProjects.length; j++) {
        const dbProject = dbProjects[j];
        const cProject = new timeSheet_Prject(dbProject.id, dbProject.title, []);


        let pIndex = projects.findIndex(p => p.id == cProject.id);
        let savedProject;
        let isNewSavedProject = false;
        if (pIndex == -1) {
          savedProject = { id: cProject.id, title: cProject.title, workouts: [] };
          isNewSavedProject = true;
        } else {
          savedProject = projects[pIndex];
        }

        for (let k = 0; k < dbProject.workouts.length; k++) {
          const dbWorkout = dbProject.workouts[k];

          if (wantedState && dbWorkout.state != wantedState) continue;

          let sumMinutes = dbWorkout.minutes;

          // for (let k2 = k + 1; k2 < dbProject.workouts.length; k2++) {
          //     const dbWorkout2 = dbProject.workouts[k2];
          //     if (dbWorkout2.id == dbWorkout.id && (!wantedState || cWorkout2.state == wantedState)) {
          //         sumMinutes += dbWorkout2.minutes;
          //     }
          // }

          const cWorkout = new timeSheet_Workout(dbWorkout.id, dbWorkout.title, sumMinutes, dbWorkout.state);

          cProject.workouts.push(cWorkout);

          const index = savedProject.workouts.findIndex(p => p.id == cWorkout.id);
          if (index == -1) {
            savedProject.workouts.push({
              id: cWorkout.id, title: cWorkout.title, state: cWorkout.state, minutes: sumMinutes
            })
          } else {
            savedProject.workouts[index].minutes += sumMinutes;
          }
        }

        if (cProject.workouts.length > 0) {
          cTime.projects.push(cProject);
          if (isNewSavedProject) projects.push(savedProject);
        }

      }

      if (hozoor) hozoor.values.push({
        date: cTime.date,
        persianDate: cTime.persianDate,
        persianDay: cTime.persianDay,
        title: cTime.persianDate,
        value: convertMinutsToTime(dbTime.hozoor),
        minute: dbTime.hozoor,
        isOpen: dbTime.isOpen
      });
      if (hozoorDetail) hozoorDetail.values.push({
        date: cTime.date,
        persianDate: cTime.persianDate,
        persianDay: cTime.persianDay,
        title: cTime.persianDate,
        value: dbTime.dayTimeString ? dbTime.dayTimeString : '-',
      });
      if (karkard) karkard.values.push({
        date: cTime.date,
        persianDate: cTime.persianDate,
        persianDay: cTime.persianDay,
        title: cTime.persianDate,
        value: convertMinutsToTime(cTime.calcTime()),
        minute: cTime.calcTime()
      });
      if (diffHozoorKarkard) diffHozoorKarkard.values.push({
        date: cTime.date,
        persianDate: cTime.persianDate,
        persianDay: cTime.persianDay,
        title: cTime.persianDate,
        value: convertMinutsToTime(dbTime.hozoor - cTime.calcTime()),
        minute: dbTime.hozoor - cTime.calcTime()
      });
    }

    return times;
  }

  function calcPercent(inputs, wanted) {

    if (wanted < 0) return 0;

    var max = 0;

    for (var k in inputs) {
      if (inputs[k] > max) max = inputs[k];
    }

    if (max < 6000) max = 6000;

    return 100 * wanted / max;
  }




  function foundExpandedTreeListTitle(treeList) {
    if (!treeList) return [];

    var rows = $("[aria-expanded=true]", treeList.tbody);

    var expandedRows = $.map(rows, function (row) {
      return $(row).children()[2].innerText;
    });

    return expandedRows;
  }
  function expandTreeListItems(treeList, expandedRowsTitle) {

    if (!treeList || !expandedRowsTitle || !expandedRowsTitle.length) return;

    var rows = $("tr.k-treelist-group", treeList.tbody);

    var co = 0;
    for (var k = 0; k < rows.length; k++) {
      var row = rows[k];
      if ($(row).children()[2] && $(row).children()[2].innerText == expandedRowsTitle[co]) {
        treeList.expand(row);
        co++;
        if (co >= expandedRowsTitle.length) break;
      }
    }

  }



  return {
    convertServerDataToTimeSheet_ForEmployee: convertServerDataToTimeSheet_ForEmployee,
    convertServerDataToTimeSheet_ForApprove: convertServerDataToTimeSheet_ForApprove,
    convertMinutsToTime: convertMinutsToTime,
    convertClockTextToMinute: convertClockTextToMinute,
    calcPercent: calcPercent,

    foundExpandedTreeListTitle: foundExpandedTreeListTitle,
    expandTreeListItems: expandTreeListItems
  }

})();

module.exports = {
  convertServerDataToTimeSheet_ForEmployee: timeSheet.convertServerDataToTimeSheet_ForEmployee,
  convertServerDataToTimeSheet_ForApprove: timeSheet.convertServerDataToTimeSheet_ForApprove,
  convertMinutsToTime: timeSheet.convertMinutsToTime,
  convertClockTextToMinute: timeSheet.convertClockTextToMinute,
  calcPercent: timeSheet.calcPercent,

  foundExpandedTreeListTitle: timeSheet.foundExpandedTreeListTitle,
  expandTreeListItems: timeSheet.expandTreeListItems
};