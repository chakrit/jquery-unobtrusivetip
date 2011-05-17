
// site.js - Main site functionality.
$(function () {

  $("#normalTooltip").tooltip();
  $("#rightTooltip").tooltip({ align: 'right' });
  $("#clickTooltip").tooltip({ trigger: 'click' });
  $("#hoverTooltip").tooltip({ trigger: 'hover' });
  $("#slideTooltip").tooltip({ open: 'slideDown', close: 'slideUp' });
  $("#fadeTooltip").tooltip({ open: 'fadeIn', close: 'fadeOut' });


});