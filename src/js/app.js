'use strict';

$(function () {

  // Init Swipe-menu
  $(window).load(function(){
    $("[data-toggle]").click(function() {
      var toggle_el = $(this).data("toggle");
      $(toggle_el).toggleClass("open-sidebar");
    });
    $(".swipe-area").swipe({
      swipeStatus:function(event, phase, direction, distance, duration, fingers)
      {
        if (phase=="move" && direction =="right") {
          $(".container").addClass("open-sidebar");
          return false;
        }
        if (phase=="move" && direction =="left") {
          $(".container").removeClass("open-sidebar");
          return false;
        }
      }
    });
  });

  // Init Gallary
  $(document).ready(function() {
    $('.zoom-gallery').magnificPopup({
      delegate: 'a',
      type: 'image',
      closeOnContentClick: false,
      closeBtnInside: false,
      mainClass: 'mfp-with-zoom mfp-img-mobile',
      image: {
        verticalFit: true,
        titleSrc: function(item) {
          return item.el.attr('title') + ' &middot; <a class="image-source-link" href="'+item.el.attr('data-source')+'" target="_blank">image source</a>';
        }
      },
      gallery: {
        enabled: true
      },
      zoom: {
        enabled: true,
        duration: 300, // don't foget to change the duration also in CSS
        opener: function(element) {
          return element.find('img');
        }
      }

    });
  });

  //Init Document Box
  var nodes  = document.querySelectorAll('.documents-wrapper li'),
    _nodes = [].slice.call(nodes, 0);

  var getDirection = function (ev, obj) {
    var w = obj.offsetWidth,
      h = obj.offsetHeight,
      x = (ev.pageX - obj.offsetLeft - (w / 2) * (w > h ? (h / w) : 1)),
      y = (ev.pageY - obj.offsetTop - (h / 2) * (h > w ? (w / h) : 1)),
      d = Math.round( Math.atan2(y, x) / 1.57079633 + 5 ) % 4;

    return d;
  };

  var addClass = function ( ev, obj, state ) {
    var direction = getDirection( ev, obj ),
      class_suffix = "";

    obj.className = "";

    switch ( direction ) {
      case 0 : class_suffix = '-top';    break;
      case 1 : class_suffix = '-right';  break;
      case 2 : class_suffix = '-bottom'; break;
      case 3 : class_suffix = '-left';   break;
    }

    obj.classList.add( state + class_suffix );
  };

// bind events
  _nodes.forEach(function (el) {
    el.addEventListener('mouseover', function (ev) {
      addClass( ev, this, 'in' );
    }, false);

    el.addEventListener('mouseout', function (ev) {
      addClass( ev, this, 'out' );
    }, false);
  });
});


$(document).ready(function() {
  $('.sidebar-menu').slideAndSwipe();
});
