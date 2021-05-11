
// load contents.json file
$(function() {
    $.getJSON("js/contents.json" , function(d) {
        var data = JSON.parse(JSON.stringify(d));
  
        data.params.forEach(function(b) {
            $("#selparams").append('<option value="' + b.value + '">' + b.text + '</option>');
        });
    });
  }
);

// show/hide tips
$(function() {
  $('#hinticon').hover(function(){
    $('#paramtips').fadeIn(500);
  },function(){
    $('#paramtips').fadeOut(500);
  });
});


// set paramtips position next to hinticon
$(document).ready(function() {
  $("#paramtips").css("left", $("#hinticon").offset().left + $("#hinticon").outerWidth());
  $("#paramtips").css("top",  -($("#hinticon").position().top + $("#hinticon").height()));
});