
// jquery-unobtrusive.js - Unobtrusive jQuery tooltip plugin.

jQuery.fn.tooltip = (function () {

  var defaults = {
    align: 'left',
    trigger: 'hover',
    open: 'fadeIn',
    close: 'fadeOut'
  };

  // define triggers
  var triggers = {
    click: function (elem, target, show, hide) {
      $('.close', target).click(function () {
        hide();
        isOpening = false;
      });

      var isOpening = false;
      $(elem).click(function () { ((isOpening = !isOpening) ? show : hide)(); });
      closeBtn.click(function () { hide(); isOpening = false; });
    },

    hover: function (elem, target, show, hide) {
      var isOpening = false,
        shouldClose = false;

      function delayedCheck() {
        setTimeout(function () {
          if (shouldClose && isOpening) {
            hide();
            isOpening = false;
            shouldClose = false;
          }
        }, 1);
      }


      $(elem).mouseenter(function () {
        shouldClose = false;

        if (isOpening) return;
        show();
        isOpening = true;
      });

      $(elem).mouseleave(function () {
        console.log("MOUSELEAVE");
        shouldClose = true;
        delayedCheck();
      });

      $(target).mouseenter(function () {
        shouldClose = false;
        delayedCheck();
      });

      $(target).mouseleave(function () {
        console.log("MOUSELEAVE");
        shouldClose = true;
        delayedCheck();
      });
    }
  };

  // define animations
  function fromJquery(funcName) {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    args.shift(); // funcName

    return function (elem) { $.fn[funcName].apply($(elem), args); }
  }

  var openers = {
    fadeIn: fromJquery('fadeIn', 'fast'),
    slideDown: fromJquery('slideDown', 'fast'),
    show: fromJquery('show', 'fast')
  };

  var closers = {
    fadeOut: fromJquery('fadeOut', 'fast'),
    slideUp: fromJquery('slideUp', 'fast'),
    hide: fromJquery('hide', 'fast')
  };

  // define aligners
  var aligners = {
    left: function (elem, target) {
      var xy = $(elem).offset();

      $(target).css({
        position: 'absolute',
        left: xy.left,
        top: xy.top + $(elem).height()
      });
    },

    right: function (elem, target) {
      var xy = $(elem).offset();

      $(target).css({
        position: 'absolute',
        left: xy.left + $(elem).width() - $(target).width(),
        top: xy.top + $(elem).height()
      });
    }
  };

  // actual tooltip function composed from triggers and open/close animations
  return function (opts) {
    opts = $.extend({}, defaults, opts);
    console.log("OPTS: %o", opts);

    $(this).each(function () {
      var me = $(this),
        target = $(me.attr('href'));

      triggers[opts.trigger](me, target, function () {
        aligners[opts.align](me, target);
        $(target).stop(true, true);
        openers[opts.open](target);
      }, function () {
        $(target).stop(true, true);
        closers[opts.close](target);
      }
      );
    });
  };

})();