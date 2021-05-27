require('c3/c3.css');
import * as c3  from 'c3';
import moment from 'moment';
require('moment');

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
    var fatigues = calcff(data, 10);
    var fitnesses = calcff(data, 45);
    var performances = calcPerformance(fitnesses, fatigues, 1, 2);
    
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
            ['Fitnesses'].concat(fitnesses),
            ['Fatigues'].concat(fatigues),
            ['Performances'].concat(performances)
        ]
        }
    });
}
// global function to call this from data.js
window.updateGraph = updateGraph;

/**
 * Update graph from Object Array.
 * @param {Array} data The Object Array. The Object contains 'Date' and 'TRIMP'
 * @returns {Array} the convolution Array between damping function and TRIMP
 */
function calcff(data, tau){
    var firstdate = moment(data[0].Date);
    var exps = [];
    var trimps = [];
    for (const d of data) {
        var currdate = moment(d.Date); 
        var day = currdate.diff(firstdate, 'days');
        exps.push(Math.exp(-day/tau));
        trimps.push(d.TRIMP);
    }

    // convolution
    // exps * trimps
    trimps = trimps.reverse();
    var conv = [];
    for (var i = 0; i < (exps.length + trimps.length - 1); i++){
        var startInd = i - trimps.length + 1;
        var value = 0.0;
        for (var tInd = 0; tInd < trimps.length; tInd++){
            var eInd = startInd + tInd;
            if (eInd < 0){
                value += 0;
            }
            else if (eInd < exps.length){
                value += exps[eInd]*trimps[tInd];
            }
            else{
                value += 0;
            }
        }
        conv.push(value);
    }

    return conv;
}

/**
 * Calculate performances.
 * @param {Array} fitnesses The fitness array.
 * @param {Array} fatigues The fatigue array.
 * @param {Float} k_fit The coefficient value of fitness.
 * @param {Float} k_fat The coefficient value of fatigue.
 * @returns {Array} The performance array.
 */
function calcPerformance(fitnesses, fatigues, k_fit, k_fat){
    // fitnesses and fatigues must have a same size.
    var performances = [];
    for (var i = 0; i < fitnesses.length; i++){
        performances.push(k_fit*fitnesses[i] - k_fat*fatigues[i]);
    }
    return performances;
}

/**
 * Update all contents from csv read by Papaparse
 * @param {Object} csv data: Array, errors: Array, meta: Array
 */
function updateAll(csv){
    var data = [];
    csv.data.forEach(function(line, i){
        
        var datestr = line[0];
        var date = Date.parse(datestr);
        if (isNaN(date)) {
            alert(`The line ${i+1}: ${datestr} is invalid. This must be date(yyyy/mm/dd) format!`);
        }

        var trimp = parseFloat(line[1]);
        if (isNaN(trimp)) {
            alert(`The line ${i+1}: ${trimp} is invalid. This must be number!`);
        }
        data.push({"Date": datestr, "TRIMP": trimp});
    });

    window.updateTable(data);
    window.updateGraph(data);
}
window.updateAll = updateAll;
