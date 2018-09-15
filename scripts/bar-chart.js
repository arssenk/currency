function redrowChart(data_1) {
    let data = createDeepCopy(data_1);

    d3.select(".convert-table__bar-chart").remove();
    d3.select(".convert-table__graph-2").append("svg").attr("class", "convert-table__bar-chart").attr("width", 500).attr("height", 200);

    let barChart = d3.select(".convert-table__bar-chart"),
        marginBar = {top: 30, right: 180, bottom: 30, left: 70},
        widthBar = +barChart.attr("width") - marginBar.left - marginBar.right,
        heightBar = +barChart.attr("height") - marginBar.top - marginBar.bottom,
        gBar = barChart.append("g").attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");

    let xBar = d3.scaleBand()
        .rangeRound([0, widthBar])
        .paddingInner(0.1);

    let yBar = d3.scaleLinear()
        .rangeRound([heightBar, 0]);


    let colors = d3.scaleOrdinal(d3.schemeCategory10);

    data.forEach(function (d) {
        let t = 0;

        //if percents are avalible add them to d object for plotting
        if (document.getElementById("percentage_checkbox").checked) {

            for (let i = 1; i < supportedCurrencies.length + 1; i++) {
                d[supportedCurrencies[i - 1] + "_percentage"] = +convertToChosenCurrency(valueCurrencyArray["valueCurrency" + i],
                        supportedCurrencies[i - 1], choosenBoxValue) * valuePercentageArray["valuePercentage" + i] / 100;
            }
        }


        for (let i = 1; i < supportedCurrencies.length + 1; i++) {
            d[supportedCurrencies[i - 1]] = +convertToChosenCurrency(valueCurrencyArray["valueCurrency" + i], supportedCurrencies[i - 1],
                choosenBoxValue);

        }

        for (let i = 0; i < supportedCurrencies.length; i++) {
            t += d[supportedCurrencies[i]]
        }

        if (document.getElementById("percentage_checkbox").checked) {
            for (let i = 0; i < supportedCurrencies.length; i++) {
                t += d[supportedCurrencies[i] + "_percentage"]
            }
        }

        d.total = t;

        return d;
    });

    let keys = [];
    if (document.getElementById("percentage_checkbox").checked) {

        //Create "EUR", "EUR_percentage", ... keys
        for (let i = 0; i < supportedCurrencies.length; i++) {
            keys.push(supportedCurrencies[i]);
            keys.push(supportedCurrencies[i] + "_percentage")
        }
    }
    else {
        keys = supportedCurrencies;
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
            if (supportedCurrencies.includes(d.key)) {
                return colorsForCurr[supportedCurrencies.indexOf(d.key)]
            }
            else {
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
        .attr("y", yBar(yBar.ticks().pop()) - 12)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .text(choosenBoxValue);

    //Leave last date
    d3.selectAll(".axis-bottom-bar>.tick:not(:last-child)").remove();

}
