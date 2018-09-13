function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function isNumberForPercentage(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) && n>=0 && n <=100 ;
}


function addTo() {
    valueCurrency1 = document.getElementById("currency_1").value;
    valueCurrency2 = document.getElementById("currency_2").value;
    valueCurrency3 = document.getElementById("currency_3").value;
    valueCurrency4 = document.getElementById("currency_4").value;

    if (latestCurrency2 === undefined) {
        return 0
    }
    if (isNumber(valueCurrency1)) {
        document.getElementById("currency_converted_1").value = valueCurrency1;
    }
    else {
        alert("Currency 1 needs to be a number")
    }
    if (isNumber(valueCurrency2)) {
        document.getElementById("currency_converted_2").value = (valueCurrency2 / latestCurrency2).toFixed(2);
    }
    else {
        alert("Currency 2 needs to be a number");
    }

    if (isNumber(valueCurrency3)) {
        document.getElementById("currency_converted_3").value = (valueCurrency3 / latestCurrency3).toFixed(2);
    }
    else {
        alert("Currency 3 needs to be a number");
    }
    if (isNumber(valueCurrency4)) {
        document.getElementById("currency_converted_4").value = (valueCurrency4 / latestCurrency4).toFixed(2);
    }
    else {
        alert("Currency 4 needs to be a number");
    }
    redrowChart()
}

function addToPercentage() {
    for (var i = 0; i < document.getElementsByClassName("convert-table__input-percentage-form").length; i++) {
        document.getElementsByClassName("convert-table__input-percentage-form")[i].disabled = !document.getElementById("percentage_checkbox").checked;
    }


    if (value_percentage_1 === undefined) {
        return 0
    }
    if (isNumberForPercentage(document.getElementById("input_percentage_1").value)) {
        value_percentage_1 = document.getElementById("input_percentage_1").value;
    }
    else {
        alert("Percentage 1 needs to be a number")
    }
    if (isNumberForPercentage(document.getElementById("input_percentage_2").value)) {
        value_percentage_2 = document.getElementById("input_percentage_2").value;
    }
    else {
        alert("Percentage 2 needs to be a number");
    }

    if (isNumberForPercentage(document.getElementById("input_percentage_3").value)) {
        value_percentage_3 = document.getElementById("input_percentage_3").value;
    }
    else {
        alert("Percentage 3 needs to be a number");
    }
    if (isNumberForPercentage(document.getElementById("input_percentage_4").value)) {
        value_percentage_4 = document.getElementById("input_percentage_4").value;
    }
    else {
        alert("Percentage 4 needs to be a number");
    }
    redrowChart()

}

function redrowChart() {
    d3.select(".convert-table__bar-chart").remove();
    d3.select(".convert-table__graph-2").append("svg").attr("class", "convert-table__bar-chart").attr("width", 400).attr("height", 200);

    var barChart = d3.select(".convert-table__bar-chart"),
        marginBar = {top: 20, right: 130, bottom: 30, left: 30},
        widthBar = +barChart.attr("width") - marginBar.left - marginBar.right,
        heightBar = +barChart.attr("height") - marginBar.top - marginBar.bottom,
        gBar = barChart.append("g").attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");

    var xBar = d3.scaleBand()
        .rangeRound([0, widthBar])
        .paddingInner(0.05);

    var yBar = d3.scaleLinear()
        .rangeRound([heightBar, 0]);
    var colorCurrencies = ["red", "blue", "orange", "green"];
    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    d3.tsv("./data/data-bar-chart.tsv", function (error, data) {
        if (error) throw error;
        data.forEach(function (d) {
            var t = 0;
            if (document.getElementById("percentage_checkbox").checked && value_percentage_1 !== undefined &&
                valueCurrency1 !== undefined) {

                d.EUR_persentage = valueCurrency1 * +value_percentage_1 / 100;
                d.USD_persentage = valueCurrency2 * value_percentage_2 / 100;
                d.GBP_persentage = valueCurrency3 * value_percentage_3 / 100;
                d.CAD_persentage = valueCurrency4 * value_percentage_4 / 100;

                console.log(value_percentage_3, valueCurrency1)
            }
            if (valueCurrency1 !== undefined) {
                d.EUR = +valueCurrency1;

                t += d.EUR;
                t += valueCurrency2 / +d.USD;
                t += valueCurrency3 / +d.GBP;
                t += valueCurrency4 / +d.CAD;

                d.USD = valueCurrency2 / +d.USD;
                d.GBP = valueCurrency3 / +d.GBP;
                d.CAD = valueCurrency4 / +d.CAD;

                if (document.getElementById("percentage_checkbox").checked) {
                    t += d.EUR_persentage;
                    t += d.USD_persentage;
                    t += d.GBP_persentage;
                    t += d.CAD_persentage
                }

            }
            d.total = t;

            return d;

        });
        var keys = [];

        if (document.getElementById("percentage_checkbox").checked) {
            keys = ["EUR", "EUR_persentage", "USD", "USD_persentage", "GBP", "GBP_persentage", "CAD", "CAD_persentage"];
        }
        else {
            keys = ["EUR", "USD", "GBP", "CAD"];
        }
        xBar.domain(data.map(function (d) {
            return d.date;
        }));
        yBar.domain([0, d3.max(data, function (d) {
            return d.total;
        })]);

        colors.domain(keys);
        gBar.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(data))
            .enter().append("g")
            .attr("fill", function (d) {
                switch(d.key) {

                    case "EUR":
                        return colorCurrencies[0];
                        break;
                    case "USD":
                        return colorCurrencies[1];
                        break;
                    case "GBP":
                        return colorCurrencies[2];
                        break;
                    case "CAD":
                        return colorCurrencies[3];
                        break;
                    default:
                        return colors(d.key);
                }
            })
            .selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return xBar(d.data.date)
            })
            .attr("y", function (d) {
                return yBar(d[1]);
            })
            .attr("height", function (d) {
                return yBar(d[0]) - yBar(d[1]);
            })
            .attr("width", xBar.bandwidth());

        gBar.append("g")
            .attr("class", "axis-bottom-bar")
            .attr("transform", "translate(0," + heightBar + ")")
            .call(d3.axisBottom(xBar));

        gBar.append("g")
            .attr("class", "axis-left-bar")
            .call(d3.axisLeft(yBar))
            .append("text")
            .attr("x", 30)
            .attr("y", yBar(yBar.ticks().pop()) + 4)
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .text("EUR");

        //Leave last date
        d3.selectAll(".axis-bottom-bar>.tick:not(:last-child)").remove();
    });
}