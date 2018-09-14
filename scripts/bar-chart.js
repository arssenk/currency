function redrowChart(data_1) {
    let data = createDeepCopy(data_1);

    d3.select(".convert-table__bar-chart").remove();
    d3.select(".convert-table__graph-2").append("svg").attr("class", "convert-table__bar-chart").attr("width", 500).attr("height", 200);

    var barChart = d3.select(".convert-table__bar-chart"),
        marginBar = {top: 30, right: 180, bottom: 30, left: 70},
        widthBar = +barChart.attr("width") - marginBar.left - marginBar.right,
        heightBar = +barChart.attr("height") - marginBar.top - marginBar.bottom,
        gBar = barChart.append("g").attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");

    var xBar = d3.scaleBand()
        .rangeRound([0, widthBar])
        .paddingInner(0.1);

    var yBar = d3.scaleLinear()
        .rangeRound([heightBar, 0]);
    var colorCurrencies = ["red", "blue", "orange", "green"];
    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    data.forEach(function (d) {
        var t = 0;
        if (document.getElementById("percentage_checkbox").checked && value_percentage_1 !== undefined &&
            valueCurrency1 !== undefined) {
            d.EUR_persentage = +convertToChosenCurrency(valueCurrency1, supportedCurrencies[0], choosenBoxValue) * value_percentage_1 / 100;
            d.USD_persentage = +convertToChosenCurrency(valueCurrency2, supportedCurrencies[1], choosenBoxValue) * value_percentage_2 / 100;
            d.GBP_persentage = +convertToChosenCurrency(valueCurrency3, supportedCurrencies[2], choosenBoxValue) * value_percentage_3 / 100;
            d.CAD_persentage = +convertToChosenCurrency(valueCurrency3, supportedCurrencies[3], choosenBoxValue) * value_percentage_4 / 100;

        }
        if (valueCurrency1 !== undefined) {
            d.EUR = +convertToChosenCurrency(valueCurrency1, supportedCurrencies[0], choosenBoxValue);
            d.USD = +convertToChosenCurrency(valueCurrency2, supportedCurrencies[1], choosenBoxValue);
            d.GBP = +convertToChosenCurrency(valueCurrency3, supportedCurrencies[2], choosenBoxValue);
            d.CAD = +convertToChosenCurrency(valueCurrency4, supportedCurrencies[3], choosenBoxValue);
            t += d.EUR;
            t += d.USD;
            t += d.GBP;
            t += d.CAD;

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
            switch (d.key) {
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
        .attr("x", 3)
        .attr("y", yBar(yBar.ticks().pop())-12)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .text(choosenBoxValue);

    //Leave last date
    d3.selectAll(".axis-bottom-bar>.tick:not(:last-child)").remove();

}
