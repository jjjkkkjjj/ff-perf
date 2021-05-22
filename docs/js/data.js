require('jsgrid');
require('jsgrid/dist/jsgrid.min.css');
require('jsgrid/dist/jsgrid-theme.min.css');

// load csv
$('.icontxt#import').on('click', function(){
    $('.dumfbtn').click();
});
/*
$('.dumfbtn').change(function(){
    const file = fs.createReadStream('default.csv');
    var count = 0;
});
*/

var clients = [
    { "Date": "2021/05/02", "TRIMP": 25},
    { "Date": "2021/05/03", "TRIMP": 45},
    { "Date": "2021/05/05", "TRIMP": 29},
];

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
});