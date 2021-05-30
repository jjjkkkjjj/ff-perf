// load contents.json file
$(function() {
    $.getJSON("assets/contents.json" , function(d) {
        var data = JSON.parse(JSON.stringify(d));

        // append option
        data.params.forEach(function(b) {
            $("#selparams").append('<option value="' + b.value + '">' + b.text + '</option>');
        });
        // set data
        updateParams();
    });
  }
);


function updateParams(){
  $.getJSON("assets/contents.json" , function(d) {
    var data = JSON.parse(JSON.stringify(d));

    var selectedIndex = $("#selparams").prop('selectedIndex');
    var selectedParam =  data.params[selectedIndex].params;
    $('#k1').val(selectedParam.k1);
    $('#k2').val(selectedParam.k2);
    $('#tau1').val(selectedParam.tau1);
    $('#tau2').val(selectedParam.tau2);
  });
}


$(function() {
  // show/hide tips
  $('#hinticon').hover(function(){
    $('#paramtips').fadeIn(500);
  },function(){
    $('#paramtips').fadeOut(500);
  });

  // select value change event
  $('#selparams').change(function() {
    updateParams();
  });
});


// set paramtips position next to hinticon
$(document).ready(function() {
  $("#paramtips").css("left", $("#hinticon").offset().left + $("#hinticon").outerWidth());
  $("#paramtips").css("top",  -($("#hinticon").position().top + $("#hinticon").height()));
});