var Chart = require('chart.js');
import moment from 'moment';
require('moment');
import saveAs from 'file-saver';

$(document).ready(function() {
    $('#export').click(function() {
        var canvas = $('#datgraph').get(0);
        canvas.toBlob(function(blob) {
            saveAs(blob, "ff-perf.png");
        });
    });
});

/**
 * Update graph from Object Array.
 * @param {Array} data The Object Array. The Object contains 'Date' and 'TRIMP'
 */
function updateGraph(data){
    var k1 = parseFloat($('#k1').val());
    var k2 = parseFloat($('#k2').val());
    var tau1 = parseFloat($('#tau1').val());
    var tau2 = parseFloat($('#tau2').val());

    if (isNaN(k1) || isNaN(k2) || isNaN(tau1) || isNaN(tau2)){
        return;
    }

    var dtr = parseDaysTRIMPs(data);
    var days = dtr[0];
    var trimps = dtr[1];
    var fitnesses = calcff(days, trimps, tau1, k1);
    var fatigues = calcff(days, trimps, tau2, k2);
    var performances = calcPerformance(fitnesses, fatigues);
    

    // calculate a crossing point between fitnesses and fatigues
    var crsIndex = calcCrossingPointIndex(fitnesses, fatigues);
    
    // draw
    // chart
    var chart = {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'Fitnesses',
                    data: fitnesses,
                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                    borderColor: 'rgba(0, 0, 255, 0.5)',
                    fill: false,
                    pointBackgroundColor: 'rgb(0, 0, 255)'
                },
                {
                    label: 'Fatigues',
                    data: fatigues,
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    borderColor: 'rgba(255, 0, 0, 0.5)',
                    fill: false,
                    pointBackgroundColor: 'rgb(255, 0, 0)'
                },
                {
                    label: 'Performances',
                    data: performances,
                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
                    borderColor: 'rgba(0, 255, 0, 0.5)',
                    fill: false,
                    pointBackgroundColor: 'rgb(0, 255, 0)'
                },
            ]
        },
        
        options: {
            // add crossing point line
            // Set the index of the value where you want to draw the line
            lineAtIndex: crsIndex,
            legend: {
              display: true
            },
            responsive: true
        }
    }
    

    // ref: https://stackoverflow.com/questions/45023773/chart-js-what-is-the-new-syntax-for-extending
    var addVerticalLine = Chart.controllers.line.prototype.draw;

    var ctx = $('#datgraph').get(0);

    // background
    var backgroundColor = 'white';
    Chart.plugins.register({
        beforeDraw: function(c) {
            var ctx = c.chart.ctx;
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, c.chart.width, c.chart.height);
        }
    });
    Chart.helpers.extend(Chart.controllers.line.prototype, {
        draw: function () {
        
            addVerticalLine.apply(this, arguments);   

            var chart = this.chart;
            var ctx = chart.chart.ctx;

            var index = chart.config.options.lineAtIndex;
            if (index == -1){
                return;
            }
            var xaxis = chart.scales['x-axis-0'];
            var yaxis = chart.scales['y-axis-0'];
            
            // draw vertical line
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(xaxis.getPixelForValue(undefined, index), yaxis.top + 24);
            // color
            ctx.strokeStyle = '#ff0000';
            ctx.lineTo(xaxis.getPixelForValue(undefined, index), yaxis.bottom);
            ctx.stroke();
            ctx.restore();

            ctx.textAlign = 'center';
            ctx.fillText("Crossing Day", xaxis.getPixelForValue(undefined, index), yaxis.top + 12);

        }
    });

    new Chart(ctx, chart);
}
// global function to call this from data.js
window.updateGraph = updateGraph;

/**
 * Calculate days and trimps from data
 * @param {Array} data The Object Array. The Object contains 'Date' and 'TRIMP'
 * @returns {Array} [days, trimps]
 */
function parseDaysTRIMPs(data){
    var firstdate = moment(data[0].Date, ["MM-DD-YYYY", "YYYY-MM-DD", "YYYY/MM/DD"]);
    var days = [];
    var trimps = [];
    for (const d of data) {
        var currdate = moment(d.Date, ["MM-DD-YYYY", "YYYY-MM-DD", "YYYY/MM/DD"]); 
        var day = currdate.diff(firstdate, 'days');
        days.push(day);
        trimps.push(d.TRIMP);
    }

    return [days, trimps];
}

/**
 * Update graph from Object Array.
 * @param {Array} days The Date Array.
 * @param {Array} trimps The TRIMP Array.
 * @param {Float} tau The time coefficient
 * @param {Float} weight The weight
 * @returns {Array} the convolution Array between damping function and TRIMP
 */
function calcff(days, trimps, tau, weight){
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
 * Calculate a crossing point index.
 * @param {Array} fitnesses The fitness array.
 * @param {Array} fatigues The fatigue array.
 * @returns {Int} The crossing point's index. If the crossing point is none, return -1.
 */
function calcCrossingPointIndex(fitnesses, fatigues){
    // fitnesses and fatigues must have a same size.
    for (var i = 0; i < fitnesses.length; i++){
        if (fatigues[i] < fitnesses[i]){
            return i;
        }
    }
    return -1;
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