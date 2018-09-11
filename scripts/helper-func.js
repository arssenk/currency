function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// function getCurrent_currency() {
//
//
//     d3.tsv("../data/data-latest.tsv", function (data) {
//         console.log(data);
//         latest_currency_2 = +data[0].USD;
//         latest_currency_3 = +data[0].GBP;
//         latest_currency_4 = +data[0].CAD;
//
//     });
//     return [latest_currency_2, latest_currency_3, latest_currency_4]
// }

function addTo() {
    value_currency_1 = document.getElementById("currency_1").value;
    value_currency_2 = document.getElementById("currency_2").value;
    value_currency_3 = document.getElementById("currency_3").value;
    value_currency_4 = document.getElementById("currency_4").value;

    if (latest_currency_2 === undefined) {
        return 0
    }
    if (isNumber(value_currency_1)) {
        document.getElementById("currency_converted_1").value = value_currency_1;
    }
    else {
        alert("Currency 1 needs to be a number")
    }
    if (isNumber(value_currency_2)) {
        document.getElementById("currency_converted_2").value = (value_currency_2 / latest_currency_2).toFixed(2);
    }
    else {
        alert("Currency 2 needs to be a number");
    }

    if (isNumber(value_currency_3)) {
        document.getElementById("currency_converted_3").value = (value_currency_3 / latest_currency_3).toFixed(2);
    }
    else {
        alert("Currency 3 needs to be a number");
    }
    if (isNumber(value_currency_4)) {
        document.getElementById("currency_converted_4").value = (value_currency_4 / latest_currency_4).toFixed(2);
    }
    else {
        alert("Currency 4 needs to be a number");
    }

}