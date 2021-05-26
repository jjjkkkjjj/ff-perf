require('c3/c3.css');
import * as c3  from 'c3';

function showSum() {
    var num1 = 1;
    var num2 = 2;
    var sum = num1 + num2;
    alert(sum);
}


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
*/

/**
 * Update graph from Object Array.
 * @param {Array} data The Object Array. The Object contains 'Date' and 'TRIMP'
 */
function updateGraph(data){


    // show graph
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
}
// global function to call this from data.js
window.updateGraph = updateGraph;

/**
 * Update all contents from csv read by Papaparse
 * @param {Object} csv data: Array, errors: Array, meta: Array
 */
function updateAll(csv){
    var data = [];
    for (const line of csv.data){
        data.push({"Date": line[0], "TRIMP": line[1]});
    }
    window.updateTable(data);
    window.updateGraph(data);
}
window.updateAll = updateAll;
