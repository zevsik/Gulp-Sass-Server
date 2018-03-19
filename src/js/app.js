'use strict';

$(function () {

  // Init swipe-menu
  $(window).load(function(){
    $("[data-toggle]").click(function() {
      var toggle_el = $(this).data("toggle");
      $(toggle_el).toggleClass("open-sidebar");
    });
    $(".swipe-area").swipe({
      swipeStatus:function(event, phase, direction, distance, duration, fingers)
      {
        if (phase=="move" && direction =="right") {
          $(".swipe-area__wrapper").addClass("open-sidebar");
          return false;
        }
        if (phase=="move" && direction =="left") {
          $(".swipe-area__wrapper").removeClass("open-sidebar");
          return false;
        }
      }
    });
  });
});
