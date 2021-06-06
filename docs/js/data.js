import 'jquery-ui/ui/widgets/autocomplete.js';
import 'jquery-ui/ui/widgets/datepicker.js';
import 'jquery-ui/ui/i18n/datepicker-en-GB.js';
import 'jquery-ui/themes/base/all.css';

require('jsgrid');
require('jsgrid/dist/jsgrid.min.css');
require('jsgrid/dist/jsgrid-theme.min.css');
import moment from 'moment';
require('moment');


const papa = require('papaparse');

/**
 * Call this function on loaded Dom
 */
 $(window).ready(function() {
    // Set custom datefield
    // https://codepen.io/beaver71/pen/OzPXQX
    var DateField = function(config) {
        jsGrid.Field.call(this, config);
        };

        DateField.prototype = new jsGrid.Field({
        sorter: function(date1, date2) {
            return new Date(date1) - new Date(date2);
        },
        itemTemplate: function(value) {
            return moment(new Date(value), 'YYYY-MM-DD').format("YYYY/MM/DD");
        },
        insertTemplate: function(value) {
            return this._insertPicker = $("<input>").datepicker({ defaultDate: new Date() });
        },
        editTemplate: function(value) {
            return this._editPicker = $("<input>").datepicker().datepicker("setDate", new Date(value));
        },
        insertValue: function() {
            return moment(this._insertPicker.datepicker("getDate"), 'YYYY-MM-DD').format("YYYY/MM/DD");
        },
        editValue: function() {
            return moment(this._editPicker.datepicker("getDate"), 'YYYY-MM-DD').format("YYYY/MM/DD");
        }
    });

    jsGrid.fields.dateField = DateField;

    // set data as global variable
    window.data = []
    if ($(window).width() > 1024){
        var width = "100%";
    }
    else{
        var width = $('#grapharea').width();
    }
    var graph = $("#dattable").jsGrid({
        width: width,
        height: "auto",
    
        inserting: true,
        editing: true,
        sorting: true,
        paging: true,
    
        data: window.data,
    
        fields: [
            { name: "Date", type: "dateField", align: "center", validate: "required" },
            { name: "TRIMP", type: "number", align: "center", validate: "required" },
            { type: "control" }
        ],

        // callback
        // deleted event
        onItemDeleted: function(args) {
            // cancel deletion of the item with 'protected' field
            if(args.item.protected) {
                args.cancel = true;
            }
            // update
            window.updateFromContent();
        },
        // updated event
        onItemUpdated: function(args) {
            // cancel deletion of the item with 'protected' field
            if(args.item.protected) {
                args.cancel = true;
            }
            // update
            window.updateFromContent();
        },
        // inserted event
        onItemInserted: function(args) {
            // cancel deletion of the item with 'protected' field
            if(args.item.protected) {
                args.cancel = true;
            }
            // update
            window.updateFromContent();
        }
        
    });
    window.graph = graph;

    $.ajaxSetup({ async: false });
    // below reading json code will be done async due to above code
    $.getJSON("assets/contents.json" , function(d) {
        var data = JSON.parse(JSON.stringify(d));

        // append option
        data.params.forEach(function(b) {
            $("#selparams").append('<option value="' + b.value + '">' + b.text + '</option>');
        });
        // set data
        window.updateParams();
    });
    // revert async setting
    $.ajaxSetup({ async: true }); 


    // load default csv
    parseCSVAndUpdate_from_string('assets/default.csv');
});

// import csv
$('.icontxt#import').on('click', function(){
    $('.dumfbtn').click();
});
$('.dumfbtn').change(function(){
    const file = this.files[0];
    parseCSVAndUpdate_from_DOM(file);
});

// export to png
$('.icontxt#export').on('click', function(){
    /*
    $("#myChart").get(0).toBlob(function(blob) {
        saveAs(blob, "chart_1.png");
    });*/
});

// resizing event
$(window).resize(function(){
    if ($(window).width() > 1024){
        var width = "100%";
    }
    else{
        var width = $('#grapharea').width();
    }
    $("#dattable").jsGrid("option", "width", width);

});

/**
 * Parse CSV from a selected file and update contents
 * @param {File} file The File object from DOM
 */
function parseCSVAndUpdate_from_DOM(file){
    var reader = new FileReader();
    // async
    reader.onload = function(event) {
        var csv = papa.parse(event.target.result);  
        window.updateAll(csv);
    }

    // call above onload function asynchronously
    reader.readAsText(file);
}

/**
 * Parse CSV from path and update contents
 * @param {String} str The csv path
 */
function parseCSVAndUpdate_from_string(path){
    fetch(path)
        .then(response => response.text())
        .then(str => {
            // async
            var csv = papa.parse(str);
            window.updateAll(csv);
    });
}


/**
 * Update table from Object Array.
 * @param {Array} data The Object Array. The Object contains 'Date' and 'TRIMP'
 */
function updateTable(data){
    // size
    if ($(window).width() > 1024){
        var width = "100%";
    }
    else{
        var width = $('#grapharea').width();
    }
    $("#dattable").jsGrid("option", "width", width);

    // data
    $("#dattable").jsGrid("option", "data", data);
}
window.updateTable = updateTable;

function sortdata(){
    if (window.data.length > 2){
        return;
    }

    window.data.sort((d1, d2) => {
        return new Date(d1.Date) - new Date(d2.Date);
    })
}
window.sortdata = sortdata;

