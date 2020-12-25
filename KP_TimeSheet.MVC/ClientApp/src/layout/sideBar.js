const common = require("../common/common");

const sideBar = (function () {

  function init() {
    $('#onclickOpenName').off().on('click', openNav);
    $('#div_ShowAndHideUserMenu').off().on('click', ShowAndHideUserMenu);

    $(".sidebar-dropdown > a").click(function () {

      $(".sidebar-submenu").slideUp(200);
      if (
        $(this)
          .parent()
          .hasClass("active")
      ) {
        $(".sidebar-dropdown").removeClass("active");
        $(this)
          .parent()
          .removeClass("active");
      } else {
        $(".sidebar-dropdown").removeClass("active");
        $(this)
          .next(".sidebar-submenu")
          .slideDown(200);
        $(this)
          .parent()
          .addClass("active");
      }
    });

    $("#close-sidebar").click(function () {
      $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function () {
      $(".page-wrapper").addClass("toggled");
    });

  }

  init();


  function openNav() {
    const marginRight = "-235px";

    if ($("#mySidebar").css('marginRight') == marginRight) {
      $(".panel-collapse").collapse("hide");
      $(".ras-sidebar-left-logo").fadeOut(100);
      $("#mySidebar").css({ "margin-right": "0px" });
      var width = $(window).width();
      $(".content-body").css({ "margin-right": "300px" });
      $('.content-body').css({ 'width': width - 300 + "px" });
      
      $(".menu-item span").show();

    } else {
      $(".ras-sidebar-left-logo").fadeIn(100);
      $('.panel-collapse').collapse('hide');
      var width = $(window).width();
      $("#mySidebar").css({ "margin-right": marginRight });
      $(".content-body").css({ "margin-right": "50px" });
      $('.content-body').css({ 'width': width - 50 + "px" });

      $(".menu-item span").hide();
    }
  }


  function ShowAndHideUserMenu() {
    if ($('.ras-dropdown-content').is(':visible')) {
      $(".ras-dropdown-content").fadeOut(300);
    } else {
      $(".ras-dropdown-content").fadeIn(300);
    }
  }





})();

