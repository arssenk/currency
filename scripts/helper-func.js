function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

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

    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    d3.tsv("./data/data-bar-chart.tsv", function (error, data) {
        if (error) throw error;
        data.forEach(function (d) {
            var t = 0;
            if (value_currency_1 !== undefined) {
                t += +value_currency_1;
                t += +value_currency_2 / +d.USD;
                t += +value_currency_3 / +d.GBP;
                t += +value_currency_4 / +d.CAD;
                d.USD = +value_currency_2 / +d.USD;
                d.GBP = +value_currency_3 / +d.GBP;
                d.CAD = +value_currency_4 / +d.CAD;
            }
            d.total = t;
            return d;

        });

        var keys = ["USD", "GBP", "CAD"];
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
                return colors(d.key);
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
            .attr("y", yBar(yBar.ticks().pop()))
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .text("EUR");

        //Leave last date
        d3.selectAll(".axis-bottom-bar>.tick:not(:last-child)").remove();
    });
}