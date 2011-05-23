
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
      var isOpening = false;

      $(elem).click(function () { ((isOpening = !isOpening) ? show : hide)(); });
      $('.close', target).click(function () {
        hide();
        isOpening = false;
      });
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
        shouldClose = true;
        delayedCheck();
      });

      $(target).mouseenter(function () {
        shouldClose = false;
      });

      $(target).mouseleave(function () {
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

    // resolve function to use depending on options
    var trigger = triggers[opts.trigger],
      aligner = aligners[opts.align],
      opener = openers[opts.open],
      closer = closers[opts.close];

    $(this).each(function () {
      var me = $(this),
        target = $(me.attr('href'));

      trigger(me, target, function () {
        aligner(me, target);

        $(target).stop(true, true);
        opener(target);
      }, function () {
        $(target).stop(true, true);
        closer(target);
      });
    });
  };

})();