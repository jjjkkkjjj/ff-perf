require('../node_modules/c3/c3.css');
import * as c3  from 'c3';
var $ = require('jquery');


// load csv
/*
$('.icontxt#import').on('click', function(){
    $('.dumfbtn').click();
});

$('.dumfbtn').change(function(){
    const file = fs.createReadStream('default.csv');
    var count = 0;
});
*/

function showSum() {
    var num1 = 1;
    var num2 = 2;
    var sum = num1 + num2;
    alert(sum);
}

// table
var clients = [
    { "Date": "2021/05/02", "TRIMP": 25},
    { "Date": "2021/05/03", "TRIMP": 45},
    { "Date": "2021/05/05", "TRIMP": 29},
];

// date
// https://codepen.io/beaver71/pen/OzPXQX
/*
var DateField = function(config) {
    jsGrid.Field.call(this, config);
    };

    DateField.prototype = new jsGrid.Field({
    sorter: function(date1, date2) {
        return new Date(date1) - new Date(date2);
    },
    itemTemplate: function(value) {
        return new Date(value).toDateString();
    },
    insertTemplate: function(value) {
        return this._insertPicker = $("<input>").datepicker({ defaultDate: new Date() });
    },
    editTemplate: function(value) {
        return this._editPicker = $("<input>").datepicker().datepicker("setDate", new Date(value));
    },
    insertValue: function() {
        return this._insertPicker.datepicker("getDate").toISOString();
    },
    editValue: function() {
        return this._editPicker.datepicker("getDate").toISOString();
    }
    });

jsGrid.fields.dateField = DateField;

$("#dattable").jsGrid({
    width: "100%",
    height: "auto",

    inserting: true,
    editing: true,
    sorting: true,
    paging: true,

    data: clients,

    fields: [
        { name: "Date", type: "text", width: 150, align: "center", validate: "required" },
        { name: "TRIMP", type: "number", width: 50, align: "center", validate: "required" },
        { type: "control" }
    ]
});*/


// graph
$(function () {
    
    // graph
    var chart = c3.generate({
        bindto: '#datgraph',
        size: {
            height: $("#datgraph").height(),
            width: $("datgraph").width()
        },
        padding: {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40,
        },
        data: {
        columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 50, 20, 10, 40, 15, 25]
        ]
        }
    });
});


