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


/**
 * Update graph from Object Array.
 * @param {Array} data The Object Array. The Object contains 'Date' and 'TRIMP'
 */
function updateGraph(data){
    var k1 = $('#k1').val();
    var k2 = $('#k2').val();
    var tau1 = $('#tau1').val();
    var tau2 = $('#tau2').val();

    var fitnesses = calcff(data, tau1, k1);
    var fatigues = calcff(data, tau2, k2);
    var performances = calcPerformance(fitnesses, fatigues);
    
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
        ],
        type: "spline",
        }
    });
}
// global function to call this from data.js
window.updateGraph = updateGraph;

/**
 * Update graph from Object Array.
 * @param {Array} data The Object Array. The Object contains 'Date' and 'TRIMP'
 * @param {Float} tau The time coefficient
 * @param {Float} weight The weight
 * @returns {Array} the convolution Array between damping function and TRIMP
 */
function calcff(data, tau, weight){
    var firstdate = moment(data[0].Date, ["MM-DD-YYYY", "YYYY-MM-DD", "YYYY/MM/DD"]);
    var days = [];
    var trimps = [];
    for (const d of data) {
        var currdate = moment(d.Date, ["MM-DD-YYYY", "YYYY-MM-DD", "YYYY/MM/DD"]); 
        var day = currdate.diff(firstdate, 'days');
        days.push(day);
        trimps.push(d.TRIMP);
    }

    // convolution
    // exps * trimps
    var convs = [];
    convs.push(weight*trimps[0]);
    for (var i = 1; i < days.length; i++){
        var dt = days[i] - days[i-1];
        var c = weight*trimps[i] + convs[i-1]*Math.exp(-dt/tau);
        convs.push(c);
    }

    return convs;
}

/**
 * Calculate performances.
 * @param {Array} fitnesses The fitness array.
 * @param {Array} fatigues The fatigue array.
 * @returns {Array} The performance array.
 */
function calcPerformance(fitnesses, fatigues){
    // fitnesses and fatigues must have a same size.
    var performances = [];
    for (var i = 0; i < fitnesses.length; i++){
        performances.push(fitnesses[i] - fatigues[i]);
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

    window.data = data;
    window.sortdata();

    window.updateTable(data);
    window.updateGraph(data);
}
window.updateAll = updateAll;

function updateFromContent(){
    window.sortdata();
    var data = window.data;

    window.updateTable(data);
    window.updateGraph(data);
}
window.updateFromContent = updateFromContent;