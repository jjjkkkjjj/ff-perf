function showSum() {
    var num1 = 1;
    var num2 = 2;
    var sum = num1 + num2;
    alert(sum);
}

$("div#dattable").Grid({
    search: true,
    pagination: true,
    sort: true,
    columns: ['Date', 'TRIMP'],
    data: [
    ['2021/05/06', 25],
    ['2021/05/07', 59],
    // ...
    ],
});