
// load contents.json file
$(function() {
    $.getJSON("js/contents.json" , function(d) {
        var data = JSON.parse(JSON.stringify(d));
  
        data.params.forEach(function(b) {
            $("#parameters").append('<option value="' + b.value + '">' + b.text + '</option>');
          });
    });
  });